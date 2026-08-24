from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud import list_features, get_feature, create_feature, update_feature, delete_feature
from app.schemas.polygon import (
    FeatureType,
    PolygonFeature,
    PolygonFeatureCollection,
    PolygonFeatureCreate,
    PolygonFeatureUpdate,
)

router = APIRouter(prefix="/buildings", tags=["buildings"])
FEATURE_TYPE = FeatureType.building


@router.get("/", response_model=PolygonFeatureCollection, summary="List all buildings")
def list_buildings(db: Session = Depends(get_db)):
    features = list_features(db, FEATURE_TYPE)
    return PolygonFeatureCollection(features=features)


@router.post("/", response_model=PolygonFeature, status_code=201, summary="Create a building")
def create_building(data: PolygonFeatureCreate, db: Session = Depends(get_db)):
    return create_feature(db, FEATURE_TYPE, data)


@router.put("/{feature_id}", response_model=PolygonFeature, summary="Update a building")
def update_building(feature_id: str, data: PolygonFeatureUpdate, db: Session = Depends(get_db)):
    row = get_feature(db, feature_id)
    if not row or row.type != FEATURE_TYPE.value:
        raise HTTPException(status_code=404, detail="Building not found")
    return update_feature(db, row, data)


@router.delete("/{feature_id}", status_code=204, summary="Delete a building")
def delete_building(feature_id: str, db: Session = Depends(get_db)):
    row = get_feature(db, feature_id)
    if not row or row.type != FEATURE_TYPE.value:
        raise HTTPException(status_code=404, detail="Building not found")
    delete_feature(db, row)
