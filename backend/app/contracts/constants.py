CROPS = {
    "tomato": {"name": "Tomato", "category": "vegetable", "msp_applicable": False},
    "onion": {"name": "Onion", "category": "vegetable", "msp_applicable": False},
    "potato": {"name": "Potato", "category": "vegetable", "msp_applicable": False},
    "wheat": {"name": "Wheat", "category": "cereal", "msp_applicable": True},
    "maize": {"name": "Maize", "category": "cereal", "msp_applicable": True},
    "cotton": {"name": "Cotton", "category": "commercial", "msp_applicable": True},
    "chana": {"name": "Bengal Gram (Chana)", "category": "pulse", "msp_applicable": True},
    "tur": {"name": "Red Gram (Tur)", "category": "pulse", "msp_applicable": True},
    "ragi": {"name": "Finger Millet (Ragi)", "category": "millet", "msp_applicable": True},
    "arecanut": {"name": "Arecanut", "category": "plantation", "msp_applicable": False},
    "coffee": {"name": "Coffee", "category": "plantation", "msp_applicable": False},
    "chilli": {"name": "Byadgi Chilli", "category": "spice", "msp_applicable": False},
    "groundnut": {"name": "Groundnut", "category": "oilseed", "msp_applicable": True},
    "sugarcane": {"name": "Sugarcane", "category": "commercial", "msp_applicable": True},
    "rice": {"name": "Paddy / Rice", "category": "cereal", "msp_applicable": True},
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

