"""Hike alert detection, statistical spike analysis, and atlas aggregation."""
import datetime as dt
from typing import List, Optional, Tuple

import numpy as np
from sqlalchemy.orm import Session

from app.contracts.constants import (
    ALERT_AMBER_MAX_PCT,
    ALERT_GREEN_MAX_PCT,
    alert_level,
    district_id,
)
from app.contracts.db_models import (
    Crop,
    DemandProxy,
    HikeAlert as DBHikeAlert,
    Market,
    PriceRecord,
)
from app.contracts.schemas import Atlas, AtlasDistrict, HikeAlert


def evaluate_district_hike_alerts(
    db: Session, crop_id: str, state: str = "karnataka", horizon_days: int = 7
) -> List[HikeAlert]:
    # Find all markets in this state
    markets = db.query(Market).filter(Market.state == state).all()
    if not markets:
        return []

    alerts: List[HikeAlert] = []
    # Group markets by district
    district_markets: dict[str, list[Market]] = {}
    for m in markets:
        district_markets.setdefault(m.district, []).append(m)

    for dist_name, d_markets in district_markets.items():
        market_ids = [m.id for m in d_markets]
        # Fetch prices for this crop in these markets
        records = (
            db.query(PriceRecord)
            .filter(
                PriceRecord.crop_id == crop_id,
                PriceRecord.market_id.in_(market_ids),
            )
            .order_by(PriceRecord.obs_date.desc())
            .limit(100)
            .all()
        )
        if not records:
            continue

        prices = [r.modal_price for r in records]
        current_price = float(np.mean(prices[: len(market_ids)]))
        mean_price = float(np.mean(prices))
        std_price = float(np.std(prices)) if len(prices) > 5 else (current_price * 0.05)

        # Baseline projection
        pct_from_mean = ((current_price - mean_price) / max(mean_price, 1.0)) * 100.0
        # Projected horizon price with momentum
        projected_change = (pct_from_mean * 0.5) * (horizon_days / 7.0)
        # Check statistical spike (> 1.5 sigma)
        is_spike = current_price > (mean_price + 1.5 * std_price)
        if is_spike:
            projected_change = max(projected_change, 16.0)

        predicted_price = current_price * (1.0 + (projected_change / 100.0))
        pct_change = round(projected_change, 2)
        lvl = alert_level(pct_change)
        d_id = district_id(state, dist_name)

        # Save to DB if not already logged today
        today = dt.date.today()
        existing = (
            db.query(DBHikeAlert)
            .filter(
                DBHikeAlert.crop_id == crop_id,
                DBHikeAlert.district == dist_name,
                DBHikeAlert.state == state,
                DBHikeAlert.horizon_days == horizon_days,
            )
            .first()
        )
        if not existing:
            db_alert = DBHikeAlert(
                crop_id=crop_id,
                district=dist_name,
                state=state,
                horizon_days=horizon_days,
                current_price=round(current_price, 2),
                predicted_price=round(predicted_price, 2),
                pct_change=pct_change,
                level=lvl,
                is_statistical_spike=is_spike,
                threshold_pct=ALERT_AMBER_MAX_PCT,
                source="fixture",
            )
            db.add(db_alert)

        alerts.append(
            HikeAlert(
                crop=crop_id,
                district=dist_name,
                district_id=d_id,
                state=state,
                horizon_days=horizon_days,
                current_price=round(current_price, 2),
                predicted_price=round(predicted_price, 2),
                pct_change=pct_change,
                level=lvl,
                is_statistical_spike=is_spike,
                threshold_pct=ALERT_AMBER_MAX_PCT,
            )
        )

    db.commit()
    return alerts


def build_atlas_view(
    db: Session, crop_id: str, state: str = "karnataka", horizon_days: int = 7
) -> Atlas:
    alerts = evaluate_district_hike_alerts(db, crop_id, state, horizon_days)
    districts_data: List[AtlasDistrict] = []

    for alert in alerts:
        # Determine outlook
        if alert.pct_change > 3.0:
            outlook = "rising"
        elif alert.pct_change < -3.0:
            outlook = "falling"
        else:
            outlook = "stable"

        districts_data.append(
            AtlasDistrict(
                district_id=alert.district_id,
                district=alert.district,
                current_trend_pct=round(alert.pct_change * 0.6, 2),
                predicted_change_pct=alert.pct_change,
                alert_level=alert.level,
                outlook=outlook,
            )
        )

    return Atlas(
        crop=crop_id,
        horizon_days=horizon_days,
        districts=districts_data,
    )
