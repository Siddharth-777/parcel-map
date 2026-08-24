from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://parcelmap:parcelmap@localhost:5432/parcelmap"
    create_tables: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
