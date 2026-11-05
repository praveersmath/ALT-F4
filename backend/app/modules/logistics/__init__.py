"""Logistics module init."""
from app.modules.logistics.router import router

MODULE_NAME = "logistics"
JOBS = []

__all__ = ["MODULE_NAME", "router", "JOBS"]
