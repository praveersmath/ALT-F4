"""FastAPI Router for Part 2 Intelligence endpoints."""
import datetime as dt
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.contracts.constants import CROPS, HORIZONS
from app.contracts.db_models import Market
from app.contracts.schemas import (
    ApiResponse,
    Atlas,
    CropRecommendations,
    Forecast,
    HikeAlert,
    Meta,
    ModelMetrics,
    MspAdvisory,
)
from app.core.db import get_db
from app.modules.intelligence.advisory_service import (
    get_crop_recommendations_for_district,
    get_msp_advisory_for_crop,
)
from app.modules.intelligence.alert_service import (
    build_atlas_view,
    evaluate_district_hike_alerts,
)
from app.modules.intelligence.model_service import (
    generate_forecast_points,
    train_and_evaluate_model,
)

router = APIRouter(tags=["intelligence"])


def make_meta(notes: Optional[List[str]] = None, source: str = "fixture") -> Meta:
    return Meta(
        data_source=source,
        generated_at=dt.datetime.now(dt.timezone.utc),
        notes=notes or ["Part 2 Intelligence Engine"],
    )


@router.get("/forecast", response_model=ApiResponse[Forecast])
def get_forecast(
    crop: str = Query(..., description="Crop id, e.g. tomato, onion, wheat"),
    market_id: int = Query(..., description="APMC Market ID"),
    horizon: int = Query(7, description="Forecast horizon in days (7 or 15)"),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {crop}")
    if horizon not in HORIZONS:
        raise HTTPException(
            status_code=400,
            detail=f"Horizon must be one of {HORIZONS}, got {horizon}",
        )

    market = db.query(Market).filter(Market.id == market_id).first()
    market_name = market.name if market else f"Market #{market_id}"

    current_price, points, status = generate_forecast_points(
        db, crop_lower, market_id, horizon
    )

    metrics = None
    if status == "ok":
        metrics = train_and_evaluate_model(db, crop_lower, horizon)

    forecast_data = Forecast(
        crop=crop_lower,
        market_id=market_id,
        market=market_name,
        horizon_days=horizon,
        current_price=current_price,
        status=status,
        points=points,
        model_name="ridge_lag_model" if status == "ok" else None,
        metrics=metrics,
    )

    return ApiResponse(
        data=forecast_data,
        meta=make_meta(
            notes=[
                f"{horizon}-day modal price trajectory with 90% confidence bands",
                f"Evaluation benchmarked against seasonal-naive baseline",
            ]
        ),
    )


@router.get("/hike-alerts", response_model=ApiResponse[List[HikeAlert]])
def get_hike_alerts(
    crop: str = Query(..., description="Crop id"),
    state: str = Query("karnataka", description="State name"),
    horizon: int = Query(7, description="Forecast horizon in days"),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {crop}")

    alerts = evaluate_district_hike_alerts(db, crop_lower, state.lower(), horizon)

    return ApiResponse(
        data=alerts,
        meta=make_meta(
            notes=[
                "Alert levels: Green (<5%), Amber (5-15%), Red (>15%)",
                "Statistical spikes identified via 1.5 sigma threshold over historical window",
            ]
        ),
    )


@router.get("/atlas", response_model=ApiResponse[Atlas])
def get_atlas(
    crop: str = Query(..., description="Crop id"),
    state: str = Query("karnataka", description="State name"),
    horizon: int = Query(7, description="Forecast horizon in days"),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {crop}")

    atlas_data = build_atlas_view(db, crop_lower, state.lower(), horizon)

    return ApiResponse(
        data=atlas_data,
        meta=make_meta(
            notes=[
                "Aggregated district-level pricing momentum and forward outlook",
                "Integrates regional APMC arrivals and seasonal trend projection",
            ]
        ),
    )


@router.get("/model-metrics", response_model=ApiResponse[List[ModelMetrics]])
def get_model_metrics(
    crop: str = Query(..., description="Crop id"),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {crop}")

    metrics_list: List[ModelMetrics] = []
    for h in HORIZONS:
        m = train_and_evaluate_model(db, crop_lower, h)
        metrics_list.append(m)

    return ApiResponse(
        data=metrics_list,
        meta=make_meta(
            notes=[
                "Time-series split evaluation against seasonal-naive baseline",
                "Evaluates MAPE (Mean Absolute Percentage Error) and RMSE (Root Mean Squared Error)",
            ]
        ),
    )


@router.get("/crop-recommendations", response_model=ApiResponse[CropRecommendations])
def get_crop_recommendations(
    district: str = Query(..., description="District name"),
    db: Session = Depends(get_db),
):
    recommendations = get_crop_recommendations_for_district(db, district)

    return ApiResponse(
        data=recommendations,
        meta=make_meta(
            notes=[
                "Seasonal agro-climatic zone suitability scoring",
                "Considers price momentum, storage resilience, and MSP safety net",
            ]
        ),
    )


@router.get("/msp-advisory", response_model=ApiResponse[MspAdvisory])
def get_msp_advisory(
    crop: str = Query(..., description="Crop id"),
    district: str = Query(..., description="District name"),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    if crop_lower not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {crop}")

    advisory = get_msp_advisory_for_crop(db, crop_lower, district)

    return ApiResponse(
        data=advisory,
        meta=make_meta(
            notes=[
                "Official notified MSP vs prevailing local APMC market price",
                "Actionable dispatch and procurement recommendations",
            ]
        ),
    )
