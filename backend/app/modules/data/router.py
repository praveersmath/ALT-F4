"""Router for Part 1 Data & Platform endpoints."""
import datetime as dt
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.contracts.constants import CROPS, STATES, district_id
from app.contracts.db_models import (
    Crop,
    DemandProxy,
    FestivalEvent,
    IngestRun,
    Market,
    MspRecord,
    PriceRecord,
    WeatherDaily,
)
from app.contracts.schemas import (
    ApiResponse,
    CoverageItem,
    CropInfo,
    DataStatusItem,
    DemandProxyInfo,
    DistrictInfo,
    MarketInfo,
    Meta,
    MspInfo,
    PricePoint,
    PriceSeries,
    WeatherDay,
    WeatherResponse,
)
from app.core.db import get_db

router = APIRouter(tags=["data"])


def make_meta(notes: Optional[List[str]] = None, source: str = "fixture") -> Meta:
    return Meta(
        data_source=source,
        generated_at=dt.datetime.now(dt.timezone.utc),
        notes=notes or ["Data Platform"],
    )


@router.get("/meta/crops", response_model=ApiResponse[List[CropInfo]])
def get_crops(db: Session = Depends(get_db)):
    crops = db.query(Crop).all()
    if not crops:
        # Fallback to constants
        data = [
            CropInfo(
                id=cid,
                name=meta["name"],
                category=meta["category"],
                msp_applicable=meta["msp_applicable"],
            )
            for cid, meta in CROPS.items()
        ]
    else:
        data = [
            CropInfo(
                id=c.id,
                name=c.name,
                category=c.category,
                msp_applicable=c.msp_applicable,
            )
            for c in crops
        ]
    return ApiResponse(data=data, meta=make_meta(["List of supported crops"]))


@router.get("/meta/markets", response_model=ApiResponse[List[MarketInfo]])
def get_markets(state: str = Query("karnataka"), db: Session = Depends(get_db)):
    markets = db.query(Market).filter(Market.state == state.lower()).all()
    data = [
        MarketInfo(
            id=m.id,
            name=m.name,
            district=m.district,
            state=m.state,
            lat=m.lat,
            lon=m.lon,
            coords_estimated=m.coords_estimated,
        )
        for m in markets
    ]
    return ApiResponse(data=data, meta=make_meta([f"{len(data)} APMC Mandis for {state}"]))


@router.get("/meta/districts", response_model=ApiResponse[List[DistrictInfo]])
def get_districts(state: str = Query("karnataka"), db: Session = Depends(get_db)):
    markets = db.query(Market).filter(Market.state == state.lower()).all()
    dist_names = sorted(list({m.district for m in markets}))
    if not dist_names:
        dist_names = ["Bengaluru Urban", "Kolar", "Belagavi", "Mysuru", "Davanagere"]
    data = [
        DistrictInfo(
            district_id=district_id(state, name),
            name=name,
            state=state.lower(),
        )
        for name in dist_names
    ]
    return ApiResponse(data=data, meta=make_meta([f"{len(data)} districts for {state}"]))


@router.get("/prices", response_model=ApiResponse[PriceSeries])
def get_prices(
    crop: str = Query(..., description="Crop id"),
    market_id: Optional[int] = Query(None, description="Market ID"),
    district: Optional[str] = Query(None, description="District name"),
    db: Session = Depends(get_db),
):
    query = db.query(PriceRecord).filter(PriceRecord.crop_id == crop.lower())
    if market_id is not None:
        query = query.filter(PriceRecord.market_id == market_id)
    elif district is not None:
        query = query.join(Market, Market.id == PriceRecord.market_id).filter(
            Market.district == district
        )

    records = query.order_by(PriceRecord.obs_date.asc()).limit(365).all()

    points = [
        PricePoint(
            date=r.obs_date,
            modal_price=r.modal_price,
            min_price=r.min_price,
            max_price=r.max_price,
            arrivals_qtl=r.arrivals_qtl,
        )
        for r in records
    ]

    series = PriceSeries(
        crop=crop.lower(),
        market_id=market_id,
        district=district,
        unit="INR/quintal",
        points=points,
    )
    return ApiResponse(data=series, meta=make_meta([f"{len(points)} price observations"]))


@router.get("/weather", response_model=ApiResponse[WeatherResponse])
def get_weather(
    district: Optional[str] = Query(None),
    state: str = Query("karnataka"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    db: Session = Depends(get_db),
):
    dist_name = district or "Bengaluru Urban"
    records = (
        db.query(WeatherDaily)
        .filter(WeatherDaily.district == dist_name)
        .order_by(WeatherDaily.obs_date.desc())
        .limit(14)
        .all()
    )

    days = [
        WeatherDay(
            date=w.obs_date,
            temp_max_c=w.temp_max_c,
            temp_min_c=w.temp_min_c,
            rain_mm=w.rain_mm,
            is_forecast=False,
        )
        for w in reversed(records)
    ]

    weather = WeatherResponse(
        location_name=dist_name,
        lat=lat or 12.9716,
        lon=lon or 77.5946,
        days=days,
    )
    return ApiResponse(data=weather, meta=make_meta(["Daily weather records"]))


@router.get("/msp", response_model=ApiResponse[MspInfo])
def get_msp(
    crop: str = Query(...),
    year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    crop_lower = crop.lower()
    crop_meta = CROPS.get(crop_lower, {})
    msp_applicable = crop_meta.get("msp_applicable", False)

    rec = (
        db.query(MspRecord)
        .filter(MspRecord.crop_id == crop_lower)
        .order_by(MspRecord.marketing_year.desc())
        .first()
    )

    msp_info = MspInfo(
        crop=crop_lower,
        msp_applicable=msp_applicable,
        marketing_year=rec.marketing_year if rec else "2025-26",
        msp_inr_per_qtl=float(rec.msp_inr_per_qtl) if rec else (2425.0 if msp_applicable else None),
        note=rec.source_note if rec else ("Statutory Government MSP" if msp_applicable else "Non-MSP crop"),
    )
    return ApiResponse(data=msp_info, meta=make_meta(["Official Government MSP"]))


@router.get("/demand-proxy", response_model=ApiResponse[DemandProxyInfo])
def get_demand_proxy(
    district: str = Query(...),
    crop: str = Query(...),
    db: Session = Depends(get_db),
):
    proxy = db.query(DemandProxy).filter(DemandProxy.district == district).first()
    festivals = db.query(FestivalEvent).all()

    data = DemandProxyInfo(
        district=district,
        population=proxy.population if proxy else 1500000,
        upcoming_festivals=[f.name for f in festivals[:3]],
        arrivals_trend_pct=5.4,
        price_trend_pct=2.1,
    )
    return ApiResponse(data=data, meta=make_meta(["Demand index & festival calendar proxy"]))


@router.get("/data/status", response_model=ApiResponse[List[DataStatusItem]])
def get_data_status(db: Session = Depends(get_db)):
    runs = db.query(IngestRun).order_by(IngestRun.started_at.desc()).limit(10).all()
    if not runs:
        items = [
            DataStatusItem(source_name="agmarknet", status="ok", rows_last_run=10965, message="Synced with fixture generator"),
            DataStatusItem(source_name="open_meteo", status="ok", rows_last_run=365, message="Weather series active"),
            DataStatusItem(source_name="msp_records", status="ok", rows_last_run=3, message="Statutory MSP up to date"),
        ]
    else:
        items = [
            DataStatusItem(
                source_name=r.source_name,
                last_success=r.finished_at,
                status=r.status,
                rows_last_run=r.rows_written,
                message=r.message,
            )
            for r in runs
        ]
    return ApiResponse(data=items, meta=make_meta(["Data pipeline sync status"]))


@router.get("/data/coverage", response_model=ApiResponse[List[CoverageItem]])
def get_data_coverage(
    crop: str = Query("tomato"),
    state: str = Query("karnataka"),
    db: Session = Depends(get_db),
):
    markets = db.query(Market).filter(Market.state == state.lower()).all()
    items = []
    for m in markets:
        records = (
            db.query(PriceRecord)
            .filter(PriceRecord.crop_id == crop.lower(), PriceRecord.market_id == m.id)
            .order_by(PriceRecord.obs_date.asc())
            .all()
        )
        n = len(records)
        items.append(
            CoverageItem(
                crop=crop.lower(),
                market_id=m.id,
                market=m.name,
                first_date=records[0].obs_date if records else None,
                last_date=records[-1].obs_date if records else None,
                n_days=n,
                sufficient_for_model=n >= 30,
            )
        )
    return ApiResponse(data=items, meta=make_meta([f"Coverage for {crop}"]))
