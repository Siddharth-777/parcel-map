import io
import json
import tempfile
import zipfile

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping
import geopandas as gpd
from shapely.geometry import shape

from app.core.database import get_db
from app.models.feature import Feature
from app.schemas.polygon import FeatureType

router = APIRouter(prefix="/export", tags=["export"])


def _query_features(db: Session, feature_type: str | None):
    q = db.query(Feature)
    if feature_type:
        q = q.filter(Feature.type == feature_type)
    return q.all()


def _rows_to_geojson(rows: list[Feature]) -> dict:
    features = []
    for row in rows:
        geom = to_shape(row.geometry)
        features.append({
            "type": "Feature",
            "properties": {
                "id": row.id,
                "feature_type": row.type,
                "confidence": row.confidence,
                "source_image": row.source_image,
                "coordinate_space": row.coordinate_space,
            },
            "geometry": mapping(geom),
        })
    return {"type": "FeatureCollection", "features": features}


@router.get("/", summary="Export features as GeoJSON or Shapefile")
def export_features(
    format: str = Query("geojson", description="Export format: geojson or shapefile"),
    type: str | None = Query(None, description="Filter by feature type: parcel, building, road, landuse"),
    db: Session = Depends(get_db),
):
    if type and type not in [e.value for e in FeatureType]:
        return {"error": f"Invalid type. Must be one of: {[e.value for e in FeatureType]}"}

    rows = _query_features(db, type)

    if format == "geojson":
        geojson = _rows_to_geojson(rows)
        content = json.dumps(geojson, indent=2)
        return StreamingResponse(
            io.BytesIO(content.encode()),
            media_type="application/geo+json",
            headers={"Content-Disposition": "attachment; filename=export.geojson"},
        )

    elif format == "shapefile":
        geojson = _rows_to_geojson(rows)
        if not geojson["features"]:
            gdf = gpd.GeoDataFrame(columns=["id", "feat_type", "confidence", "src_image", "coord_sp", "geometry"])
            gdf = gdf.set_geometry("geometry")
            gdf.crs = "EPSG:4326"
        else:
            gdf = gpd.GeoDataFrame.from_features(geojson["features"], crs="EPSG:4326")
            gdf = gdf.rename(columns={
                "feature_type": "feat_type",
                "source_image": "src_image",
                "coordinate_space": "coord_sp",
            })

        buf = io.BytesIO()
        with tempfile.TemporaryDirectory() as tmpdir:
            shp_path = f"{tmpdir}/export.shp"
            gdf.to_file(shp_path, driver="ESRI Shapefile")

            with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
                import os
                for fname in os.listdir(tmpdir):
                    zf.write(f"{tmpdir}/{fname}", fname)

        buf.seek(0)
        return StreamingResponse(
            buf,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=export.zip"},
        )

    return {"error": "Invalid format. Use 'geojson' or 'shapefile'."}
