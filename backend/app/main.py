from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.contracts import db_models  # noqa: F401  (registers every table)
from app.core.config import settings
from app.core.db import Base, engine
from app.core.module_loader import load_modules


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = None
    if settings.enable_scheduler:
        try:
            from app.core.scheduler import start_scheduler  # provided by Part 1

            scheduler = start_scheduler(app.state.jobs)
        except ImportError:
            pass
    yield
    if scheduler is not None:
        scheduler.shutdown(wait=False)


def create_app() -> FastAPI:
    application = FastAPI(title="AgriIntel API", version="1.0.0", lifespan=lifespan)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    report = load_modules(application)
    Base.metadata.create_all(bind=engine)

    # Auto-seed initial fixtures if markets table is empty
    try:
        from app.contracts.db_models import Market
        from app.core.db import SessionLocal
        with SessionLocal() as db:
            if db.query(Market).count() == 0:
                from scripts.make_fixtures import generate_fixtures
                generate_fixtures()
    except Exception:
        pass

    @application.get("/health")
    @application.get("/api/health")
    def health():
        failed = [m for m in report if m["status"] == "failed"]
        return {"status": "degraded" if failed else "ok", "modules": report}

    # Mount built frontend SPA distribution (if built) so the full app runs unified on one port
    from pathlib import Path
    from fastapi import HTTPException
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    repo_root = Path(__file__).resolve().parent.parent.parent
    frontend_dist = repo_root / "frontend" / "dist"
    if (frontend_dist / "index.html").exists():
        assets_dir = frontend_dist / "assets"
        if assets_dir.exists():
            application.mount("/assets", StaticFiles(directory=str(assets_dir)), name="spa_assets")

        @application.get("/{full_path:path}")
        async def serve_spa(full_path: str):
            if full_path.startswith("api/") or full_path == "api":
                raise HTTPException(status_code=404, detail="API endpoint not found")
            target = frontend_dist / full_path
            if target.is_file():
                return FileResponse(target)
            return FileResponse(frontend_dist / "index.html")

    return application


app = create_app()

