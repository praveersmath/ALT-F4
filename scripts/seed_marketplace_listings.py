import sys
from pathlib import Path
backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.core.db import SessionLocal
from app.contracts.db_models import User, Listing, Market, Crop
from app.modules.auth.auth_service import hash_password

db = SessionLocal()

try:
    # Ensure verified producers/farmers exist in users table
    producers_data = [
        {"name": "Ramesh Patil", "email": "patil.spices@agriintel.in", "role": "farmer", "district": "Haveri"},
        {"name": "Srinivas Murthy", "email": "murthy.kolar@agriintel.in", "role": "farmer", "district": "Kolar"},
        {"name": "Manjunath Gowda", "email": "manju.davanagere@agriintel.in", "role": "farmer", "district": "Davanagere"},
        {"name": "B.K. Devegowda", "email": "devegowda.hassan@agriintel.in", "role": "farmer", "district": "Hassan"},
        {"name": "Shankare Gowda", "email": "cauvery.jaggery@agriintel.in", "role": "farmer", "district": "Mandya"},
        {"name": "Mohammad Ismail", "email": "ismail.kalaburagi@agriintel.in", "role": "wholesaler", "district": "Kalaburagi"},
        {"name": "Chennabasappa", "email": "raichur.cotton@agriintel.in", "role": "wholesaler", "district": "Raichur"},
        {"name": "Ganesh Bhat", "email": "bhat.areca@agriintel.in", "role": "farmer", "district": "Dakshina Kannada"},
        {"name": "Prakash Kulkarni", "email": "kulkarni.belagavi@agriintel.in", "role": "farmer", "district": "Belagavi"},
    ]

    user_map = {}
    for p in producers_data:
        user = db.query(User).filter_by(email=p["email"]).first()
        if not user:
            user = User(
                name=p["name"],
                email=p["email"],
                password_hash=hash_password("AgriIntel@2026"),
                role=p["role"],
                district=p["district"],
            )
            db.add(user)
            db.flush()
        user_map[p["name"]] = user
    db.commit()

    # Query market map by district
    markets = db.query(Market).all()
    market_by_dist = {m.district: m.id for m in markets}

    # B2B Wholesale Listings
    wholesale_lots = [
        {
            "producer": "Ramesh Patil",
            "crop": "chilli",
            "quantity_qtl": 65.0,
            "asking_price": 19200.0,
            "district": "Haveri",
            "market_id": market_by_dist.get("Haveri", 11),
        },
        {
            "producer": "Srinivas Murthy",
            "crop": "tomato",
            "quantity_qtl": 140.0,
            "asking_price": 2480.0,
            "district": "Kolar",
            "market_id": market_by_dist.get("Kolar", 2),
        },
        {
            "producer": "Manjunath Gowda",
            "crop": "maize",
            "quantity_qtl": 250.0,
            "asking_price": 2180.0,
            "district": "Davanagere",
            "market_id": market_by_dist.get("Davanagere", 6),
        },
        {
            "producer": "B.K. Devegowda",
            "crop": "potato",
            "quantity_qtl": 180.0,
            "asking_price": 1620.0,
            "district": "Hassan",
            "market_id": market_by_dist.get("Hassan", 10),
        },
        {
            "producer": "Shankare Gowda",
            "crop": "sugarcane",
            "quantity_qtl": 500.0,
            "asking_price": 350.0,
            "district": "Mandya",
            "market_id": market_by_dist.get("Mandya", 9),
        },
        {
            "producer": "Mohammad Ismail",
            "crop": "tur",
            "quantity_qtl": 120.0,
            "asking_price": 7600.0,
            "district": "Kalaburagi",
            "market_id": market_by_dist.get("Kalaburagi", 12),
        },
        {
            "producer": "Chennabasappa",
            "crop": "cotton",
            "quantity_qtl": 90.0,
            "asking_price": 7050.0,
            "district": "Raichur",
            "market_id": market_by_dist.get("Raichur", 13),
        },
        {
            "producer": "Ganesh Bhat",
            "crop": "arecanut",
            "quantity_qtl": 45.0,
            "asking_price": 43500.0,
            "district": "Dakshina Kannada",
            "market_id": market_by_dist.get("Dakshina Kannada", 20),
        },
        {
            "producer": "Prakash Kulkarni",
            "crop": "wheat",
            "quantity_qtl": 160.0,
            "asking_price": 2420.0,
            "district": "Belagavi",
            "market_id": market_by_dist.get("Belagavi", 4),
        },
    ]

    for lot in wholesale_lots:
        existing = db.query(Listing).filter_by(
            user_id=user_map[lot["producer"]].id,
            crop_id=lot["crop"],
            district=lot["district"]
        ).first()
        if not existing:
            listing = Listing(
                user_id=user_map[lot["producer"]].id,
                crop_id=lot["crop"],
                market_id=lot["market_id"],
                district=lot["district"],
                quantity_qtl=lot["quantity_qtl"],
                asking_price_per_qtl=lot["asking_price"],
                status="open",
            )
            db.add(listing)
    db.commit()
    print("Seeded B2B wholesale listings successfully!")
finally:
    db.close()

