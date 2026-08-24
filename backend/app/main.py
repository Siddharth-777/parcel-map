from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import health, parcels, buildings, roads, landuse, inference, export


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.create_tables:
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Parcel Map API",
    description="AI cadastral mapping platform — feature extraction from drone imagery",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(parcels.router)
app.include_router(buildings.router)
app.include_router(roads.router)
app.include_router(landuse.router)
app.include_router(inference.router)
app.include_router(export.router)
