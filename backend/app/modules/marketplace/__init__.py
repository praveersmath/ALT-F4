"""Marketplace module init."""
from app.modules.marketplace.router import router

MODULE_NAME = "marketplace"
JOBS = []

__all__ = ["MODULE_NAME", "router", "JOBS"]
