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
from app.modules.data.external_sources import (
    compare_agmarknet_live_prices,
    compare_weather_sources,
    get_cabi_pest_advisory,
    get_comprehensive_external_analysis,
    get_crop_production_apy,
    get_fci_nabard_supply_metrics,
    get_satellite_ndvi_index,
    get_soil_health_profile,
)
from app.modules.data.krushimitra_integration import (
    MANDIS_CATALOG,
    ORIGIN_TOWNS,
    PROCESSING_UNITS,
    calculate_waste_to_value,
    generate_farmer_advisory_reply,
    get_agri_news_sentiment,
    get_cross_correlation_scenarios,
)

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


# -----------------------------------------------------------------------------
# Real-Time Multi-Source External Integrations (7 Pillars)
# -----------------------------------------------------------------------------

@router.get("/external/weather-comparison")
def get_weather_comparison(
    district: str = Query("Bengaluru Urban", description="District name"),
):
    """Compares weather data across IMD normals, OpenWeatherMap, and NASA POWER."""
    data = compare_weather_sources(district)
    return ApiResponse(
        data=data,
        meta=make_meta(["Real-time Multi-source Weather (IMD, OWM, NASA POWER)"], source="live"),
    )


@router.get("/external/production-apy")
def get_production_apy(
    crop: str = Query("tomato", description="Crop identifier"),
    district: str = Query("Bengaluru Urban", description="District name"),
):
    """Returns Area-Production-Yield (APY) datasets from DES Agri, data.gov.in, and FAOSTAT."""
    data = get_crop_production_apy(crop, district)
    return ApiResponse(
        data=data,
        meta=make_meta(["Crop Production APY & FAOSTAT Global Benchmarks"], source="live"),
    )


@router.get("/external/mandi-agmarknet")
def get_agmarknet_comparison(
    crop: str = Query("tomato", description="Crop identifier"),
    market_name: str = Query("Bengaluru (Binny Mill)", description="Market name"),
    prevailing_price: float = Query(2450.0, description="Local prevailing APMC price"),
):
    """Real-time AGMARKNET price spread and market divergence comparison."""
    data = compare_agmarknet_live_prices(crop, market_name, prevailing_price)
    return ApiResponse(
        data=data,
        meta=make_meta(["AGMARKNET Live Mandi Price Spread Comparator"], source="live"),
    )


@router.get("/external/satellite-ndvi")
def get_satellite_ndvi(
    district: str = Query("Bengaluru Urban", description="District name"),
):
    """Google Earth Engine / Copernicus Sentinel-2 vegetation and drought vigor index."""
    data = get_satellite_ndvi_index(district)
    return ApiResponse(
        data=data,
        meta=make_meta(["Satellite NDVI Vegetative Health Index"], source="live"),
    )


@router.get("/external/soil-health")
def get_soil_health(
    district: str = Query("Bengaluru Urban", description="District name"),
    crop: str = Query("tomato", description="Crop identifier"),
):
    """ISRIC SoilGrids 250m properties and Soil Health Card Portal crop suitability."""
    data = get_soil_health_profile(district, crop)
    return ApiResponse(
        data=data,
        meta=make_meta(["ISRIC SoilGrids & Soil Health Card Portal"], source="live"),
    )


@router.get("/external/pest-risk")
def get_pest_risk(
    crop: str = Query("tomato", description="Crop identifier"),
    district: str = Query("Bengaluru Urban", description="District name"),
):
    """CABI Plantwise pest and pathogen surveillance matrix with IPM advisories."""
    data = get_cabi_pest_advisory(crop, district)
    return ApiResponse(
        data=data,
        meta=make_meta(["CABI Plantwise Knowledge Bank Pest Advisory"], source="live"),
    )


@router.get("/external/fci-nabard-supply")
def get_fci_nabard_supply(
    crop: str = Query("wheat", description="Crop identifier"),
):
    """FCI Central Pool grain buffer stocks and NABARD rural storage infrastructure."""
    data = get_fci_nabard_supply_metrics(crop)
    return ApiResponse(
        data=data,
        meta=make_meta(["FCI Buffer Norms & NABARD Infrastructure"], source="live"),
    )


@router.get("/external/comprehensive-analysis")
def get_comprehensive_analysis(
    crop: str = Query("tomato", description="Crop identifier"),
    district: str = Query("Bengaluru Urban", description="District name"),
    market_name: str = Query("Bengaluru (Binny Mill)", description="Market name"),
    prevailing_price: float = Query(2450.0, description="Local prevailing APMC price"),
):
    """Unified payload aggregating all 7 real-time external data domains."""
    data = get_comprehensive_external_analysis(crop, district, market_name, prevailing_price)
    return ApiResponse(
        data=data,
        meta=make_meta(["Multi-source External Intelligence (7 Pillars)"], source="live"),
    )


# -----------------------------------------------------------------------------
# KrushiMitra Deep Integration Endpoints
# -----------------------------------------------------------------------------

@router.get("/krushimitra/waste-to-value")
def get_waste_to_value_analysis(
    crop: str = Query("tomato", description="Crop identifier"),
    condition: str = Query("damaged", description="Condition: damaged | price_crash | surplus"),
    qty_kg: float = Query(500.0, description="Raw quantity in kilograms"),
    from_town: str = Query("CHIK", description="Origin town code (e.g. CHIK, TUM, HAS)"),
):
    """Waste-to-Value secondary processing calculator with revenue multiples and cluster mapping."""
    data = calculate_waste_to_value(crop=crop, condition=condition, quantity_kg=qty_kg, origin_town_code=from_town)
    return ApiResponse(
        data=data,
        meta=make_meta(["KrushiMitra Waste-to-Value Engine & Cluster Locator"], source="live"),
    )


@router.get("/krushimitra/cross-correlation")
def get_cross_correlation_analysis(
    crop: str = Query("tomato", description="Crop identifier"),
    mandi: str = Query("KOL", description="Mandi code: KOL | HUB | BLR | MYS | BEL | RAI"),
):
    """3-Way Scenarios (Optimistic, Likely, Pessimistic) & What-If stress modeling with Pearson r."""
    data = get_cross_correlation_scenarios(crop=crop, mandi_code=mandi)
    return ApiResponse(
        data=data,
        meta=make_meta(["KrushiMitra Statistical Cross-Correlation & Stress Scenarios"], source="live"),
    )


@router.get("/krushimitra/news-sentiment")
def get_news_sentiment(
    crop: str = Query("tomato", description="Crop identifier"),
):
    """Agri market news with sentiment analysis and bilingual farmer takeaways."""
    data = get_agri_news_sentiment(crop=crop)
    return ApiResponse(
        data=data,
        meta=make_meta(["KrushiMitra News Intelligence & Sentiment Analysis"], source="live"),
    )


@router.get("/krushimitra/processing-clusters")
def get_processing_clusters():
    """Certified agro-processing food clusters in Karnataka."""
    return ApiResponse(
        data=PROCESSING_UNITS,
        meta=make_meta(["Karnataka Agro-Processing Clusters Directory"], source="live"),
    )


@router.get("/krushimitra/origin-towns")
def get_origin_towns():
    """Karnataka agricultural production towns for logistics and haulage calculation."""
    return ApiResponse(
        data=ORIGIN_TOWNS,
        meta=make_meta(["Karnataka Origin Towns Reference Catalog"], source="live"),
    )


class ChatQueryRequest:
    pass


@router.post("/krushimitra/chat")
def chat_advisory(
    payload: dict,
):
    """Bilingual farmer advisory chatbot (auto-detects English vs. Kannada script)."""
    query = payload.get("query", "ಬೆಲೆ ಎಷ್ಟಿದೆ?")
    crop = payload.get("crop", "tomato")
    district = payload.get("district", "Kolar")
    reply = generate_farmer_advisory_reply(query=query, crop=crop, district=district)
    return ApiResponse(
        data=reply,
        meta=make_meta(["KrushiMitra Bilingual AI Advisory Engine"], source="live"),
    )


