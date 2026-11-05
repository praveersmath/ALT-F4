CROPS = {
    "tomato": {"name": "Tomato", "category": "vegetable", "msp_applicable": False},
    "onion": {"name": "Onion", "category": "vegetable", "msp_applicable": False},
    "wheat": {"name": "Wheat", "category": "cereal", "msp_applicable": True},
}
STATES = {"karnataka": "Karnataka"}
HORIZONS = (7, 15)
PRICE_UNIT = "INR/quintal"

ALERT_GREEN_MAX_PCT = 5.0    # < 5      -> green
ALERT_AMBER_MAX_PCT = 15.0   # 5..15    -> amber ; > 15 -> red
VOLATILITY_SIGMA_MULTIPLIER = 1.5
MIN_HISTORY_DAYS_FOR_MODEL = 365  # below this: status "insufficient_data"


def alert_level(pct_change: float) -> str:
    if pct_change < ALERT_GREEN_MAX_PCT:
        return "green"
    if pct_change <= ALERT_AMBER_MAX_PCT:
        return "amber"
    return "red"


def district_id(state: str, district: str) -> str:
    """Stable slug used by GeoJSON, atlas and APIs, e.g. karnataka-bengaluru-urban."""
    import re

    raw = f"{state}-{district}".lower()
    return re.sub(r"[^a-z0-9]+", "-", raw).strip("-")

