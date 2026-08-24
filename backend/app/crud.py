# IMPORTS
import uuid

from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape, from_shape
from shapely.geometry import shape, mapping

from app.models.feature import Feature
from app.schemas.polygon import (
    FeatureType,
    PolygonFeature,
    PolygonFeatureCreate,
    PolygonFeatureUpdate,
    GeoJSONPolygon,
    CoordinateSpace,
)

# DATABASE MODEL TO API SCHEMA
def _model_to_schema(row: Feature) -> PolygonFeature:
    geom = to_shape(row.geometry)
    coords = mapping(geom)["coordinates"]
    return PolygonFeature(
        id=row.id,
        type=FeatureType(row.type),
        confidence=row.confidence,
        source_image=row.source_image,
        coordinate_space=CoordinateSpace(row.coordinate_space),
        geometry=GeoJSONPolygon(coordinates=list(coords)),
    )

# LIST FEATURES
def list_features(db: Session, feature_type: FeatureType) -> list[PolygonFeature]:
    rows = db.query(Feature).filter(Feature.type == feature_type.value).all()
    return [_model_to_schema(r) for r in rows]

# GET FEATURE
def get_feature(db: Session, feature_id: str) -> Feature | None:
    return db.query(Feature).filter(Feature.id == feature_id).first()

# CREATE FEATURE
def create_feature(db: Session, feature_type: FeatureType, data: PolygonFeatureCreate) -> PolygonFeature:
    feature_id = data.id or str(uuid.uuid4())
    geom_shape = shape({"type": "Polygon", "coordinates": data.geometry.coordinates})
    row = Feature(
        id=feature_id,
        type=feature_type.value,
        confidence=data.confidence,
        source_image=data.source_image,
        coordinate_space=data.coordinate_space.value,
        geometry=from_shape(geom_shape, srid=4326),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _model_to_schema(row)

# UPDATE FEATURE
def update_feature(db: Session, row: Feature, data: PolygonFeatureUpdate) -> PolygonFeature:
    if data.confidence is not None:
        row.confidence = data.confidence
    if data.source_image is not None:
        row.source_image = data.source_image
    if data.coordinate_space is not None:
        row.coordinate_space = data.coordinate_space.value
    if data.geometry is not None:
        geom_shape = shape({"type": "Polygon", "coordinates": data.geometry.coordinates})
        row.geometry = from_shape(geom_shape, srid=4326)
    db.commit()
    db.refresh(row)
    return _model_to_schema(row)

# DELETE FEATURE
def delete_feature(db: Session, row: Feature) -> None:
    db.delete(row)
    db.commit()