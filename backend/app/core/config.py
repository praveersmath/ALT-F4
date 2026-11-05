from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./agriintel.db"
    cors_origins: str = "http://localhost:5173"
    use_fixtures: bool = False
    enable_scheduler: bool = False
    admin_token: str = ""
    data_gov_in_api_key: str = ""
    ors_api_key: str = ""
    jwt_secret: str = ""


settings = Settings()

