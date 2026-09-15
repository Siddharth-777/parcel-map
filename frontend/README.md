# GEO-DRAFT — AI-Enabled Urban Cadastral Mapping Platform

Automated parcel boundary, building footprint, and road corridor extraction from drone imagery for the NAKSHA/TNGIS cadastral survey pipeline.

## Quick Start (Docker)

Requires Docker and Docker Compose.

```bash
docker compose up --build
```

This starts:
- **PostgreSQL + PostGIS** on port 5432 (auto-creates the `postgis` extension)
- **FastAPI backend** on port 8000 (auto-runs Alembic migrations on startup)

The frontend runs separately via Vite dev server:

```bash
cd FRONTEND
npm install
npm run dev
```

Frontend available at http://localhost:5173, backend API docs at http://localhost:8000/docs.

## Manual Setup (without Docker)

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ with PostGIS extension

### Database

```sql
CREATE DATABASE parcelmap;
\c parcelmap
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Backend

```bash
cd BACKEND
python -m venv .venv

# Activate (Windows Git Bash)
source .venv/Scripts/activate
# Activate (Linux/Mac)
source .venv/bin/activate

pip install -r requirements.txt

# Copy and edit environment
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd FRONTEND
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### Backend (`BACKEND/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://parcelmap:parcelmap@localhost:5432/parcelmap` | PostgreSQL connection string |
| `CREATE_TABLES` | `false` | Auto-create tables on startup (local dev fallback only; use Alembic migrations in production) |
| `UPLOAD_DIR` | `./uploads` | Directory for uploaded dataset files |

### Frontend (`FRONTEND/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/parcels/` | GET, POST | List/create parcel features |
| `/parcels/{id}` | PUT, DELETE | Update/delete a parcel |
| `/buildings/` | GET, POST | List/create building features |
| `/buildings/{id}` | PUT, DELETE | Update/delete a building |
| `/roads/` | GET, POST | List/create road features |
| `/roads/{id}` | PUT, DELETE | Update/delete a road |
| `/landuse/` | GET, POST | List/create land-use features |
| `/landuse/{id}` | PUT, DELETE | Update/delete a land-use feature |
| `/inference/run` | POST | Run mock inference (returns sample polygons) |
| `/export?format=geojson\|shapefile` | GET | Export features as GeoJSON or Shapefile |
| `/datasets/upload` | POST | Upload a dataset file |
| `/datasets/` | GET | List uploaded datasets |

## Project Structure

```
├── BACKEND/
│   ├── app/
│   │   ├── core/          # Config, database engine
│   │   ├── models/        # SQLAlchemy models (Feature, Dataset)
│   │   ├── routers/       # FastAPI route handlers
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   └── crud.py        # Database CRUD operations
│   ├── alembic/           # Database migrations
│   ├── Dockerfile
│   ├── entrypoint.sh      # Docker entrypoint (runs migrations + uvicorn)
│   ├── init.sql           # PostGIS extension creation
│   └── requirements.txt
├── FRONTEND/
│   ├── src/
│   │   ├── pages/         # Landing, Dashboard, Workspace, Review, Approval
│   │   ├── components/    # Shared components (BaseTileLayer)
│   │   └── data/          # Mock GIS data for map visualization
│   └── package.json
├── docker-compose.yml
└── README.md
```
