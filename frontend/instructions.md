# Running the Project

## Prerequisites

- Python 3.11+
- Node.js 18+
- (Optional) PostgreSQL if using a real database

## Backend (FastAPI) — port 8000

```bash
cd BACKEND

# Create and activate virtual environment (first time only)
python -m venv venv

# Activate venv
# Windows (Git Bash):
source venv/Scripts/activate
# Windows (CMD):
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run with SQLite (local dev, no PostgreSQL needed)
DATABASE_URL="sqlite:///./test.db" CREATE_TABLES=true uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# OR run with PostgreSQL
# Set DATABASE_URL in a .env file (see .env.example) then:
# uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API docs available at: http://localhost:8000/docs

## Frontend (Vite + React) — port 5173

```bash
cd FRONTEND

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

App available at: http://localhost:5173

## URLs

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:8000        |
| API Docs | http://localhost:8000/docs   |
| Health   | http://localhost:8000/health |
