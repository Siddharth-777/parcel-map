# Project Description — AI Cadastral Mapping Platform

## What this project is

An AI-assisted pipeline that automates urban cadastral (land parcel) mapping from
drone/aerial imagery. It automatically extracts parcel boundaries, building
footprints, roads/access corridors, and land-use classification from imagery —
producing a preliminary GIS-ready map that a human reviewer corrects, instead of
surveyors tracing everything by hand.

This maps to a real Government of India scheme: **NAKSHA** (National Geospatial
Knowledge-based Land Survey of Urban Habitations), run by the Department of Land
Resources. NAKSHA's own pipeline has 3 stages:

- **MAP-1**: drone survey → orthorectified imagery (ORI) → feature extraction
  *(this project automates the "feature extraction" sub-step of MAP-1)*
- **MAP-2**: field survey / ground truthing → integration with ownership records
- **MAP-3**: claims/objections → final legal land ownership

This project's AI output is explicitly a **preliminary draft**, not a legally
final boundary — final legal parcel determination happens in MAP-2/MAP-3 via
human ground truthing, which is out of scope for the AI.

## Build context

- Hackathon-style build, ~2 days, no fixed schedule — build in priority order,
  cut lowest-priority items if time runs out.
- Built using Claude Code.
- Split across 3 teams: **AML** (AI/ML), **Backend**, **Fullstack**.

## Team ownership

| Area | Owner |
|---|---|
| AI/ML models (segmentation, detection, classification) | AML |
| Data ingestion, storage, model serving, topology validation, GIS export | Backend |
| Web-GIS map viewer, polygon editing, review dashboard | Fullstack |

## Tech stack (chosen for compatibility with real target systems — Tamil Nadu's
TNGIS platform and NAKSHA's own infrastructure use this stack)

- **Backend**: Python, FastAPI
- **Database**: PostgreSQL + PostGIS (spatial geometry columns)
- **GIS export targets**: Shapefile, GeoJSON, PostGIS-compatible geometries
  (ideally GeoServer-publishable)
- **AML**: Python, PyTorch or TensorFlow, GDAL/rasterio/shapely for geospatial
  vectorization
- **Frontend**: React + Leaflet or OpenLayers for the map layer

## Data strategy

### Primary sources (verified — see `PS26012_SixDatasets.xlsx` in repo for full team source list)

| Requirement | Source | Access | Notes |
|---|---|---|---|
| Drone imagery + building footprints | Kaggle svamitva-drone-aerial-images | Instant, free | Main training set for building segmentation |
| Drone imagery + DSM + 5-class GT | UAVPal (Bhopal), 529 tiles, 2cm res | Instant, **CC BY-NC-SA — non-commercial only** | Real multi-class manual annotations, not just buildings |
| Additional urban drone imagery | IIT Roorkee UASG-2023 (Delhi) | Email request, 1–2 day wait, research-use only | Request immediately if using — may not land in time for a 2-day build |
| Orthorectified Imagery (ORI) | Bhoonidhi (ISRO/NRSC) | Free registration | Official EO archive, Cartosat/Sentinel |
| DSM/DTM | Bhoonidhi — CartoDEM / Cartosat Stereo | Free registration, same portal | National coverage |
| **Real cadastral parcel boundaries** | **indian_cadastrals (GitHub, ramSeraph)** | Instant, GitHub Releases | **Covers Tamil Nadu + 26 other states/UTs — check license before any public/commercial use, and verify CRS/projection per state before joining to imagery** |
| GNSS/CORS survey data | Survey of India CORS Network (1105+ stations) | Free for academic/govt after registration | Directly linked to DoLR's NAKSHA initiative |
| Reference pipeline | Project Vaayu — SIH 1705 (GitHub) | Instant, public repo | Working UNet++ notebook + GDAL preprocessing for buildings/roads/water on the exact same problem — read this before building the AML pipeline from scratch |

**Supplementary (not in team list, still worth having):**
- OpenStreetMap (Overpass API / Geofabrik extracts) — road network, still useful even with indian_cadastrals, since roads aren't guaranteed in every cadastral release
- Bhuvan LULC (ISRO/NRSC thematic services, bhuvan.nrsc.gov.in) — official land-use/land-cover data, but only at 30–56m resolution (regional/district scale) — **too coarse for parcel-level land-use classification directly**, but usable as broad contextual signal (e.g. "this block sits in an LULC-tagged urban zone"). Land-use classification still has no strong parcel-level public dataset — plan on the heuristic approach (building density + road proximity + block size) as the realistic MVP.
- Microsoft Global ML Building Footprints, INRIA Aerial Image Labeling, SpaceNet — optional backbone pretraining

### Correction to earlier assumption

The original plan assumed no public dataset had real cadastral parcel
boundaries, and worked around that with a derived-parcel methodology
(road-network polygonization + building-seeded Voronoi tessellation, see
below). **That assumption was wrong** — `indian_cadastrals` has real parcel
geometries for Tamil Nadu. Updated approach:

1. **Where imagery and `indian_cadastrals` coverage overlap**: use the real
   parcel polygons as actual training/validation ground truth for a parcel
   segmentation model — this is a stronger result than a derived layer and
   should be the primary path wherever it's usable.
2. **Where they don't overlap** (likely, since drone imagery and this
   cadastral scrape probably don't cover identical areas): fall back to the
   derived-parcel method — road polygonization (`shapely.ops.polygonize`) +
   building-seeded Voronoi tessellation clipped per block
   (`scipy.spatial.Voronoi`) — as before.
3. Before assuming any overlap, **check geographic bounds of both datasets
   first** — don't build the training pipeline assuming alignment that hasn't
   been verified.

Frame the derived method as a deliberate fallback for the general case (this
mirrors how the real NAKSHA pipeline handles areas without legacy records),
not as the only or primary method now that real GT exists for at least one
state.

## AML model architecture (locked in)

Verified sound — technically appropriate choices, good use of "not everything
needs to be a model." One caveat noted below on the foundation models.

| Task | 2-Day MVP | With more time |
|---|---|---|
| Buildings | U-Net++ (ResNet34/EfficientNet-B0 encoder) | SegFormer / DeepLabV3+ (Swin backbone), init from Prithvi-EO-2.0 or Clay |
| Roads | Same U-Net++, extra output channel | Dedicated FPN or SegFormer |
| Boundary cues (walls/fences/lanes) | Canny / pretrained HED / BDCN — **no training needed** | Learned attraction-field maps (HiSup-style) |
| Raster → polygon | `gdal_polygonize` | Pix2Poly / PolyR-CNN (direct vector prediction) |
| **Parcel boundaries** | Deterministic geometry — building buffer → Voronoi split → clip at roads (Shapely/GeoPandas, **not a model**) | GNN over parcel-adjacency graph (shared-edge consistency) |
| Land-use classification | Fine-tune same U-Net++ as 4-class rooftop classifier (RCC/Tin/Tiled/Other) + rule table | Dedicated multi-task head, more classes, contextual features |
| Topology validation | Shapely `is_valid` / overlay checks (**not a model**) | Same, plus confidence-based auto-fix suggestions |
| Human correction assist | Manual edit in Leaflet UI | SAM2, prompted/interactive |
| Orchestration | None — simple linear pipeline | Thin agentic layer routing uncertain parcels to review |

**Notes:**
- The MVP "parcel boundaries" method (building buffer → Voronoi → clip at
  roads) is the same idea as the road-polygonization + Voronoi method
  described in Data Strategy above, just sequenced differently. Either
  sequencing is fine — pick whichever is easier to implement first, they
  converge on the same kind of output.
- **Land-use via rooftop material classification (RCC/Tin/Tiled/Other) is a
  better MVP than a pure building-density/road-proximity heuristic** — it's a
  real learnable visual signal from imagery rather than a guessed proxy.
  Supersedes the heuristic-only approach mentioned elsewhere in this doc;
  use rooftop classification as the primary MVP method, heuristic as backup
  only if the classifier doesn't converge in time.
- Prithvi-EO-2.0 and Clay are both real, open-source geospatial foundation
  models (confirmed) — but both are pretrained primarily on 10–30m resolution
  satellite imagery (Landsat/Sentinel-2), while this project's drone imagery
  is cm-scale. That's a real domain gap — treat this as a genuine "with more
  time" experiment, not an assumed win. Don't block the MVP path on it.
- SAM2-based interactive correction (last row) is strong enough to be a
  **novelty-tier candidate**, not just a stretch goal — it directly upgrades
  the "manual edit in Leaflet UI" review experience into something demo-worthy
  (click-to-refine a mask instead of manual vertex dragging).

## Functional requirements (from the original problem statement)

The system must:
1. Automatically extract parcel boundaries
2. Identify and delineate building footprints
3. Detect roads, pathways, and access corridors
4. Classify land-use features (residential/commercial/vacant/etc.)

The platform must incorporate:
1. AI-based image segmentation for parcel delineation
2. Deep learning for feature extraction / object detection
3. Automated topology generation and parcel polygon creation
4. Detection of overlapping/inconsistent parcel geometries
5. Web-GIS visualization and editing interface

## Output schema (polygon JSON — this is the shared contract across all 3
teams, must not change without notifying everyone)

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

## Build priority tiers

**Core (ship no matter what)**
- AML: building footprint segmentation model producing real polygons; derived
  parcel pipeline running end-to-end on at least one sample area
- Backend: FastAPI + PostGIS with parcels/buildings/roads schema; endpoint
  returning real (not mock) polygons once AML ships; basic Shapefile/GeoJSON
  export
- Fullstack: map renders imagery + all polygon layers; click a parcel → edit a
  vertex, delete, save

**Full deliverables (once core works)**
- AML: land-use classification (heuristic first, trained classifier if time
  allows); confidence score per polygon
- Backend: topology validation (overlap/gap detection via PostGIS
  `ST_Overlaps`/`ST_IsValid`); GNSS/CORS-style validation stub
- Fullstack: confidence-sorted review queue; survey progress dashboard; layer
  toggles

**Novelty (pick 2–3 if time allows)**
- Digital property card generator (echoes the real NAKSHA/SVAMITVA end
  deliverable — high demo impact)
- Encroachment flagging (building crosses derived parcel boundary)
- Explainability/confidence heatmap overlay
- Quantified "manual effort saved" metric for the demo
- Change detection between two imagery captures of the same area
- SAM2-based interactive correction (click-to-refine a mask instead of manual
  vertex dragging) — see AML model architecture notes above

## Known constraints / gotchas

- If using TNGIS (Tamil Nadu's state GIS platform) data for reference: it's
  informational-use only, not to be published publicly without approval from
  TNeGA, and not for commercial use without approval.
- ECW is a possible raw imagery format if working from official NAKSHA/SVAMITVA
  data drops (not just the Kaggle mirror) — needs GDAL with the ECW driver,
  not just PIL/OpenCV, to read.
- Parcel boundaries are a derived/approximate layer, not a directly-trained
  model output — don't build downstream logic that assumes parcel polygons
  come from the same confidence distribution as building/road detections.

## Current status

Just starting. First concrete task: a script that converts the Kaggle
svamitva-drone-aerial-images dataset into vectorized polygon annotations
(GeoJSON, matching the schema above) for downstream use in training and the
GIS pipeline.
