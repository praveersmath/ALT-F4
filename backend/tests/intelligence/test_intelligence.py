"""Unit and integration tests for Part 2 Intelligence module."""
import pytest
from fastapi.testclient import TestClient

from app.core.db import Base, engine
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def prepare_db():
    Base.metadata.create_all(bind=engine)
    # Generate test fixtures if database is empty
    from scripts.make_fixtures import generate_fixtures

    generate_fixtures()
    yield


@pytest.fixture
def client():
    return TestClient(app)


def test_forecast_endpoint(client):
    resp = client.get("/api/forecast?crop=tomato&market_id=1&horizon=7")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["crop"] == "tomato"
    assert data["market_id"] == 1
    assert data["horizon_days"] == 7
    assert data["status"] in ["ok", "insufficient_data"]
    assert len(data["points"]) == 7


def test_hike_alerts_endpoint(client):
    resp = client.get("/api/hike-alerts?crop=tomato&state=karnataka&horizon=7")
    assert resp.status_code == 200
    alerts = resp.json()["data"]
    assert isinstance(alerts, list)
    if alerts:
        a = alerts[0]
        assert "level" in a
        assert a["level"] in ["green", "amber", "red"]
        assert "pct_change" in a
        assert "threshold_pct" in a


def test_atlas_endpoint(client):
    resp = client.get("/api/atlas?crop=tomato&state=karnataka&horizon=7")
    assert resp.status_code == 200
    atlas = resp.json()["data"]
    assert atlas["crop"] == "tomato"
    assert atlas["horizon_days"] == 7
    assert isinstance(atlas["districts"], list)


def test_model_metrics_endpoint(client):
    resp = client.get("/api/model-metrics?crop=tomato")
    assert resp.status_code == 200
    metrics = resp.json()["data"]
    assert isinstance(metrics, list)
    assert len(metrics) > 0
    m = metrics[0]
    assert m["crop"] == "tomato"
    assert "mape" in m
    assert "baseline_mape" in m
    assert "beats_baseline" in m


def test_crop_recommendations_endpoint(client):
    resp = client.get("/api/crop-recommendations?district=Bengaluru%20Urban")
    assert resp.status_code == 200
    rec = resp.json()["data"]
    assert rec["district"] == "Bengaluru Urban"
    assert len(rec["items"]) > 0


def test_msp_advisory_endpoint(client):
    resp = client.get("/api/msp-advisory?crop=wheat&district=Bengaluru%20Urban")
    assert resp.status_code == 200
    adv = resp.json()["data"]
    assert adv["crop"] == "wheat"
    assert adv["msp_applicable"] is True
    assert "advisory" in adv
