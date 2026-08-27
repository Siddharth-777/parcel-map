# IMPORTS
import uuid
import mimetypes
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.dataset import Dataset
from app.schemas.dataset import DatasetType, DatasetResponse, DatasetListResponse

# ROUTER CONFIGURATION
router = APIRouter(prefix="/datasets", tags=["datasets"])

ALLOWED_EXTENSIONS = {
    ".tif", ".tiff", ".jpg", ".jpeg", ".png",
    ".shp", ".dxf", ".geojson", ".kml", ".gpkg",
    ".csv", ".pdf", ".asc", ".img",
}

# UPLOAD DATASET
@router.post("/upload", response_model=DatasetResponse, status_code=201, summary="Upload a dataset file")
async def upload_dataset(
    file: UploadFile = File(...),
    file_type: DatasetType = Form(DatasetType.unspecified),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Accepted: {sorted(ALLOWED_EXTENSIONS)}",
        )

    dataset_id = str(uuid.uuid4())
    stored_filename = f"{dataset_id}{ext}"

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / stored_filename

    content = await file.read()
    file_size = len(content)
    file_path.write_bytes(content)

    mime = mimetypes.guess_type(file.filename)[0] or "application/octet-stream"

    crs = None
    bbox_minx = bbox_miny = bbox_maxx = bbox_maxy = None

    if ext in (".tif", ".tiff"):
        crs, bbox_minx, bbox_miny, bbox_maxx, bbox_maxy = _extract_raster_metadata(file_path)

    row = Dataset(
        id=dataset_id,
        original_filename=file.filename,
        stored_path=stored_filename,
        file_type=file_type.value,
        file_size_bytes=file_size,
        mime_type=mime,
        uploaded_at=datetime.utcnow(),
        crs=crs,
        bbox_minx=bbox_minx,
        bbox_miny=bbox_miny,
        bbox_maxx=bbox_maxx,
        bbox_maxy=bbox_maxy,
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    return _row_to_response(row)


# LIST DATASETS
@router.get("/", response_model=DatasetListResponse, summary="List uploaded datasets")
def list_datasets(db: Session = Depends(get_db)):
    rows = db.query(Dataset).order_by(Dataset.uploaded_at.desc()).all()
    return DatasetListResponse(datasets=[_row_to_response(r) for r in rows])


def _row_to_response(row: Dataset) -> DatasetResponse:
    return DatasetResponse(
        id=row.id,
        original_filename=row.original_filename,
        stored_path=row.stored_path,
        file_type=DatasetType(row.file_type),
        file_size_bytes=row.file_size_bytes,
        mime_type=row.mime_type,
        uploaded_at=row.uploaded_at,
        crs=row.crs,
        bbox_minx=row.bbox_minx,
        bbox_miny=row.bbox_miny,
        bbox_maxx=row.bbox_maxx,
        bbox_maxy=row.bbox_maxy,
    )


def _extract_raster_metadata(file_path: Path):
    try:
        import rasterio
        with rasterio.open(file_path) as src:
            crs_str = str(src.crs) if src.crs else None
            bounds = src.bounds
            if crs_str and bounds:
                return crs_str, bounds.left, bounds.bottom, bounds.right, bounds.top
    except Exception:
        pass
    return None, None, None, None, None
