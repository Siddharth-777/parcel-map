# IMPORTS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# DATABASE ENGINE
engine = create_engine(settings.database_url)

# SESSION
SessionLocal = sessionmaker(bind=engine)

# BASE MODEL
class Base(DeclarativeBase):
    pass

# DATABASE DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()