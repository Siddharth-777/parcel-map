# Repository File Structure

A guide to what each file in this repo does, organized by directory.
Skip this if you're looking for project goals or architecture decisions — see
`project_description.md` and `CLAUDE.md` for those.

---

## Root-level files

```
README.md                   — One-line project description (placeholder, not fleshed out).
project_description.md      — Full project context: goals, data strategy, model architecture,
                              build priorities. The "why" and "what" of the whole project.
CLAUDE.md                   — AI-assistant context file. Contains the shared polygon schema
                              contract, tech stack summary, commands, and gotchas. Read by
                              Claude Code on every conversation start.
docker-compose.yml          — Defines two services: PostGIS 16-3.4 database (port 5432) and
                              the FastAPI backend (port 8000). Single command to spin up the
                              full backend stack.
.gitignore                  — Configured for Python, Node, geospatial data files (.tif, .shp,
                              .ecw), and IDE artifacts.
bedrock.env                 — AWS Bedrock environment config (not used by the app itself).
```

---

## backend/

The FastAPI + PostGIS backend. This is the most complete part of the repo — all CRUD
endpoints are live and tested against a real database.

```
backend/
├── .env.example            — Template for environment variables. Only var is DATABASE_URL.
├── Dockerfile              — Python 3.11-slim image, installs libpq + requirements, runs
│                             uvicorn on port 8000.
├── requirements.txt        — Python dependencies: FastAPI, SQLAlchemy, GeoAlchemy2,
│                             psycopg2, Alembic, Shapely, GeoPandas, Fiona.
├── seed.py                 — Populates the database with 11 sample features (4 buildings,
│                             2 roads, 3 parcels, 2 landuse) near Chennai. Safe to re-run —
│                             skips if data already exists.
├── verify_crud.py          — End-to-end test script. Exercises full CRUD cycle on all 4
│                             resource types + both export formats. Uses FastAPI TestClient
│                             against a real PostGIS instance.
├── alembic.ini             — Alembic configuration. DB URL is set programmatically in env.py
│                             (not hardcoded here).
├── alembic/
│   ├── env.py              — Migration environment. Imports our Base metadata, sets DB URL
│   │                         from app settings, and includes an EXCLUDE_TABLES set that
│   │                         filters out PostGIS system tables (tiger geocoder, topology)
│   │                         to prevent autogenerate from touching them.
│   ├── script.py.mako      — Template for new migration files (Alembic default).
│   ├── README              — Alembic boilerplate one-liner.
│   └── versions/
│       └── dd6dcecc7fc9_...py — Initial migration: creates the `features` table with a
│                                 PostGIS POLYGON(4326) geometry column and enum types for
│                                 feature_type and coordinate_space.
├── app/
│   ├── main.py             — FastAPI app factory. Registers all routers, adds CORS
│   │                         middleware (allow all origins for dev), and optionally creates
│   │                         tables on startup via CREATE_TABLES env var.
│   ├── crud.py             — Database operations layer. Functions: list_features (filtered
│   │                         by type), get_feature, create_feature, update_feature,
│   │                         delete_feature. Handles Shapely <-> GeoAlchemy2 conversion.
│   ├── core/
│   │   ├── config.py       — Pydantic Settings class. Reads DATABASE_URL and CREATE_TABLES
│   │   │                     from environment / .env file.
│   │   └── database.py     — SQLAlchemy engine, SessionLocal, DeclarativeBase, and the
│   │                         get_db() dependency. Also has a SQLite+SpatiaLite fallback
│   │                         path (for potential testing without Postgres).
│   ├── models/
│   │   └── feature.py      — The single SQLAlchemy model: `Feature`. All 4 feature types
│   │                         (parcel, building, road, landuse) share one table with a `type`
│   │                         enum discriminator. Geometry column is POLYGON with SRID 4326.
│   ├── schemas/
│   │   └── polygon.py      — Pydantic models: PolygonFeature (response), PolygonFeatureCreate
│   │                         (POST body), PolygonFeatureUpdate (PUT body, all fields optional),
│   │                         PolygonFeatureCollection (list wrapper). These implement the
│   │                         shared polygon schema contract from CLAUDE.md.
│   └── routers/
│       ├── health.py       — GET /health — returns {"status": "healthy"}.
│       ├── parcels.py      — CRUD for parcels: GET/POST /parcels/, PUT/DELETE /parcels/{id}.
│       ├── buildings.py    — CRUD for buildings: GET/POST /buildings/, PUT/DELETE /buildings/{id}.
│       ├── roads.py        — CRUD for roads: GET/POST /roads/, PUT/DELETE /roads/{id}.
│       ├── landuse.py      — CRUD for landuse: GET/POST /landuse/, PUT/DELETE /landuse/{id}.
│       ├── export.py       — GET /export/?format=geojson|shapefile&type=<optional filter>.
│       │                     GeoJSON returns a FeatureCollection. Shapefile returns a zip
│       │                     containing .shp/.shx/.dbf/.prj/.cpg files.
│       └── inference.py    — POST /inference/run — returns 4 hardcoded mock polygons near
│                             Chennai. Placeholder until AML's real inference is ready.
```

---

## aml/

AI/ML pipeline code. Mostly stubs defining interfaces — real model training and inference
have not been implemented yet.

```
aml/
├── requirements-aml.txt    — Heavy ML dependencies: PyTorch, torchvision,
│                             segmentation-models-pytorch, OpenCV, GDAL, rasterio, etc.
│                             Install in a separate venv from the backend.
├── data/
│   ├── raw/.gitkeep        — Placeholder for raw imagery (gitignored).
│   └── processed/.gitkeep  — Placeholder for preprocessed tiles (gitignored).
├── models/
│   └── unetpp.py           — WORKING CODE (not a stub). Builds a U-Net++ model via the
│                             segmentation-models-pytorch library. 3-class output:
│                             background, building, road. Encoder defaults to ResNet34
│                             with ImageNet weights.
├── scripts/
│   └── infer.py            — STUB. Defines the run_inference() interface (image path in,
│                             polygon features out) but raises NotImplementedError. The
│                             backend's /inference/run mock mirrors this interface —
│                             when this script works, the backend calls it instead.
├── parcel/
│   └── derive.py           — STUB. Outlines the deterministic parcel derivation pipeline
│                             (buffer buildings → Voronoi on centroids → clip to block
│                             minus roads). Documents the CRS contract (storage: 4326,
│                             working: 32644) but raises NotImplementedError.
└── topology/
    └── validate.py         — STUB. Interface for topology validation (check for invalid
                              geometries and overlapping parcels). Raises NotImplementedError.
```

---

## frontend/

React + Vite + Leaflet map viewer. Scaffolded from the Vite React template with Leaflet
added. Has a working map that displays polygons from the backend's inference endpoint.

```
frontend/
├── package.json            — Dependencies: React 19, react-leaflet 5, leaflet, Vite 8.
│                             Scripts: dev (Vite HMR), build, lint (oxlint), preview.
├── vite.config.js          — Minimal Vite config with the React plugin.
├── .oxlintrc.json          — Linter config: React hooks rules + oxc plugin.
├── .gitignore              — Standard Vite gitignore (node_modules, dist, logs).
├── README.md               — Vite template boilerplate (not project-specific).
├── index.html              — HTML shell, mounts React at #root.
├── public/
│   ├── favicon.svg         — Browser tab icon.
│   └── icons.svg           — SVG icon sheet.
├── dist/                   — Built output (gitignored in production, present locally).
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx            — React entry point. Renders <App /> into #root.
    ├── index.css           — Global reset (margin/padding zero, full-height body).
    ├── App.jsx             — Top-level component. Currently just renders <MapView />.
    ├── api/
    │   └── client.js       — API client functions: fetchInference(), fetchParcels(),
    │                         fetchBuildings(), fetchRoads(). All hit localhost:8000.
    ├── components/
    │   └── MapView.jsx     — Leaflet map centered on Chennai (13.082, 80.271) at zoom 17.
    │                         On mount, calls fetchInference() and renders each polygon
    │                         color-coded by type (orange=parcel, blue=building,
    │                         gray=road, green=landuse). Shows confidence on hover tooltip.
    └── assets/
        ├── hero.png        — Decorative image (from Vite template or project branding).
        ├── react.svg       — React logo from Vite template.
        └── vite.svg        — Vite logo from Vite template.
```

---

## .claude/

Configuration for Claude Code (the AI assistant). Not part of the application runtime.

```
.claude/
├── settings.local.json     — Local permission allowlist for Claude Code bash commands
│                             (pip install, uvicorn, alembic).
└── rules/
    ├── cadastral-extraction.md — Activated when touching parcel/topology files. Enforces:
    │                              parcel boundaries are NEVER trained models (deterministic
    │                              only), dual-path decision rule (check indian_cadastrals
    │                              coverage before choosing approach), CRS contract
    │                              (store in 4326, compute in 32644).
    ├── cv-models.md            — Activated when touching aml/ or model files. Documents
    │                              locked-in MVP model choices (U-Net++, ResNet34, etc.)
    │                              and notes that foundation models are stretch-goal only.
    └── ui.md                   — Activated for frontend files. Currently empty placeholder
                                  (no frontend conventions established yet).
```
