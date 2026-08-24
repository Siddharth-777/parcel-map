# IMPORTS
from pydantic_settings import BaseSettings

# SETTINGS
class Settings(BaseSettings):
    database_url: str = "postgresql://parcelmap:parcelmap@localhost:5432/parcelmap"
    create_tables: bool = False

    class Config:
        env_file = ".env"

# SETTINGS INSTANCE
settings = Settings()