"""End-to-end CRUD verification using TestClient against a real PostGIS database.

Requires: PostGIS running on localhost:5432 (docker-compose up db).
Set DATABASE_URL env var if non-default.

Usage: python verify_crud.py
"""

import os
import sys
import json
import tempfile
import zipfile

os.environ.setdefault("DATABASE_URL", "postgresql://parcelmap:parcelmap@localhost:5432/parcelmap")
os.environ["CREATE_TABLES"] = "true"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

PARCEL_DATA = {
    "confidence": 0.72,
    "source_image": "drone_tile_001.tif",
    "coordinate_space": "geo",
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[80.270, 13.082], [80.271, 13.082], [80.271, 13.083], [80.270, 13.083], [80.270, 13.082]]]
    }
}

UPDATED_GEOMETRY = {
    "type": "Polygon",
    "coordinates": [[[80.270, 13.082], [80.272, 13.082], [80.272, 13.084], [80.270, 13.084], [80.270, 13.082]]]
}


def test_crud_cycle(resource, data):
    print(f"\n{'='*50}")
    print(f"Testing {resource} CRUD")
    print(f"{'='*50}")

    # CREATE
    r = client.post(f"/{resource}/", json=data)
    assert r.status_code == 201, f"CREATE failed: {r.status_code} {r.text}"
    created = r.json()
    feature_id = created["id"]
    print(f"  CREATE: {feature_id} (confidence={created['confidence']})")

    # GET (list)
    r = client.get(f"/{resource}/")
    assert r.status_code == 200
    features = r.json()["features"]
    ids = [f["id"] for f in features]
    assert feature_id in ids, f"Created feature not in list: {ids}"
    print(f"  GET list: {len(features)} features, created ID present")

    # UPDATE
    r = client.put(f"/{resource}/{feature_id}", json={"confidence": 0.99, "geometry": UPDATED_GEOMETRY})
    assert r.status_code == 200, f"UPDATE failed: {r.status_code} {r.text}"
    updated = r.json()
    assert updated["confidence"] == 0.99, f"Confidence not updated: {updated['confidence']}"
    assert updated["geometry"]["coordinates"] == UPDATED_GEOMETRY["coordinates"]
    print(f"  UPDATE: confidence=0.99, geometry changed")

    # GET after update (verify persistence)
    r = client.get(f"/{resource}/")
    found = [f for f in r.json()["features"] if f["id"] == feature_id][0]
    assert found["confidence"] == 0.99
    print(f"  GET after UPDATE: confirmed persisted")

    # DELETE
    r = client.delete(f"/{resource}/{feature_id}")
    assert r.status_code == 204, f"DELETE failed: {r.status_code}"
    print(f"  DELETE: 204")

    # GET after delete (confirm gone)
    r = client.get(f"/{resource}/")
    ids = [f["id"] for f in r.json()["features"]]
    assert feature_id not in ids, "Feature still present after delete!"
    print(f"  GET after DELETE: confirmed gone")

    # PUT/DELETE on missing ID returns 404
    r = client.put(f"/{resource}/{feature_id}", json={"confidence": 0.5})
    assert r.status_code == 404
    r = client.delete(f"/{resource}/{feature_id}")
    assert r.status_code == 404
    print(f"  404 on missing: confirmed")

    print(f"  PASS")


def test_export():
    print(f"\n{'='*50}")
    print(f"Testing export endpoints")
    print(f"{'='*50}")

    # Seed a feature for export
    r = client.post("/parcels/", json=PARCEL_DATA)
    assert r.status_code == 201

    # GeoJSON export
    r = client.get("/export/?format=geojson")
    assert r.status_code == 200
    geojson = json.loads(r.content)
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) >= 1
    print(f"  GeoJSON: {len(geojson['features'])} features exported")

    # GeoJSON filtered by type
    r = client.get("/export/?format=geojson&type=parcel")
    assert r.status_code == 200
    geojson = json.loads(r.content)
    for f in geojson["features"]:
        assert f["properties"]["feature_type"] == "parcel"
    print(f"  GeoJSON filtered (type=parcel): {len(geojson['features'])} features")

    # Shapefile export
    r = client.get("/export/?format=shapefile")
    assert r.status_code == 200
    assert "application/zip" in r.headers["content-type"]

    # Verify the zip contains .shp/.shx/.dbf/.prj
    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp:
        tmp.write(r.content)
        tmp_path = tmp.name

    with zipfile.ZipFile(tmp_path) as zf:
        names = zf.namelist()
        extensions = {n.split(".")[-1] for n in names}
        assert "shp" in extensions, f"No .shp in zip: {names}"
        assert "shx" in extensions, f"No .shx in zip: {names}"
        assert "dbf" in extensions, f"No .dbf in zip: {names}"
        assert "prj" in extensions, f"No .prj in zip: {names}"
    print(f"  Shapefile: zip contains {sorted(extensions)}")

    # Read back with geopandas
    import geopandas as gpd
    gdf = gpd.read_file(f"zip://{tmp_path}")
    assert len(gdf) >= 1
    assert gdf.crs.to_epsg() == 4326
    print(f"  Shapefile round-trip: {len(gdf)} features, CRS=EPSG:{gdf.crs.to_epsg()}")

    os.unlink(tmp_path)
    print(f"  PASS")


if __name__ == "__main__":
    print("Parcel Map API — CRUD Verification")
    print("=" * 50)

    # Health check
    r = client.get("/health")
    assert r.status_code == 200
    print(f"Health: {r.json()}")

    # Test all 4 resource types
    for resource in ["parcels", "buildings", "roads", "landuse"]:
        test_crud_cycle(resource, PARCEL_DATA)

    # Test export
    test_export()

    # Verify inference mock still works (unchanged)
    r = client.post("/inference/run?source_image=test.tif")
    assert r.status_code == 200
    assert len(r.json()["features"]) == 4
    print(f"\nInference mock: still returns 4 features (unchanged)")

    print(f"\n{'='*50}")
    print("ALL VERIFICATIONS PASSED")
    print(f"{'='*50}")
