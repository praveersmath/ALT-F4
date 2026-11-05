from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_DEFAULT_DB_PATH = (_REPO_ROOT / "agriintel.db").as_posix()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = f"sqlite:///{_DEFAULT_DB_PATH}"
    cors_origins: str = "http://localhost:5173"
    use_fixtures: bool = False
    enable_scheduler: bool = False
    admin_token: str = ""
    data_gov_in_api_key: str = ""
    ors_api_key: str = ""
    jwt_secret: str = ""


settings = Settings()

