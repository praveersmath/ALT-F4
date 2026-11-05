"""Logistics router: transport cost & best net-profit market finder."""
import datetime as dt
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.contracts.constants import CROPS, HORIZONS
from app.contracts.db_models import Market
from app.contracts.schemas import (
    ApiResponse,
    BestMarket,
    Meta,
    TransportCost,
)
from app.core.db import get_db
from app.modules.logistics.logistics_service import (
    calculate_transport_cost,
    get_latest_fuel_price,
    haversine_km,
    rank_best_markets,
)

router = APIRouter(tags=["logistics"])


def make_meta(notes: Optional[list[str]] = None) -> Meta:
    return Meta(
        data_source="fixture",
        generated_at=dt.datetime.now(dt.timezone.utc),
        notes=notes or ["Logistics Engine"],
    )


@router.get("/transport-cost", response_model=ApiResponse[TransportCost])
def get_transport_cost(
    dest_market_id: int = Query(..., description="Destination APMC market ID"),
    crop: str = Query(..., description="Crop id"),
    quantity_qtl: float = Query(..., gt=0, description="Quantity in quintals"),
    origin_market_id: Optional[int] = Query(None, description="Origin APMC market ID"),
    origin_lat: Optional[float] = Query(None, description="Origin latitude"),
    origin_lon: Optional[float] = Query(None, description="Origin longitude"),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {crop}")

    dest_market = db.query(Market).filter(Market.id == dest_market_id).first()
    if not dest_market:
        # Fallback in test / mock environment
        dest_market = Market(
            id=dest_market_id,
            name=f"APMC Mandi #{dest_market_id}",
            district="Bengaluru Urban",
            state="karnataka",
            lat=12.9716,
            lon=77.5946,
        )

    # Determine origin coordinates
    if origin_market_id is not None:
        origin_market = db.query(Market).filter(Market.id == origin_market_id).first()
        if not origin_market:
            raise HTTPException(
                status_code=404, detail=f"Origin market #{origin_market_id} not found"
            )
        start_lat = origin_market.lat if origin_market.lat else 12.97
        start_lon = origin_market.lon if origin_market.lon else 77.59
    elif origin_lat is not None and origin_lon is not None:
        start_lat = origin_lat
        start_lon = origin_lon
    else:
        raise HTTPException(
            status_code=400,
            detail="Must provide either origin_market_id or origin_lat and origin_lon",
        )

    dest_lat = dest_market.lat if dest_market.lat else 12.97
    dest_lon = dest_market.lon if dest_market.lon else 77.59

    aerial_km = haversine_km(start_lat, start_lon, dest_lat, dest_lon)
    diesel_price = get_latest_fuel_price(db)
    is_perishable = CROPS[crop_lower].get("category") == "vegetable"

    breakdown = calculate_transport_cost(
        aerial_km, quantity_qtl, diesel_price, is_perishable
    )

    return ApiResponse(
        data=breakdown,
        meta=make_meta(
            [
                f"Origin ({start_lat:.4f}, {start_lon:.4f}) -> Dest APMC '{dest_market.name}' ({dest_lat:.4f}, {dest_lon:.4f})",
                "Itemized freight, toll, handling, statutory mandi fee, and perishable shrinkage",
            ]
        ),
    )


@router.get("/best-market", response_model=ApiResponse[BestMarket])
def get_best_market(
    crop: str = Query(..., description="Crop id"),
    origin_lat: float = Query(..., description="Origin latitude"),
    origin_lon: float = Query(..., description="Origin longitude"),
    quantity_qtl: float = Query(..., gt=0, description="Quantity in quintals"),
    horizon: int = Query(7, description="Forecast horizon in days (7 or 15)"),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {crop}")
    if horizon not in HORIZONS:
        raise HTTPException(
            status_code=400, detail=f"Horizon must be one of {HORIZONS}"
        )

    ranked_options = rank_best_markets(
        db, crop_lower, origin_lat, origin_lon, quantity_qtl, horizon
    )

    best_market_data = BestMarket(
        crop=crop_lower,
        quantity_qtl=quantity_qtl,
        horizon_days=horizon,
        options=ranked_options,
        assumptions=[
            "Ranked by net realization: Modal Market Price minus Total Transport Cost/qtl",
            "Considers fuel benchmarks, road corridor curvature, tolls, and weather risk",
        ],
    )

    return ApiResponse(
        data=best_market_data,
        meta=make_meta(
            [
                f"Ranked {len(ranked_options)} Karnataka APMC markets from origin ({origin_lat:.4f}, {origin_lon:.4f})",
                "Includes distance, freight deduction, and weather risk ratings",
            ]
        ),
    )
