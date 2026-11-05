"""Contract test validating all registered endpoints against schemas."""
import pytest
from fastapi.testclient import TestClient

from app.contracts import schemas
from app.contracts.endpoints import ENDPOINTS
from app.core.db import Base, engine
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def init_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


def test_health_endpoint(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert "status" in body
    assert "modules" in body
    assert isinstance(body["modules"], list)


@pytest.mark.parametrize("ep", [e for e in ENDPOINTS if e.get("contract_test", True)])
def test_contract_endpoint(client, ep):
    method = ep["method"].upper()
    path = f"/api{ep['path']}"
    sample_params = ep.get("sample_params", {})

    # Check if the path is registered in FastAPI routes
    registered_paths = {route.path for route in app.routes}
    if path not in registered_paths:
        pytest.skip(f"Endpoint {path} not registered (owner {ep['owner']} not merged)")

    if method == "GET":
        resp = client.get(path, params=sample_params)
    elif method == "POST":
        resp = client.post(path, json=sample_params)
    else:
        pytest.skip(f"Method {method} not handled in contract test")

    assert resp.status_code < 500, f"Endpoint {path} failed with server error 500"

    body = resp.json()
    if resp.status_code == 200:
        # Validate envelope structure
        assert "data" in body, f"Envelope missing 'data' in {path}"
        assert "meta" in body, f"Envelope missing 'meta' in {path}"
        meta = schemas.Meta.model_validate(body["meta"])
        assert meta.data_source in ["live", "cached", "fixture", "no_data"]

        model_name = ep.get("data_model")
        if model_name and hasattr(schemas, model_name):
            model_cls = getattr(schemas, model_name)
            data_val = body["data"]
            if ep.get("is_list", False):
                assert isinstance(data_val, list), f"Expected list in {path}"
                for item in data_val:
                    model_cls.model_validate(item)
            else:
                model_cls.model_validate(data_val)
    elif 400 <= resp.status_code < 500:
        # Validate ErrorResponse structure
        assert "error" in body, f"Error envelope missing 'error' key in {path}"
        schemas.ErrorResponse.model_validate(body)
    else:
        pytest.fail(f"Unexpected status code {resp.status_code} for {path}")

