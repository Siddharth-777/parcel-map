import re

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.database_url, connect_args=connect_args)

if settings.database_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def _load_spatialite(dbapi_conn, connection_record):
        dbapi_conn.enable_load_extension(True)
        try:
            dbapi_conn.load_extension("mod_spatialite")
        except Exception:
            pass
        dbapi_conn.execute("SELECT InitSpatialMetaData(1)")

SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
