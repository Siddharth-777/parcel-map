# IMPORTS
import uuid

from fastapi import APIRouter

from app.schemas.polygon import (
    PolygonFeature,
    PolygonFeatureCollection,
    FeatureType,
    CoordinateSpace,
    GeoJSONPolygon,
)

# ROUTER CONFIGURATION
router = APIRouter(prefix="/inference", tags=["inference"])

# MOCK INFERENCE
@router.post("/run", response_model=PolygonFeatureCollection, summary="Run mock inference on an image")
def run_inference(source_image: str = "drone_tile_001.tif"):
    # Return sample polygons until the real AML inference model is integrated.
    features = [
        PolygonFeature(
            id=str(uuid.uuid4()),
            type=FeatureType.building,
            confidence=0.91,
            source_image=source_image,
            coordinate_space=CoordinateSpace.geo,
            geometry=GeoJSONPolygon(
                coordinates=[[[80.2705, 13.0825], [80.2708, 13.0825], [80.2708, 13.0828], [80.2705, 13.0828], [80.2705, 13.0825]]]
            ),
        ),
        PolygonFeature(
            id=str(uuid.uuid4()),
            type=FeatureType.road,
            confidence=0.94,
            source_image=source_image,
            coordinate_space=CoordinateSpace.geo,
            geometry=GeoJSONPolygon(
                coordinates=[[[80.270, 13.081], [80.273, 13.081], [80.273, 13.0812], [80.270, 13.0812], [80.270, 13.081]]]
            ),
        ),
        PolygonFeature(
            id=str(uuid.uuid4()),
            type=FeatureType.parcel,
            confidence=0.68,
            source_image=source_image,
            coordinate_space=CoordinateSpace.geo,
            geometry=GeoJSONPolygon(
                coordinates=[[[80.270, 13.082], [80.272, 13.082], [80.272, 13.084], [80.270, 13.084], [80.270, 13.082]]]
            ),
        ),
        PolygonFeature(
            id=str(uuid.uuid4()),
            type=FeatureType.landuse,
            confidence=0.75,
            source_image=source_image,
            coordinate_space=CoordinateSpace.geo,
            geometry=GeoJSONPolygon(
                coordinates=[[[80.269, 13.080], [80.274, 13.080], [80.274, 13.085], [80.269, 13.085], [80.269, 13.080]]]
            ),
        ),
    ]

    return PolygonFeatureCollection(features=features)