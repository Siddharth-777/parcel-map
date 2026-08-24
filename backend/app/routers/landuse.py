# IMPORTS
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import (
    list_features,
    get_feature,
    create_feature,
    update_feature,
    delete_feature,
)
from app.schemas.polygon import (
    FeatureType,
    PolygonFeature,
    PolygonFeatureCollection,
    PolygonFeatureCreate,
    PolygonFeatureUpdate,
)

# ROUTER CONFIGURATION
router = APIRouter(prefix="/landuse", tags=["landuse"])
FEATURE_TYPE = FeatureType.landuse

# LIST LAND-USE FEATURES
@router.get("/", response_model=PolygonFeatureCollection, summary="List all land-use features")
def list_landuse(db: Session = Depends(get_db)):
    features = list_features(db, FEATURE_TYPE)
    return PolygonFeatureCollection(features=features)

# CREATE LAND-USE FEATURE
@router.post("/", response_model=PolygonFeature, status_code=201, summary="Create a land-use feature")
def create_landuse(data: PolygonFeatureCreate, db: Session = Depends(get_db)):
    return create_feature(db, FEATURE_TYPE, data)

# UPDATE LAND-USE FEATURE
@router.put("/{feature_id}", response_model=PolygonFeature, summary="Update a land-use feature")
def update_landuse(feature_id: str, data: PolygonFeatureUpdate, db: Session = Depends(get_db)):
    row = get_feature(db, feature_id)
    if not row or row.type != FEATURE_TYPE.value:
        raise HTTPException(status_code=404, detail="Land-use feature not found")
    return update_feature(db, row, data)

# DELETE LAND-USE FEATURE
@router.delete("/{feature_id}", status_code=204, summary="Delete a land-use feature")
def delete_landuse(feature_id: str, db: Session = Depends(get_db)):
    row = get_feature(db, feature_id)
    if not row or row.type != FEATURE_TYPE.value:
        raise HTTPException(status_code=404, detail="Land-use feature not found")
    delete_feature(db, row)