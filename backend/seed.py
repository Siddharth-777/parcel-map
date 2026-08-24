"""Seed the database with sample features near Chennai (13.08N, 80.27E)."""

import uuid
from app.core.database import SessionLocal, engine, Base
from app.models.feature import Feature
from geoalchemy2.shape import from_shape
from shapely.geometry import Polygon


def make_rect(lng, lat, w=0.0003, h=0.0003):
    return Polygon([
        [lng, lat], [lng + w, lat], [lng + w, lat + h], [lng, lat + h], [lng, lat]
    ])


SEED_DATA = [
    # Buildings
    {"type": "building", "confidence": 0.92, "source_image": "drone_tile_001.tif", "lng": 80.2705, "lat": 13.0825, "w": 0.0003, "h": 0.0003},
    {"type": "building", "confidence": 0.88, "source_image": "drone_tile_001.tif", "lng": 80.2712, "lat": 13.0822, "w": 0.0003, "h": 0.0003},
    {"type": "building", "confidence": 0.85, "source_image": "drone_tile_001.tif", "lng": 80.2718, "lat": 13.0830, "w": 0.0004, "h": 0.0003},
    {"type": "building", "confidence": 0.79, "source_image": "drone_tile_002.tif", "lng": 80.2690, "lat": 13.0815, "w": 0.0003, "h": 0.0004},
    # Roads
    {"type": "road", "confidence": 0.95, "source_image": "drone_tile_001.tif", "lng": 80.2700, "lat": 13.0810, "w": 0.0030, "h": 0.0002},
    {"type": "road", "confidence": 0.93, "source_image": "drone_tile_001.tif", "lng": 80.2700, "lat": 13.0820, "w": 0.0002, "h": 0.0020},
    # Parcels
    {"type": "parcel", "confidence": 0.72, "source_image": "drone_tile_001.tif", "lng": 80.2700, "lat": 13.0820, "w": 0.0010, "h": 0.0010},
    {"type": "parcel", "confidence": 0.68, "source_image": "drone_tile_001.tif", "lng": 80.2710, "lat": 13.0820, "w": 0.0010, "h": 0.0010},
    {"type": "parcel", "confidence": 0.65, "source_image": "drone_tile_002.tif", "lng": 80.2685, "lat": 13.0810, "w": 0.0012, "h": 0.0012},
    # Land-use
    {"type": "landuse", "confidence": 0.80, "source_image": "drone_tile_001.tif", "lng": 80.2690, "lat": 13.0800, "w": 0.0040, "h": 0.0040},
    {"type": "landuse", "confidence": 0.75, "source_image": "drone_tile_002.tif", "lng": 80.2680, "lat": 13.0805, "w": 0.0020, "h": 0.0020},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Feature).count()
        if existing > 0:
            print(f"Database already has {existing} features, skipping seed.")
            return

        for item in SEED_DATA:
            poly = make_rect(item["lng"], item["lat"], item.get("w", 0.0003), item.get("h", 0.0003))
            row = Feature(
                id=str(uuid.uuid4()),
                type=item["type"],
                confidence=item["confidence"],
                source_image=item["source_image"],
                coordinate_space="geo",
                geometry=from_shape(poly, srid=4326),
            )
            db.add(row)

        db.commit()
        print(f"Seeded {len(SEED_DATA)} features.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
