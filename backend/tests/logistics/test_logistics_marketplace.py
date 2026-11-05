"""Unit and contract tests for Part 3: Logistics, Auth, and Marketplace modules."""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from app.core.db import Base, engine
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def prepare_db():
    Base.metadata.create_all(bind=engine)
    root_str = str(REPO_ROOT)
    if root_str not in sys.path:
        sys.path.insert(0, root_str)
    from scripts.make_fixtures import generate_fixtures

    generate_fixtures()
    yield


@pytest.fixture
def client():
    return TestClient(app)


def test_auth_and_marketplace_flow(client):
    # 1. Register a test farmer
    email = "farmer_test@agriintel.in"
    reg_resp = client.post(
        "/api/auth/register",
        json={
            "name": "Ramesh Gowda",
            "email": email,
            "password": "Password123!",
            "role": "farmer",
            "district": "Bengaluru Urban",
        },
    )
    assert reg_resp.status_code in [201, 400]  # 400 if rerun

    # 2. Login
    login_resp = client.post(
        "/api/auth/login",
        json={"email": email, "password": "Password123!"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["data"]["access_token"]
    assert token is not None

    # 3. Get profile (/auth/me)
    me_resp = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["data"]["email"] == email

    # 4. Create listing
    listing_resp = client.post(
        "/api/listings",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "crop": "tomato",
            "quantity_qtl": 25.0,
            "asking_price_per_qtl": 2200.0,
            "district": "Bengaluru Urban",
            "market_id": 1,
        },
    )
    assert listing_resp.status_code == 201
    listing_data = listing_resp.json()["data"]
    listing_id = listing_data["id"]
    assert listing_data["crop"] == "tomato"
    assert "price_check" in listing_data
    assert listing_data["price_check"]["verdict"] in [
        "fair",
        "below_market",
        "above_market",
        "below_msp",
        "no_reference",
    ]

    # 5. Get listing by id
    get_resp = client.get(f"/api/listings/{listing_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["data"]["id"] == listing_id

    # 6. List listings
    list_resp = client.get("/api/listings?crop=tomato")
    assert list_resp.status_code == 200
    assert isinstance(list_resp.json()["data"], list)

    # 7. Update status
    patch_resp = client.patch(
        f"/api/listings/{listing_id}/status",
        headers={"Authorization": f"Bearer {token}"},
        json={"status": "sold"},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["data"]["status"] == "sold"


def test_transport_cost_endpoint(client):
    resp = client.get(
        "/api/transport-cost?dest_market_id=1&crop=tomato&quantity_qtl=10&origin_lat=12.97&origin_lon=77.59"
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert "freight" in data
    assert "toll" in data
    assert "mandi_fee" in data
    assert "total" in data
    assert "per_quintal" in data


def test_best_market_endpoint(client):
    resp = client.get(
        "/api/best-market?crop=tomato&origin_lat=12.97&origin_lon=77.59&quantity_qtl=10&horizon=7"
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["crop"] == "tomato"
    assert len(data["options"]) > 0
    first_opt = data["options"][0]
    assert first_opt["rank"] == 1
    assert "net_price_per_qtl" in first_opt
    assert "weather_risk" in first_opt
