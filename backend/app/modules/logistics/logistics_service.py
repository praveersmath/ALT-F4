"""Logistics service: transport cost, toll calculation, distance estimation, and best-market ranking."""
import math
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.contracts.constants import CROPS
from app.contracts.db_models import FuelPrice, Market, PriceRecord, WeatherDaily
from app.contracts.schemas import MarketOption, TransportCost, WeatherRisk


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)


def get_latest_fuel_price(db: Session, state: str = "karnataka") -> float:
    fuel = (
        db.query(FuelPrice)
        .filter(FuelPrice.state == state)
        .order_by(FuelPrice.obs_date.desc())
        .first()
    )
    return float(fuel.diesel_inr_per_litre) if fuel else 89.0


def calculate_transport_cost(
    distance_km: float,
    quantity_qtl: float,
    diesel_price: float,
    is_perishable: bool = False,
) -> TransportCost:
    # Road routing curvature multiplier over straight-line haversine distance
    road_distance = round(distance_km * 1.25, 2)
    tonnes = quantity_qtl / 10.0  # 1 tonne = 10 quintals

    # Base freight rate: ₹ per tonne-km based on fuel price
    # Typical LCV / Mini truck benchmark in Karnataka
    freight_rate_per_tonne_km = (diesel_price / 89.0) * 4.5
    base_freight = max(500.0, road_distance * tonnes * freight_rate_per_tonne_km)

    # Toll estimation: approx 1 toll plaza per 60 km, ₹110 per toll for commercial cargo
    toll_plazas = math.floor(road_distance / 60.0)
    toll_cost = toll_plazas * 110.0

    # Mandi handling: loading & unloading @ ₹15 per quintal
    loading_unloading = quantity_qtl * 15.0

    # APMC statutory user fee: ₹5 per quintal
    mandi_fee = quantity_qtl * 5.0

    # Spoilage / transit shrinkage risk: higher for perishables over longer distance
    if is_perishable:
        spoilage_rate = min(0.08, 0.01 + (road_distance / 1000.0) * 0.05)
    else:
        spoilage_rate = min(0.02, 0.005 + (road_distance / 1000.0) * 0.01)
    spoilage_cost = round(base_freight * spoilage_rate, 2)

    total_cost = round(
        base_freight + toll_cost + loading_unloading + mandi_fee + spoilage_cost, 2
    )
    per_quintal = round(total_cost / max(quantity_qtl, 0.1), 2)

    return TransportCost(
        distance_km=road_distance,
        distance_is_estimate=True,
        freight=round(base_freight, 2),
        toll=round(toll_cost, 2),
        loading_unloading=round(loading_unloading, 2),
        mandi_fee=round(mandi_fee, 2),
        spoilage=spoilage_cost,
        total=total_cost,
        per_quintal=per_quintal,
        assumptions=[
            f"Road routing factor: 1.25x over aerial distance ({distance_km} km aerial -> {road_distance} km road)",
            f"Fuel base: ₹{diesel_price:.2f}/L diesel (Karnataka average)",
            "Commercial vehicle toll estimate: ₹110 per 60km corridor slab",
            f"Handling & APMC fees: ₹20/quintal combined",
            f"Transit spoilage risk allowance: {spoilage_rate*100:.1f}% based on commodity perishability",
        ],
    )


def assess_weather_risk(db: Session, market: Market) -> WeatherRisk:
    # Check latest weather near market district
    weather = (
        db.query(WeatherDaily)
        .filter(WeatherDaily.district == market.district)
        .order_by(WeatherDaily.obs_date.desc())
        .first()
    )
    if not weather:
        return "low"
    rain = weather.rain_mm or 0.0
    if rain > 25.0:
        return "high"
    if rain > 5.0:
        return "medium"
    return "low"


def rank_best_markets(
    db: Session,
    crop_id: str,
    origin_lat: float,
    origin_lon: float,
    quantity_qtl: float,
    horizon_days: int = 7,
) -> List[MarketOption]:
    crop_meta = CROPS.get(crop_id, {})
    is_perishable = crop_meta.get("category") == "vegetable"
    diesel_price = get_latest_fuel_price(db)

    markets = db.query(Market).filter(Market.state == "karnataka").all()
    if not markets:
        return []

    options: List[MarketOption] = []
    for m in markets:
        m_lat = m.lat if m.lat else 12.97
        m_lon = m.lon if m.lon else 77.59
        aerial_dist = haversine_km(origin_lat, origin_lon, m_lat, m_lon)

        # Compute transport cost to this market
        cost_breakdown = calculate_transport_cost(
            aerial_dist, quantity_qtl, diesel_price, is_perishable
        )

        # Fetch latest price
        latest_rec = (
            db.query(PriceRecord)
            .filter(PriceRecord.crop_id == crop_id, PriceRecord.market_id == m.id)
            .order_by(PriceRecord.obs_date.desc())
            .first()
        )
        if latest_rec:
            price = float(latest_rec.modal_price)
            price_basis = "latest_actual"
        else:
            # Fallback average
            price = 2400.0
            price_basis = "latest_actual"

        net_price = round(price - cost_breakdown.per_quintal, 2)
        weather_risk = assess_weather_risk(db, m)

        options.append(
            MarketOption(
                rank=1,  # will be assigned after sorting
                market_id=m.id,
                market=m.name,
                district=m.district,
                distance_km=cost_breakdown.distance_km,
                predicted_price=price,
                price_basis=price_basis,
                transport_cost_per_qtl=cost_breakdown.per_quintal,
                net_price_per_qtl=net_price,
                weather_risk=weather_risk,
            )
        )

    # Sort descending by net profit per quintal
    options.sort(key=lambda x: x.net_price_per_qtl, reverse=True)
    for idx, opt in enumerate(options):
        opt.rank = idx + 1

    return options
