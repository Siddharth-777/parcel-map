# IMPORTS
from sqlalchemy import Column, String, Float, Enum as SAEnum
from geoalchemy2 import Geometry

from app.core.database import Base

# FEATURE MODEL
class Feature(Base):
    __tablename__ = "features"

    id = Column(String, primary_key=True)
    type = Column(SAEnum("parcel", "building", "road", "landuse", name="feature_type"), nullable=False)
    confidence = Column(Float, nullable=False)
    source_image = Column(String, nullable=False)
    coordinate_space = Column(SAEnum("pixel", "geo", name="coordinate_space"), nullable=False)
    geometry = Column(Geometry("POLYGON", srid=4326), nullable=False)