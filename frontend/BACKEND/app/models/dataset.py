# IMPORTS
from datetime import datetime

from sqlalchemy import Column, String, BigInteger, Float, DateTime, Enum as SAEnum

from app.core.database import Base

# DATASET MODEL
class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True)
    original_filename = Column(String, nullable=False)
    stored_path = Column(String, nullable=False)
    file_type = Column(
        SAEnum(
            "drone_imagery", "dsm", "dtm", "cadastral_scan",
            "gnss_csv", "vector", "unspecified",
            name="dataset_type",
        ),
        nullable=False,
    )
    file_size_bytes = Column(BigInteger, nullable=False)
    mime_type = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    crs = Column(String, nullable=True)
    bbox_minx = Column(Float, nullable=True)
    bbox_miny = Column(Float, nullable=True)
    bbox_maxx = Column(Float, nullable=True)
    bbox_maxy = Column(Float, nullable=True)
