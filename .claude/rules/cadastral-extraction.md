---
paths:
  - "aml/parcel/**"
  - "aml/topology/**"
  - "**/parcel*"
  - "**/topology*"
  - "**/cadastral*"
---

## Parcel boundaries: deterministic geometry ONLY

Parcel boundaries and topology validation are **never** trained models in this
project. They are deterministic geometry operations (Shapely/GeoPandas). If you
are about to train something for parcel boundaries or topology validation, stop —
that contradicts the project's locked-in design.

## Dual-path decision rule

Before building any parcel pipeline for a given area:

1. Check if `indian_cadastrals` (GitHub, ramSeraph) has coverage for that geography.
2. Verify CRS/projection of `indian_cadastrals` data for that state — it varies.
3. Check if imagery bounds actually overlap that coverage spatially.
4. **If overlap exists** → use real parcel polygons as training/validation GT.
5. **If not** → fall back to derived method: road-network polygonization
   (`shapely.ops.polygonize`) + building-seeded Voronoi tessellation
   (`scipy.spatial.Voronoi`) clipped per block.

Do not default to either path without checking. Do not assume spatial alignment.

## CRS rule for geometry operations

Storage and API CRS: **EPSG:4326** (WGS84, lat/lon degrees). This never changes.

Working CRS for all geometry math: **EPSG:32644** (WGS84 / UTM zone 44N — correct
for Tamil Nadu/Chennai). Every function that does buffer, Voronoi, area, distance,
or any metric-dependent geometry operation must:

1. Reproject input from EPSG:4326 → EPSG:32644 before the math.
2. Do all geometry operations in projected coordinates (meters).
3. Reproject result back to EPSG:4326 before storing or returning via API.

**Why**: buffer/Voronoi in raw degrees produces wrong shapes — 1 degree of longitude
is not the same distance as 1 degree of latitude, and neither is a fixed number of
meters. This applies to `derive_parcels`, topology validation, and any future
geometry operation on buildings/roads/parcels.

## `indian_cadastrals` gotcha

License is unverified for public/commercial use — verify before publishing
anything built on it. CRS/projection varies per state — always verify before
spatial joins to imagery.
