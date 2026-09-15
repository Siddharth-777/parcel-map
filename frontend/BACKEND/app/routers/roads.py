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
router = APIRouter(prefix="/roads", tags=["roads"])
FEATURE_TYPE = FeatureType.road

# LIST ROADS
@router.get("/", response_model=PolygonFeatureCollection, summary="List all roads")
def list_roads(db: Session = Depends(get_db)):
    features = list_features(db, FEATURE_TYPE)
    return PolygonFeatureCollection(features=features)

# CREATE ROAD
@router.post("/", response_model=PolygonFeature, status_code=201, summary="Create a road")
def create_road(data: PolygonFeatureCreate, db: Session = Depends(get_db)):
    return create_feature(db, FEATURE_TYPE, data)

# UPDATE ROAD
@router.put("/{feature_id}", response_model=PolygonFeature, summary="Update a road")
def update_road(feature_id: str, data: PolygonFeatureUpdate, db: Session = Depends(get_db)):
    row = get_feature(db, feature_id)
    if not row or row.type != FEATURE_TYPE.value:
        raise HTTPException(status_code=404, detail="Road not found")
    return update_feature(db, row, data)

# DELETE ROAD
@router.delete("/{feature_id}", status_code=204, summary="Delete a road")
def delete_road(feature_id: str, db: Session = Depends(get_db)):
    row = get_feature(db, feature_id)
    if not row or row.type != FEATURE_TYPE.value:
        raise HTTPException(status_code=404, detail="Road not found")
    delete_feature(db, row)