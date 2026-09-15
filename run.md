# run.md — Parcel Map Project: Audit Report & Run Instructions

## What Was Found Broken

### 1. `backend/.env` — Missing entirely
**File:** `backend/.env`
**Problem:** Did not exist. Only `backend/.env.example` was present. While pydantic-settings has matching defaults, the missing file meant Alembic and explicit configuration had no `.env` to load.
**Fix:** Created `backend/.env` from `.env.example` with `DATABASE_URL`, `CREATE_TABLES=false`, and `UPLOAD_DIR=./uploads`.

### 2. `frontend/.env` — Wrong port + leading whitespace
**File:** `frontend/.env`
**Problem:** Two issues: (a) Every line had 3 leading spaces (`   VITE_API_URL=...`), which can break Vite's dotenv parser. (b) `VITE_API_URL` was set to `http://localhost:8010` but the backend runs on port `8000`.
**Fix:** Rewrote the file with no leading whitespace and `VITE_API_URL=http://localhost:8000`. Preserved the existing valid Mapbox token.

### 3. `backend/requirements.txt` — Missing `numpy`
**File:** `backend/requirements.txt`
**Problem:** `backend/app/routers/extraction_preview.py` line 11 does `import numpy as np`, but `numpy` was not listed in `requirements.txt`. It was installed transitively via scipy/geopandas, but was not declared as a direct dependency.
**Fix:** Added `numpy` to `requirements.txt`.

### 4. `frontend/public/GEODRAFT.svg` — Deleted
**File:** `frontend/public/GEODRAFT.svg`
**Problem:** Referenced in `frontend/src/App.jsx:70` as the navbar logo (`src="/GEODRAFT.svg"`), but the file had been deleted from the working tree (still existed in git).
**Fix:** Restored from git via `git restore frontend/public/GEODRAFT.svg`.

## Non-blocking Issues (not fixed, noted for awareness)

- `geojson==3.1.0` in `backend/requirements.txt` is never imported — dead dependency
- `Pillow`, `scipy`, `openai` are unpinned in requirements.txt
- `datetime.utcnow()` in `backend/app/models/dataset.py:25` is deprecated in Python 3.12+
- `@mapbox/shp-write` and `html2canvas` in `frontend/package.json` are never imported
- `ApprovalPage.jsx` uses hardcoded Esri tiles instead of `BaseTileLayer` component (inconsistent but functional)
- CORS is set to `allow_origins=["*"]` — fine for local dev, tighten for production

---

## How to Run (from clean state)

### Prerequisites

- Docker Desktop installed and running
- Python 3.11+ with venv support
- Node.js 18+ with npm
- Git

### Step 1: Start the database

Only the `db` service runs in Docker. The backend runs natively.

```bash
cd D:\PROJECTS\parcel-map
docker compose up -d db
```

Wait for PostGIS to be ready:

```bash
docker compose exec db pg_isready -U parcelmap -d parcelmap
```

### Step 2: Set up and start the backend

```bash
cd D:\PROJECTS\parcel-map\backend

# Create venv (skip if .venv already exists)
python -m venv .venv

# Activate venv
.venv\Scripts\activate        # Windows cmd
# or: source .venv/Scripts/activate   # Git Bash

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Step 3: Verify the backend

```bash
# Health check
curl http://localhost:8000/health
# Expected: {"status":"healthy"}

# Check API docs in browser
# http://localhost:8000/docs
# Should show all endpoints: health, parcels, buildings, roads, landuse,
# inference, export, datasets, extraction/preview
```

### Step 4: Start the frontend

In a separate terminal:

```bash
cd D:\PROJECTS\parcel-map\frontend
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

### Step 5: Verify the full flow

1. **Landing page** loads with GEODRAFT branding
2. Click through to **Dashboard**
3. The green pulsing dot and "NAKSHA Pilot Pipeline Active" confirm backend connectivity
4. **Upload an image** (drag-and-drop or browse) — should get a toast "Uploaded: filename"
5. The AI extraction preview runs automatically (10-60 seconds) — shows "Processing..." then the overlay
6. **Workspace** page shows source image and AI overlay side-by-side with stats
7. **Review** page shows the overlay with KPI cards (parcel count, road count, coverage %)
8. **Export** buttons (GeoJSON / Shapefile) download files
9. **Approval** page renders with mock data on a Leaflet map

---

## Environment Files

### `backend/.env`

```
DATABASE_URL=postgresql://parcelmap:parcelmap@localhost:5432/parcelmap
CREATE_TABLES=false
UPLOAD_DIR=./uploads
```

### `frontend/.env`

```
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=<your-mapbox-public-token>
```

### `aml/.env`

```
OPENAI_API_KEY=<your-openai-api-key>
```

The extraction preview feature (`POST /extraction/preview`) requires a valid OpenAI API key in `aml/.env`. If this key is missing or expired, uploads still work but the AI overlay generation will return a 502 error.

---

## Architecture Notes

- **Backend** runs natively (not in Docker) on port 8000 — this is intentional so it has direct filesystem access to `aml/` for the extraction preview
- **Database** (PostGIS) runs in Docker on port 5432
- The `extraction_preview` router auto-discovers `aml/` by walking up the directory tree from its own file location — no manual path config needed as long as `backend/` and `aml/` are siblings under the project root
- The AI extraction preview uses OpenAI's `gpt-image-2` model (generative overlay) — this is NOT the trained segmentation model. Real ML inference uses `aml/ml_models/meridian-building-b0.pth` via the `/inference/run` endpoint

## Verified End-to-End (2026-09-12)

| Test | Result |
|------|--------|
| `GET /health` | 200 |
| `GET /docs` | All 14 endpoints, 9 routers |
| `POST /datasets/upload` | 201, file stored correctly |
| `POST /extraction/preview` | 200, 14 parcels / 3 roads detected, ~56s |
| `GET /datasets/` | 200, lists uploaded datasets |
| `POST /parcels/` (CRUD) | 201, creates feature in PostGIS |
| `GET /export/?format=geojson` | 200, valid FeatureCollection |
| `GET /export/?format=shapefile` | 200, valid zip download |
| Frontend `:5173` | Loads correctly, all pages render |
