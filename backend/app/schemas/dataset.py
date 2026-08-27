# IMPORTS
from datetime import datetime
from enum import Enum

from pydantic import BaseModel

# DATASET TYPE ENUM
class DatasetType(str, Enum):
    drone_imagery = "drone_imagery"
    dsm = "dsm"
    dtm = "dtm"
    cadastral_scan = "cadastral_scan"
    gnss_csv = "gnss_csv"
    vector = "vector"
    unspecified = "unspecified"

# RESPONSE SCHEMA
class DatasetResponse(BaseModel):
    id: str
    original_filename: str
    stored_path: str
    file_type: DatasetType
    file_size_bytes: int
    mime_type: str
    uploaded_at: datetime
    crs: str | None = None
    bbox_minx: float | None = None
    bbox_miny: float | None = None
    bbox_maxx: float | None = None
    bbox_maxy: float | None = None

# LIST RESPONSE
class DatasetListResponse(BaseModel):
    datasets: list[DatasetResponse]
