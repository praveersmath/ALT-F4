"""Auth module init."""
from app.modules.auth.router import router

MODULE_NAME = "auth"
JOBS = []

__all__ = ["MODULE_NAME", "router", "JOBS"]
