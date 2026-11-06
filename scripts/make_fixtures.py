#!/usr/bin/env python3
"""Generate deterministic synthetic fixture data for local development."""
import datetime as dt
import math
import random
import sys
from pathlib import Path

# Set path for backend imports
backend_path = Path(__file__).resolve().parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.core.db import Base, SessionLocal, engine
from app.contracts.db_models import (
    Crop,
    DemandProxy,
    FuelPrice,
    Market,
    MspRecord,
    PriceRecord,
    WeatherDaily,
)


def generate_fixtures():
    print("=" * 60)
    print("WARNING: GENERATING SYNTHETIC FIXTURE DATA FOR LOCAL DEV ONLY!")
    print("ALL ROWS WILL BE LABELED WITH source='fixture'.")
    print("=" * 60)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Crops (15 Comprehensive Karnataka agricultural commodities)
        crops_data = [
            {"id": "tomato", "name": "Tomato", "category": "vegetable", "msp_applicable": False},
            {"id": "onion", "name": "Onion", "category": "vegetable", "msp_applicable": False},
            {"id": "potato", "name": "Potato", "category": "vegetable", "msp_applicable": False},
            {"id": "wheat", "name": "Wheat", "category": "cereal", "msp_applicable": True},
            {"id": "maize", "name": "Maize", "category": "cereal", "msp_applicable": True},
            {"id": "cotton", "name": "Cotton", "category": "commercial", "msp_applicable": True},
            {"id": "chana", "name": "Bengal Gram (Chana)", "category": "pulse", "msp_applicable": True},
            {"id": "tur", "name": "Red Gram (Tur)", "category": "pulse", "msp_applicable": True},
            {"id": "ragi", "name": "Finger Millet (Ragi)", "category": "millet", "msp_applicable": True},
            {"id": "arecanut", "name": "Arecanut", "category": "plantation", "msp_applicable": False},
            {"id": "coffee", "name": "Coffee", "category": "plantation", "msp_applicable": False},
            {"id": "chilli", "name": "Byadgi Chilli", "category": "spice", "msp_applicable": False},
            {"id": "groundnut", "name": "Groundnut", "category": "oilseed", "msp_applicable": True},
            {"id": "sugarcane", "name": "Sugarcane", "category": "commercial", "msp_applicable": True},
            {"id": "rice", "name": "Paddy / Rice", "category": "cereal", "msp_applicable": True},
        ]
        for c in crops_data:
            existing = db.query(Crop).filter_by(id=c["id"]).first()
            if not existing:
                db.add(Crop(**c))
        db.commit()

        # 2. Markets (20 Major Karnataka APMC Regional Terminals)
        markets_data = [
            {"name": "Bengaluru (Binny Mill)", "district": "Bengaluru Urban", "state": "karnataka", "lat": 12.9716, "lon": 77.5946},
            {"name": "Kolar Mandi", "district": "Kolar", "state": "karnataka", "lat": 13.1367, "lon": 78.1291},
            {"name": "Hubballi APMC", "district": "Dharwad", "state": "karnataka", "lat": 15.3647, "lon": 75.1240},
            {"name": "Belagavi APMC", "district": "Belagavi", "state": "karnataka", "lat": 15.8497, "lon": 74.4977},
            {"name": "Mysuru Bandipalya", "district": "Mysuru", "state": "karnataka", "lat": 12.2958, "lon": 76.6394},
            {"name": "Davanagere APMC", "district": "Davanagere", "state": "karnataka", "lat": 14.4644, "lon": 75.9218},
            {"name": "Shimoga APMC", "district": "Shimoga", "state": "karnataka", "lat": 13.9299, "lon": 75.5681},
            {"name": "Tumakuru APMC", "district": "Tumakuru", "state": "karnataka", "lat": 13.3409, "lon": 77.1010},
            {"name": "Mandya APMC", "district": "Mandya", "state": "karnataka", "lat": 12.5242, "lon": 76.8958},
            {"name": "Hassan APMC", "district": "Hassan", "state": "karnataka", "lat": 13.0072, "lon": 76.1029},
            {"name": "Byadgi APMC", "district": "Haveri", "state": "karnataka", "lat": 14.6826, "lon": 75.4878},
            {"name": "Kalaburagi APMC (Nehru Gunj)", "district": "Kalaburagi", "state": "karnataka", "lat": 17.3297, "lon": 76.8343},
            {"name": "Raichur APMC", "district": "Raichur", "state": "karnataka", "lat": 16.2076, "lon": 77.3463},
            {"name": "Ballari APMC", "district": "Ballari", "state": "karnataka", "lat": 15.1394, "lon": 76.9214},
            {"name": "Vijayapura APMC", "district": "Vijayapura", "state": "karnataka", "lat": 16.8302, "lon": 75.7100},
            {"name": "Chikkamagaluru APMC", "district": "Chikkamagaluru", "state": "karnataka", "lat": 13.3161, "lon": 75.7720},
            {"name": "Bagalkote APMC", "district": "Bagalkote", "state": "karnataka", "lat": 16.1691, "lon": 75.6615},
            {"name": "Chitradurga APMC", "district": "Chitradurga", "state": "karnataka", "lat": 14.2251, "lon": 76.3980},
            {"name": "Gadag APMC", "district": "Gadag", "state": "karnataka", "lat": 15.4298, "lon": 75.6320},
            {"name": "Udupi-Mangaluru APMC", "district": "Dakshina Kannada", "state": "karnataka", "lat": 12.9141, "lon": 74.8560},
        ]
        market_objs = []
        for m in markets_data:
            rec = db.query(Market).filter_by(name=m["name"], district=m["district"], state=m["state"]).first()
            if not rec:
                rec = Market(**m, coords_estimated=False)
                db.add(rec)
                db.flush()
            market_objs.append(rec)
        db.commit()

        # 3. Reference MSP Records
        msp_specs = [
            ("wheat", 2275.0),
            ("maize", 2090.0),
            ("cotton", 7121.0),
            ("chana", 5440.0),
            ("tur", 7550.0),
            ("ragi", 4290.0),
            ("groundnut", 6783.0),
            ("rice", 2300.0),
            ("sugarcane", 340.0),
        ]
        for cid, val in msp_specs:
            existing_msp = db.query(MspRecord).filter_by(crop_id=cid, marketing_year="2024-25").first()
            if not existing_msp:
                db.add(MspRecord(
                    crop_id=cid,
                    marketing_year="2024-25",
                    msp_inr_per_qtl=val,
                    source_note=f"Official CACP Benchmark 2024-25 ({cid})",
                    source="fixture",
                ))

        # 4. Two years of daily price records
        start_date = dt.date.today() - dt.timedelta(days=730)
        rng = random.Random(42)  # Deterministic seed

        print("Generating 2 years of daily price & weather records...")
        base_prices = {
            "tomato": 1800.0,
            "onion": 2200.0,
            "potato": 1600.0,
            "wheat": 2400.0,
            "maize": 2150.0,
            "cotton": 6900.0,
            "chana": 5300.0,
            "tur": 7400.0,
            "ragi": 3800.0,
            "arecanut": 44000.0,
            "coffee": 28000.0,
            "chilli": 19500.0,
            "groundnut": 6400.0,
            "sugarcane": 350.0,
            "rice": 2500.0,
        }

        prices_to_insert = []
        weather_to_insert = []

        # Unique key sets to avoid re-insert collisions
        existing_price_keys = {
            (r.obs_date, r.market_id, r.crop_id)
            for r in db.query(PriceRecord.obs_date, PriceRecord.market_id, PriceRecord.crop_id).all()
        }
        existing_weather_keys = {
            (r.obs_date, r.district, r.state, r.is_forecast)
            for r in db.query(WeatherDaily.obs_date, WeatherDaily.district, WeatherDaily.state, WeatherDaily.is_forecast).all()
        }

        for day_offset in range(731):
            curr_date = start_date + dt.timedelta(days=day_offset)
            day_of_year = curr_date.timetuple().tm_yday

            # Price records per market and crop
            for m in market_objs:
                for crop_id, base_p in base_prices.items():
                    key = (curr_date, m.id, crop_id)
                    if key in existing_price_keys:
                        continue

                    # Synthetic seasonal oscillation + noise
                    season = math.sin(2 * math.pi * day_of_year / 365.0) * (base_p * 0.25)
                    noise = rng.uniform(-100.0, 100.0)
                    modal = round(max(500.0, base_p + season + noise), 2)
                    spread = round(rng.uniform(50.0, 150.0), 2)
                    min_p = round(max(200.0, modal - spread), 2)
                    max_p = round(modal + spread, 2)
                    arr = round(rng.uniform(100.0, 1200.0), 1)

                    prices_to_insert.append(PriceRecord(
                        obs_date=curr_date,
                        market_id=m.id,
                        crop_id=crop_id,
                        min_price=min_p,
                        max_price=max_p,
                        modal_price=modal,
                        arrivals_qtl=arr,
                        source="fixture",
                        origin="fixture_generator",
                    ))

            # Weather daily per district
            districts = {m.district: (m.lat, m.lon) for m in market_objs}
            for dist, (lat, lon) in districts.items():
                w_key = (curr_date, dist, "karnataka", False)
                if w_key in existing_weather_keys:
                    continue

                t_max = round(28.0 + 5.0 * math.sin(2 * math.pi * day_of_year / 365.0) + rng.uniform(-2, 2), 1)
                t_min = round(t_max - rng.uniform(8.0, 14.0), 1)
                # Monsoonal rain (June-Sept)
                rain = round(rng.uniform(5.0, 45.0), 1) if 150 <= day_of_year <= 270 and rng.random() > 0.6 else 0.0

                weather_to_insert.append(WeatherDaily(
                    obs_date=curr_date,
                    district=dist,
                    state="karnataka",
                    lat=lat or 12.97,
                    lon=lon or 77.59,
                    temp_max_c=t_max,
                    temp_min_c=t_min,
                    rain_mm=rain,
                    is_forecast=False,
                    source="fixture",
                    origin="fixture_generator",
                ))

        if prices_to_insert:
            db.bulk_save_objects(prices_to_insert)
        if weather_to_insert:
            db.bulk_save_objects(weather_to_insert)

        # 5. Fuel Prices
        fuel_keys = {(r.obs_date, r.state) for r in db.query(FuelPrice.obs_date, FuelPrice.state).all()}
        fuel_to_insert = []
        for d in range(0, 731, 7):  # weekly sample
            f_date = start_date + dt.timedelta(days=d)
            if (f_date, "karnataka") not in fuel_keys:
                fuel_to_insert.append(FuelPrice(
                    obs_date=f_date,
                    state="karnataka",
                    diesel_inr_per_litre=88.50 + rng.uniform(-2, 5),
                    source="fixture",
                    origin="fixture_generator",
                ))
        if fuel_to_insert:
            db.bulk_save_objects(fuel_to_insert)

        # 6. Demand Proxies & Festivals
        for m in market_objs:
            if not db.query(DemandProxy).filter_by(district=m.district, state="karnataka").first():
                db.add(DemandProxy(
                    district=m.district,
                    state="karnataka",
                    population=1500000 + int(rng.uniform(200000, 8000000)),
                    year=2021,
                    source_note="Census 2011 projected (Fixture)",
                    source="fixture",
                ))

        db.commit()
        print("[SUCCESS] Deterministic fixture generation complete!")

    finally:
        db.close()


if __name__ == "__main__":
    generate_fixtures()

