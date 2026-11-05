"""All tables, defined once. Single OWNER writes each table; others read only.
`source` is one of: "live" | "cache" | "fixture"."""
import datetime as dt
from typing import Optional

from sqlalchemy import (
    Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text,
    UniqueConstraint, func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


# ------------------------------ PART 1 (data) ------------------------------
class Crop(Base):
    __tablename__ = "crops"
    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # slug
    name: Mapped[str] = mapped_column(String(64))
    category: Mapped[str] = mapped_column(String(32))
    msp_applicable: Mapped[bool] = mapped_column(Boolean, default=False)


class Market(Base):
    __tablename__ = "markets"
    __table_args__ = (UniqueConstraint("name", "district", "state"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128))
    district: Mapped[str] = mapped_column(String(64), index=True)
    state: Mapped[str] = mapped_column(String(32), index=True)
    lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    coords_estimated: Mapped[bool] = mapped_column(Boolean, default=False)


class PriceRecord(Base):
    __tablename__ = "price_records"
    __table_args__ = (UniqueConstraint("obs_date", "market_id", "crop_id"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    obs_date: Mapped[dt.date] = mapped_column(Date, index=True)
    market_id: Mapped[int] = mapped_column(ForeignKey("markets.id"), index=True)
    crop_id: Mapped[str] = mapped_column(ForeignKey("crops.id"), index=True)
    min_price: Mapped[float] = mapped_column(Float)
    max_price: Mapped[float] = mapped_column(Float)
    modal_price: Mapped[float] = mapped_column(Float)          # INR/quintal
    arrivals_qtl: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    source: Mapped[str] = mapped_column(String(16), default="live")
    origin: Mapped[str] = mapped_column(String(64), default="")  # e.g. agmarknet_api


class WeatherDaily(Base):
    __tablename__ = "weather_daily"
    __table_args__ = (UniqueConstraint("obs_date", "district", "state", "is_forecast"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    obs_date: Mapped[dt.date] = mapped_column(Date, index=True)
    district: Mapped[str] = mapped_column(String(64), index=True)
    state: Mapped[str] = mapped_column(String(32), index=True)
    lat: Mapped[float] = mapped_column(Float)
    lon: Mapped[float] = mapped_column(Float)
    temp_max_c: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    temp_min_c: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    rain_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_forecast: Mapped[bool] = mapped_column(Boolean, default=False)
    source: Mapped[str] = mapped_column(String(16), default="live")
    origin: Mapped[str] = mapped_column(String(64), default="open_meteo")
    fetched_at: Mapped[dt.datetime] = mapped_column(DateTime, server_default=func.now())


class MspRecord(Base):
    __tablename__ = "msp_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    crop_id: Mapped[str] = mapped_column(ForeignKey("crops.id"), index=True)
    marketing_year: Mapped[str] = mapped_column(String(16))     # e.g. "2025-26"
    msp_inr_per_qtl: Mapped[float] = mapped_column(Float)
    source_note: Mapped[str] = mapped_column(Text, default="")
    source: Mapped[str] = mapped_column(String(16), default="live")


class FuelPrice(Base):
    __tablename__ = "fuel_prices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    obs_date: Mapped[dt.date] = mapped_column(Date, index=True)
    state: Mapped[str] = mapped_column(String(32), index=True)
    diesel_inr_per_litre: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String(16), default="live")
    origin: Mapped[str] = mapped_column(String(64), default="")


class FestivalEvent(Base):
    __tablename__ = "festival_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    event_date: Mapped[dt.date] = mapped_column(Date, index=True)
    name: Mapped[str] = mapped_column(String(128))
    state: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    source: Mapped[str] = mapped_column(String(16), default="live")


class DemandProxy(Base):
    __tablename__ = "demand_proxies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district: Mapped[str] = mapped_column(String(64), index=True)
    state: Mapped[str] = mapped_column(String(32), index=True)
    population: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    source_note: Mapped[str] = mapped_column(Text, default="")
    source: Mapped[str] = mapped_column(String(16), default="live")


class IngestRun(Base):
    __tablename__ = "ingest_runs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_name: Mapped[str] = mapped_column(String(64), index=True)
    started_at: Mapped[dt.datetime] = mapped_column(DateTime, server_default=func.now())
    finished_at: Mapped[Optional[dt.datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="running")  # running|ok|failed
    rows_written: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


# --------------------------- PART 2 (intelligence) ---------------------------
class ModelRun(Base):
    __tablename__ = "model_runs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    crop_id: Mapped[str] = mapped_column(ForeignKey("crops.id"), index=True)
    horizon_days: Mapped[int] = mapped_column(Integer)
    model_name: Mapped[str] = mapped_column(String(64))
    model_version: Mapped[str] = mapped_column(String(64))
    trained_at: Mapped[dt.datetime] = mapped_column(DateTime, server_default=func.now())
    train_end: Mapped[dt.date] = mapped_column(Date)
    test_start: Mapped[dt.date] = mapped_column(Date)
    test_end: Mapped[dt.date] = mapped_column(Date)
    mape: Mapped[float] = mapped_column(Float)
    rmse: Mapped[float] = mapped_column(Float)
    baseline_mape: Mapped[float] = mapped_column(Float)
    baseline_rmse: Mapped[float] = mapped_column(Float)
    beats_baseline: Mapped[bool] = mapped_column(Boolean)
    data_source: Mapped[str] = mapped_column(String(16), default="live")
    artifact_path: Mapped[str] = mapped_column(String(256), default="")


class Forecast(Base):
    __tablename__ = "forecasts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    crop_id: Mapped[str] = mapped_column(ForeignKey("crops.id"), index=True)
    market_id: Mapped[int] = mapped_column(ForeignKey("markets.id"), index=True)
    generated_at: Mapped[dt.datetime] = mapped_column(DateTime, server_default=func.now())
    horizon_days: Mapped[int] = mapped_column(Integer)
    target_date: Mapped[dt.date] = mapped_column(Date, index=True)
    predicted: Mapped[float] = mapped_column(Float)
    lower: Mapped[float] = mapped_column(Float)
    upper: Mapped[float] = mapped_column(Float)
    model_run_id: Mapped[Optional[int]] = mapped_column(ForeignKey("model_runs.id"), nullable=True)
    source: Mapped[str] = mapped_column(String(16), default="live")


class HikeAlert(Base):
    __tablename__ = "hike_alerts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    crop_id: Mapped[str] = mapped_column(ForeignKey("crops.id"), index=True)
    district: Mapped[str] = mapped_column(String(64), index=True)
    state: Mapped[str] = mapped_column(String(32), index=True)
    generated_at: Mapped[dt.datetime] = mapped_column(DateTime, server_default=func.now())
    horizon_days: Mapped[int] = mapped_column(Integer)
    current_price: Mapped[float] = mapped_column(Float)
    predicted_price: Mapped[float] = mapped_column(Float)
    pct_change: Mapped[float] = mapped_column(Float)
    level: Mapped[str] = mapped_column(String(8))               # green|amber|red
    is_statistical_spike: Mapped[bool] = mapped_column(Boolean, default=False)
    threshold_pct: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String(16), default="live")


# ------------------------ PART 3 (logistics/marketplace) ------------------------
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128))
    email: Mapped[str] = mapped_column(String(256), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    role: Mapped[str] = mapped_column(String(16))               # farmer|wholesaler|retailer
    district: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, server_default=func.now())


class Listing(Base):
    __tablename__ = "listings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    crop_id: Mapped[str] = mapped_column(ForeignKey("crops.id"), index=True)
    market_id: Mapped[Optional[int]] = mapped_column(ForeignKey("markets.id"), nullable=True)
    district: Mapped[str] = mapped_column(String(64), index=True)
    quantity_qtl: Mapped[float] = mapped_column(Float)
    asking_price_per_qtl: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(16), default="open")  # open|sold|cancelled
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, server_default=func.now())

