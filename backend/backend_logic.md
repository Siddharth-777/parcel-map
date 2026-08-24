# Backend Logic Guide

How the backend works, how to run it, how to test it, and what's still missing.

---

## Architecture overview

Requests hit Uvicorn (ASGI server) which routes to FastAPI. Each endpoint validates
the request body through Pydantic schemas, then calls a CRUD function that uses
SQLAlchemy + GeoAlchemy2 to talk to a PostGIS database. Geometry is stored as native
PostGIS POLYGON columns with SRID 4326 (WGS84 lat/lon). Responses serialize back
through Pydantic, converting GeoAlchemy2 geometry objects to GeoJSON coordinate arrays
via Shapely's `mapping()` function.

---

## What each part does

### app/core/config.py

Pydantic `BaseSettings` that reads from environment variables or a `.env` file in the
backend directory. Two settings:

- `DATABASE_URL` — defaults to `postgresql://parcelmap:parcelmap@localhost:5432/parcelmap`
- `CREATE_TABLES` — boolean, defaults to `False`. When `True`, the app's lifespan hook
  calls `Base.metadata.create_all()` at startup (useful for testing without Alembic).

### app/core/database.py

- Creates the SQLAlchemy `engine` from the `DATABASE_URL` setting.
- Defines `SessionLocal` (a session factory bound to the engine).
- Defines `Base` (the declarative base all models inherit from).
- Provides `get_db()` — a generator dependency that yields a session and closes it
  after the request. Used as `Depends(get_db)` in every route that touches the DB.
- Has a SQLite+SpatiaLite fallback path (loads `mod_spatialite` extension) — this
  exists for potential local testing without a full Postgres install, but all real
  usage and verification runs against PostGIS.

### app/models/feature.py

A single SQLAlchemy model `Feature` mapped to the `features` table.

**Design decision: single table with type discriminator.** All four feature types
(parcel, building, road, landuse) share one table. A `type` column (PostgreSQL ENUM)
distinguishes them. This was chosen because:

1. All four types have identical columns — there's no per-type schema divergence.
2. The export endpoints need to query across all types efficiently.
3. The shared polygon schema contract (defined in `CLAUDE.md`) explicitly treats them
   as the same shape of data.

Columns:
- `id` — String primary key (UUID4, generated server-side on create).
- `type` — Enum: `parcel`, `building`, `road`, `landuse`.
- `confidence` — Float, 0.0 to 1.0.
- `source_image` — String filename of the originating drone image.
- `coordinate_space` — Enum: `pixel` or `geo`.
- `geometry` — PostGIS `Geometry("POLYGON", srid=4326)`. GeoAlchemy2 automatically
  creates a GiST spatial index on this column.

### app/schemas/polygon.py

Pydantic models that form the API contract:

- `PolygonFeature` — Full response shape: id, type, confidence, source_image,
  coordinate_space, geometry (as GeoJSON Polygon with coordinates array).
- `PolygonFeatureCreate` — POST request body. Same as above but `id` is optional
  (server generates a UUID if omitted), and `coordinate_space` defaults to `"geo"`.
- `PolygonFeatureUpdate` — PUT request body. All fields optional — only provided
  fields get updated (partial update semantics).
- `PolygonFeatureCollection` — Wrapper with a `features` list. Used as the response
  for all list endpoints.

### app/crud.py

Five functions forming the data access layer:

- `list_features(db, feature_type)` — Queries all rows matching the given type enum,
  converts each to a `PolygonFeature` response schema.
- `get_feature(db, feature_id)` — Returns the raw SQLAlchemy `Feature` row or `None`.
- `create_feature(db, feature_type, data)` — Generates UUID, converts GeoJSON coords
  to a Shapely polygon, wraps in `from_shape(..., srid=4326)`, inserts, returns response.
- `update_feature(db, row, data)` — Partial update: only changes fields that are not
  `None` in the request. Commits and returns the updated response.
- `delete_feature(db, row)` — Deletes and commits.

### Routers

**health.py** — `GET /health` returns `{"status": "healthy"}`. No DB call. Used by
Docker health checks and load balancers.

**parcels.py, buildings.py, roads.py, landuse.py** — Identical structure, each pinned
to a different `FeatureType` enum value. Endpoints:
- `GET /{type}/` — List all features of that type. Returns `PolygonFeatureCollection`.
- `POST /{type}/` — Create a feature. Returns 201 + the created `PolygonFeature`.
- `PUT /{type}/{id}` — Update. Returns 200 + updated feature. 404 if not found or
  wrong type.
- `DELETE /{type}/{id}` — Delete. Returns 204 (no body). 404 if not found or wrong type.

The type check on PUT/DELETE prevents cross-type operations (e.g., you can't delete a
building through the `/parcels/` endpoint even if you know its ID).

**export.py** — `GET /export/` with query params:
- `format=geojson` — Returns a GeoJSON FeatureCollection as `application/geo+json`.
- `format=shapefile` — Returns a zip file containing .shp/.shx/.dbf/.prj/.cpg. Built
  using GeoPandas `to_file()` with the ESRI Shapefile driver. Column names are
  truncated to 10 chars (Shapefile limitation): `feature_type` → `feat_type`,
  `source_image` → `src_image`, `coordinate_space` → `coord_sp`.
- `type=parcel|building|road|landuse` (optional) — Filters the export to one type.

**inference.py** — `POST /inference/run?source_image=<filename>`. Returns 4 hardcoded
mock polygons (one per type) near Chennai. This is intentionally fake — it exists to
unblock the frontend before AML models produce real output. When `aml/scripts/infer.py`
is implemented, this endpoint's internals get replaced with a call to it.

### alembic/ setup

Two real gotchas were discovered during setup:

1. **PostGIS tiger-geocoder system tables.** The `postgis/postgis` Docker image comes
   with ~40 tables in the `public` schema (tiger geocoder: `faces`, `edges`, `addr`,
   `spatial_ref_sys`, etc.). Alembic's autogenerate detects these as "not in your
   models" and generates `drop_table` operations. The fix is `env.py`'s
   `EXCLUDE_TABLES` set passed to `include_object` — it tells Alembic to ignore
   those tables entirely.

2. **GeoAlchemy2 automatic spatial index.** When you declare a `Geometry` column,
   GeoAlchemy2 automatically creates a GiST spatial index (named
   `idx_<table>_<column>`) during `CREATE TABLE`. If you also put an explicit
   `op.create_index()` in the migration, it fails with "relation already exists."
   Solution: don't add an explicit index creation — GeoAlchemy2 handles it.

### seed.py

Populates the DB with 11 sample features located near Chennai (13.08N, 80.27E):
4 buildings, 2 roads, 3 parcels, 2 landuse zones. All are simple rectangles with
realistic confidence scores and source_image filenames.

Safe to re-run: checks `Feature.count()` first, skips if any data exists. Uses
`Base.metadata.create_all()` internally so it works even without running Alembic
(creates the table if missing).

### verify_crud.py

A verification script (not a test framework — just assertions with print output).
Uses FastAPI's `TestClient` so it doesn't need a running server, but DOES need a
running PostGIS instance. Sets `CREATE_TABLES=true` so it auto-creates tables.

It tests:
- Full CRUD cycle (POST → GET → PUT → GET → DELETE → GET → 404) for all 4 types.
- Export: GeoJSON returns valid FeatureCollection; Shapefile zip contains the right
  files and round-trips through GeoPandas with correct CRS.
- Inference mock: still returns exactly 4 features.

---

## How to run it

### Prerequisites

- Python 3.11+ (3.12 also works)
- Docker (for PostGIS, or a local PostgreSQL 16 + PostGIS 3.4 install)

### From a clean clone

```bash
# 1. Start the database
docker-compose up -d db
# Wait a few seconds for Postgres to be ready

# 2. Set up Python environment
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt   # Windows
# or: .venv/bin/pip install -r requirements.txt  # Linux/Mac

# 3. Create a .env file (or use the defaults)
cp .env.example .env
# Edit if your Postgres is on a different host/port/password

# 4. Run the migration
.venv/Scripts/python -m alembic upgrade head

# 5. Seed sample data
.venv/Scripts/python seed.py

# 6. Start the server
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

The API is now live at `http://localhost:8000`. Swagger docs at
`http://localhost:8000/docs`.

### Alternative: full Docker stack

```bash
docker-compose up
```

This builds the backend image and starts both the DB and API together. The API
container runs migrations via `CREATE_TABLES=true` in the environment (not Alembic —
fine for dev, use Alembic for production).

---

## How to test it

### Run the verification script

```bash
cd backend
.venv/Scripts/python verify_crud.py
```

A passing run prints:

```
Parcel Map API — CRUD Verification
==================================================
Health: {'status': 'healthy'}
...
Testing parcels CRUD
  CREATE: <uuid> (confidence=0.72)
  GET list: N features, created ID present
  UPDATE: confidence=0.99, geometry changed
  GET after UPDATE: confirmed persisted
  DELETE: 204
  GET after DELETE: confirmed gone
  404 on missing: confirmed
  PASS
...
(same for buildings, roads, landuse)
...
Testing export endpoints
  GeoJSON: N features exported
  GeoJSON filtered (type=parcel): N features
  Shapefile: zip contains ['cpg', 'dbf', 'prj', 'shp', 'shx']
  Shapefile round-trip: N features, CRS=EPSG:4326
  PASS

Inference mock: still returns 4 features (unchanged)

==================================================
ALL VERIFICATIONS PASSED
==================================================
```

If any assertion fails, the script exits with a traceback pointing to the failing
check.

### Swagger UI

Navigate to `http://localhost:8000/docs` in a browser. Every endpoint is documented
with request/response schemas and a "Try it out" button.

### Example curl commands

**Create a parcel:**
```bash
curl -X POST http://localhost:8000/parcels/ \
  -H "Content-Type: application/json" \
  -d '{
    "confidence": 0.75,
    "source_image": "drone_tile_003.tif",
    "coordinate_space": "geo",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[80.270, 13.082], [80.271, 13.082], [80.271, 13.083], [80.270, 13.083], [80.270, 13.082]]]
    }
  }'
```

**List all parcels:**
```bash
curl http://localhost:8000/parcels/
```

**Export all features as GeoJSON:**
```bash
curl -o export.geojson http://localhost:8000/export/?format=geojson
```

**Export parcels only as Shapefile:**
```bash
curl -o parcels.zip "http://localhost:8000/export/?format=shapefile&type=parcel"
```

---

## Known gaps

### coordinate_space="pixel" is untested and semantically dangerous

The schema allows `coordinate_space: "pixel"` — intended for features extracted in
image pixel coordinates before georeferencing. However:

- The geometry column has SRID 4326 (geographic degrees). If you POST a feature with
  `coordinate_space: "pixel"` and pixel-coordinate geometry (e.g., `[[100, 200], ...]`),
  PostGIS will silently accept it as degrees (latitude 100, longitude 200 — nonsensical
  but not an error).
- No validation exists to reject pixel-space coordinates or store them differently.
- The export endpoints will mix pixel-space and geo-space features in the same output
  without distinguishing them.

**Decision needed before AML integration:** either (a) add validation that rejects
pixel-space features at the API level, (b) store pixel-space features in a separate
column/table without SRID, or (c) require all features to be georeferenced before
they hit the API (making `coordinate_space` purely informational metadata).

### No authentication or authorization

All endpoints are open. Fine for local development; needs auth before any deployment.

### No pagination on list endpoints

`GET /parcels/` returns all parcels. With seed data (11 rows) this is fine. With
thousands of real features, this will be slow and memory-heavy. Needs limit/offset
or cursor pagination before production use.

### Export with zero features

If you request `GET /export/?format=shapefile` and the DB is empty, the Shapefile
export creates an empty GeoDataFrame and writes it. This works but produces a valid
Shapefile with zero features (header only). Not a bug, but worth knowing.

### No spatial queries

The GiST index on the geometry column exists and is ready, but no endpoint uses spatial
filtering (e.g., "give me all parcels within this bounding box"). The frontend will
likely need this once it moves beyond loading all features at once.

### Inference endpoint is entirely mocked

`POST /inference/run` returns the same 4 hardcoded polygons every time regardless of
input. The real implementation depends on `aml/scripts/infer.py` being completed.
