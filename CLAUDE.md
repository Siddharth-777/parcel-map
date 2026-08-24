# CLAUDE.md

AI cadastral mapping platform: extracts building footprints, roads, and land-use
from drone imagery, then produces parcel boundaries via one of two paths:
(1) where real cadastral GT exists (`indian_cadastrals` — covers Tamil Nadu + 26
states), train/validate against real parcel polygons; (2) where it doesn't, derive
parcels via road-network polygonization + building-seeded Voronoi tessellation.
**Always check geographic overlap before choosing a path — never assume either.**

Full project context: @project_description.md

## Team ownership

| Area | Owner |
|---|---|
| Segmentation, detection, classification models | AML |
| Ingestion, storage, model serving, topology, GIS export | Backend |
| Web-GIS viewer, polygon editing, review dashboard | Fullstack |

## Tech stack

- Backend: Python, FastAPI, PostgreSQL + PostGIS
- AML: Python, PyTorch/TensorFlow, GDAL, rasterio, shapely, scipy
- Frontend: React + Leaflet or OpenLayers
- Export formats: Shapefile, GeoJSON, PostGIS geometries

## Shared polygon schema (cross-team contract — change requires all-team notification)

```json
{
  "id": "<unique id>",
  "type": "parcel | building | road | landuse",
  "confidence": 0.0,
  "source_image": "<original filename>",
  "coordinate_space": "pixel | geo",
  "geometry": { "type": "Polygon", "coordinates": [...] }
}
```

## Commands

<!-- TODO: add as scripts are created (venv setup, run server, run pipeline, tests) -->

## Gotchas

### Data licensing

- **UAVPal (Bhopal)**: CC BY-NC-SA — non-commercial use only. Do not include in
  any commercial or monetized deliverable.
- **IIT Roorkee UASG-2023**: research-use only, requires email request with 1-2
  day turnaround. Do not depend on it for imminent deadlines.
- **TNGIS data**: informational-use only. No public publishing without TNeGA
  approval; no commercial use without approval.

### Technical

- **ECW format**: official NAKSHA/SVAMITVA imagery may be ECW — requires GDAL with
  the ECW driver (not PIL/OpenCV).
- **Parcel confidence**: whether from real GT or derived geometry, parcel polygons
  do not share the same confidence distribution as building/road detections.
  Downstream logic must account for this.
