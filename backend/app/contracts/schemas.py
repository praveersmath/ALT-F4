"""API shapes. Mirror: frontend/src/contracts/types.ts. Do not edit outside setup."""
from __future__ import annotations

import datetime as dt
from typing import Generic, Literal, Optional, TypeVar

from pydantic import BaseModel, Field

DataSource = Literal["live", "cached", "fixture", "no_data"]
AlertLevel = Literal["green", "amber", "red"]
Outlook = Literal["rising", "stable", "falling"]
Role = Literal["farmer", "wholesaler", "retailer"]
ForecastStatus = Literal["ok", "insufficient_data", "model_below_baseline"]
WeatherRisk = Literal["low", "medium", "high"]
ListingStatus = Literal["open", "sold", "cancelled"]
Verdict = Literal["below_msp", "below_market", "fair", "above_market", "no_reference"]
ClimateSignal = Literal["normal", "drought_risk", "excess_rain_risk", "unknown"]

T = TypeVar("T")


def data_source_from(sources: set[str]) -> DataSource:
    """Row-level `source` values -> response-level meta.data_source."""
    if not sources:
        return "no_data"
    if "fixture" in sources:
        return "fixture"
    if sources == {"cache"}:
        return "cached"
    return "live"


class Meta(BaseModel):
    data_source: DataSource
    generated_at: dt.datetime
    notes: list[str] = Field(default_factory=list)


class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: Meta


class ErrorBody(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorBody


# ---- Part 1 ----
class CropInfo(BaseModel):
    id: str
    name: str
    category: str
    msp_applicable: bool


class MarketInfo(BaseModel):
    id: int
    name: str
    district: str
    state: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    coords_estimated: bool = False


class DistrictInfo(BaseModel):
    district_id: str
    name: str
    state: str


class PricePoint(BaseModel):
    date: dt.date
    modal_price: float
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    arrivals_qtl: Optional[float] = None


class PriceSeries(BaseModel):
    crop: str
    market_id: Optional[int] = None
    district: Optional[str] = None
    unit: str = "INR/quintal"
    points: list[PricePoint]


class WeatherDay(BaseModel):
    date: dt.date
    temp_max_c: Optional[float] = None
    temp_min_c: Optional[float] = None
    rain_mm: Optional[float] = None
    is_forecast: bool


class WeatherResponse(BaseModel):
    location_name: str
    lat: float
    lon: float
    days: list[WeatherDay]


class MspInfo(BaseModel):
    crop: str
    msp_applicable: bool
    marketing_year: Optional[str] = None
    msp_inr_per_qtl: Optional[float] = None
    note: Optional[str] = None


class DemandProxyInfo(BaseModel):
    district: str
    population: Optional[int] = None
    upcoming_festivals: list[str] = Field(default_factory=list)
    arrivals_trend_pct: Optional[float] = None
    price_trend_pct: Optional[float] = None


class DataStatusItem(BaseModel):
    source_name: str
    last_success: Optional[dt.datetime] = None
    status: str
    rows_last_run: int = 0
    message: Optional[str] = None


class CoverageItem(BaseModel):
    crop: str
    market_id: int
    market: str
    first_date: Optional[dt.date] = None
    last_date: Optional[dt.date] = None
    n_days: int
    sufficient_for_model: bool


# ---- Part 2 ----
class ModelMetrics(BaseModel):
    crop: str
    horizon_days: int
    model_name: str
    mape: float
    rmse: float
    baseline_mape: float
    baseline_rmse: float
    beats_baseline: bool
    test_start: dt.date
    test_end: dt.date
    data_source: DataSource


class ForecastPoint(BaseModel):
    target_date: dt.date
    predicted: float
    lower: float
    upper: float


class Forecast(BaseModel):
    crop: str
    market_id: int
    market: str
    horizon_days: int
    current_price: Optional[float] = None
    status: ForecastStatus
    points: list[ForecastPoint] = Field(default_factory=list)
    model_name: Optional[str] = None
    metrics: Optional[ModelMetrics] = None


class HikeAlert(BaseModel):
    crop: str
    district: str
    district_id: str
    state: str
    horizon_days: int
    current_price: float
    predicted_price: float
    pct_change: float
    level: AlertLevel
    is_statistical_spike: bool
    threshold_pct: float


class AtlasDistrict(BaseModel):
    district_id: str
    district: str
    current_trend_pct: Optional[float] = None
    predicted_change_pct: Optional[float] = None
    alert_level: Optional[AlertLevel] = None
    outlook: Optional[Outlook] = None


class Atlas(BaseModel):
    crop: str
    horizon_days: int
    districts: list[AtlasDistrict]


class CropRecommendation(BaseModel):
    crop: str
    score: float
    rationale: list[str]


class CropRecommendations(BaseModel):
    district: str
    items: list[CropRecommendation]
    assumptions: list[str] = Field(default_factory=list)


class MspAdvisory(BaseModel):
    crop: str
    district: str
    msp_applicable: bool
    msp_inr_per_qtl: Optional[float] = None
    market_price: Optional[float] = None
    climate_signal: ClimateSignal
    cost_pressure_pct: Optional[float] = None
    advisory: str


# ---- Part 3 ----
class TransportCost(BaseModel):
    distance_km: float
    distance_is_estimate: bool
    freight: float
    toll: float
    loading_unloading: float
    mandi_fee: float
    spoilage: float
    total: float
    per_quintal: float
    assumptions: list[str]


class MarketOption(BaseModel):
    rank: int
    market_id: int
    market: str
    district: str
    distance_km: float
    predicted_price: float
    price_basis: Literal["forecast", "latest_actual"]
    transport_cost_per_qtl: float
    net_price_per_qtl: float
    weather_risk: WeatherRisk


class BestMarket(BaseModel):
    crop: str
    quantity_qtl: float
    horizon_days: int
    options: list[MarketOption]
    assumptions: list[str] = Field(default_factory=list)


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Role
    district: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"


class UserPublic(BaseModel):
    id: int
    name: str
    email: str
    role: Role
    district: Optional[str] = None


class PriceCheck(BaseModel):
    msp_applicable: bool
    msp_inr_per_qtl: Optional[float] = None
    current_market_price: Optional[float] = None
    predicted_price: Optional[float] = None
    verdict: Verdict
    note: str


class ListingCreate(BaseModel):
    crop: str
    quantity_qtl: float = Field(gt=0)
    asking_price_per_qtl: float = Field(gt=0)
    district: str
    market_id: Optional[int] = None


class StatusUpdate(BaseModel):
    status: ListingStatus


class Listing(BaseModel):
    id: int
    owner: UserPublic
    crop: str
    quantity_qtl: float
    asking_price_per_qtl: float
    district: str
    market_id: Optional[int] = None
    status: ListingStatus
    created_at: dt.datetime
    price_check: PriceCheck

