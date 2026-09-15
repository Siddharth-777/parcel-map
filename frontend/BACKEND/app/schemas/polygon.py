# IMPORTS
from enum import Enum
from pydantic import BaseModel, Field

# FEATURE TYPES
class FeatureType(str, Enum):
    parcel = "parcel"
    building = "building"
    road = "road"
    landuse = "landuse"

# COORDINATE TYPES
class CoordinateSpace(str, Enum):
    pixel = "pixel"
    geo = "geo"

# GEOJSON POLYGON
class GeoJSONPolygon(BaseModel):
    type: str = "Polygon"
    coordinates: list[list[list[float]]]

# RESPONSE SCHEMA
class PolygonFeature(BaseModel):
    """Shared polygon schema — cross-team contract."""

    id: str
    type: FeatureType
    confidence: float = Field(ge=0.0, le=1.0)
    source_image: str
    coordinate_space: CoordinateSpace
    geometry: GeoJSONPolygon

# CREATE SCHEMA
class PolygonFeatureCreate(BaseModel):
    """Create request — id is optional (server generates if omitted)."""

    id: str | None = None
    confidence: float = Field(ge=0.0, le=1.0)
    source_image: str
    coordinate_space: CoordinateSpace = CoordinateSpace.geo
    geometry: GeoJSONPolygon

# UPDATE SCHEMA
class PolygonFeatureUpdate(BaseModel):
    """Update request — all fields optional, only provided fields change."""

    confidence: float | None = Field(default=None, ge=0.0, le=1.0)
    source_image: str | None = None
    coordinate_space: CoordinateSpace | None = None
    geometry: GeoJSONPolygon | None = None

# COLLECTION SCHEMA
class PolygonFeatureCollection(BaseModel):
    features: list[PolygonFeature]