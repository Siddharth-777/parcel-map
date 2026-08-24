---
paths:
  - "aml/**"
  - "**/models/**"
  - "**/train*"
  - "**/segmentation*"
---

## MVP model choices (locked in)

| Task | Method |
|---|---|
| Buildings + roads | U-Net++ (ResNet34 or EfficientNet-B0 encoder), roads as extra output channel |
| Boundary cues | Pretrained Canny/HED/BDCN — no training required |
| Raster → polygon | `gdal_polygonize` |
| Land-use | Fine-tune same U-Net++ as 4-class rooftop classifier (RCC/Tin/Tiled/Other) + rule table |

Rooftop material classification (RCC/Tin/Tiled/Other) supersedes the earlier
building-density/road-proximity heuristic. If old heuristic code exists in the
repo, the rooftop classifier is the current intended method.

## Foundation models (stretch goal only)

Prithvi-EO-2.0 and Clay are real and available, but pretrained at 10-30m
satellite resolution vs. this project's cm-scale drone imagery. That's a real
domain gap — treat as experimental, do not block the MVP path on either.
