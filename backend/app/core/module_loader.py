import importlib
import logging
import pkgutil

from fastapi import FastAPI

import app.modules as modules_pkg

log = logging.getLogger("agriintel.loader")


def load_modules(app: FastAPI) -> list[dict]:
    """Discover app/modules/*; mount each module's `router` under /api.

    A module exposes: MODULE_NAME, router (APIRouter), optional JOBS
    (list of dicts: id, func, trigger, kwargs). A module that fails to import
    is skipped and reported, never fatal.
    """
    report: list[dict] = []
    app.state.jobs = []
    for info in sorted(pkgutil.iter_modules(modules_pkg.__path__), key=lambda m: m.name):
        if not info.ispkg:
            continue
        name = info.name
        try:
            mod = importlib.import_module(f"app.modules.{name}")
            router = getattr(mod, "router", None)
            if router is not None:
                app.include_router(router, prefix="/api")
            app.state.jobs.extend(getattr(mod, "JOBS", []))
            report.append({"module": name, "status": "loaded", "error": None})
        except Exception as exc:  # noqa: BLE001
            log.exception("module %s failed to load", name)
            report.append({"module": name, "status": "failed", "error": str(exc)})
    return report

