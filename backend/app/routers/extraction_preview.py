# Generative AI preview overlay endpoint. Calls aml/generate.py directly (OpenAI
# image-edit model) — this is NOT the trained segmentation model. For real detections
# from meridian/traverse/plat, see /inference/run instead.

import base64
import io
import os
import sys
from pathlib import Path

import numpy as np
from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image
from scipy import ndimage

router = APIRouter()

# Matches the fixed palette generate.py's prompt asks the model to draw with.
# Overlay fills are low-opacity over the aerial photo, so we match by rough
# color distance rather than exact RGB — these are estimates, not detections.
_PARCEL_PALETTE = {
    "yellow": (255, 255, 0),
    "blue": (0, 0, 255),
    "green": (0, 255, 0),
    "magenta": (255, 0, 255),
    "orange": (255, 165, 0),
    "cyan": (0, 255, 255),
}
_ROAD_COLOR = (255, 0, 0)
_COLOR_MATCH_THRESHOLD = 60  # sum of abs channel diffs; tune if estimates look off
_MIN_REGION_PIXELS = 40  # drop stray pixels/anti-aliasing fringes from the count


def _color_mask(arr: np.ndarray, target_rgb: tuple[int, int, int]) -> np.ndarray:
    diff = np.abs(arr.astype(int) - np.array(target_rgb))
    return diff.sum(axis=-1) < _COLOR_MATCH_THRESHOLD


def _count_regions(mask: np.ndarray) -> int:
    labeled, num = ndimage.label(mask)
    if num == 0:
        return 0
    sizes = ndimage.sum(mask, labeled, index=range(1, num + 1))
    return int(np.sum(np.asarray(sizes) >= _MIN_REGION_PIXELS))


def _estimate_stats(overlay_png_bytes: bytes):
    """Best-effort estimate from the generated overlay's own colors — not a
    calibrated measurement. Returns (parcel_count, road_count, coverage_pct),
    or (None, None, None) if analysis fails for any reason."""
    try:
        img = Image.open(io.BytesIO(overlay_png_bytes)).convert("RGB")
        arr = np.array(img)
        total_pixels = arr.shape[0] * arr.shape[1]

        parcel_count = 0
        parcel_mask_total = np.zeros(arr.shape[:2], dtype=bool)
        for rgb in _PARCEL_PALETTE.values():
            mask = _color_mask(arr, rgb)
            parcel_count += _count_regions(mask)
            parcel_mask_total |= mask

        road_mask = _color_mask(arr, _ROAD_COLOR)
        road_count = _count_regions(road_mask)

        overlay_pixels = int(np.sum(parcel_mask_total | road_mask))
        coverage_pct = round(100 * overlay_pixels / total_pixels, 1)
        return parcel_count, road_count, coverage_pct
    except Exception:
        return None, None, None


def _find_aml_dir():
    # aml/ does not live as a sibling of this backend in every checkout of this
    # project — set AML_DIR in backend/.env to its absolute path if it's not
    # found automatically. Falls back to searching upward for any parent
    # folder that directly contains an aml/ subfolder.
    override = os.environ.get("AML_DIR")
    if override:
        path = Path(override)
        if path.is_dir():
            return path
        raise RuntimeError(f"AML_DIR is set to '{override}' but that path doesn't exist")

    for parent in Path(__file__).resolve().parents:
        candidate = parent / "aml"
        if candidate.is_dir():
            return candidate

    raise RuntimeError(
        "Could not locate aml/ automatically — set AML_DIR in backend/.env "
        "to its absolute path, e.g. AML_DIR=D:\\PROJECTS\\parcel-map\\aml"
    )


AML_DIR = _find_aml_dir()
if str(AML_DIR) not in sys.path:
    sys.path.insert(0, str(AML_DIR))

from generate import generate_overlay  # noqa: E402  (import after sys.path fix, by design)


@router.post("/extraction/preview")
async def extraction_preview(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        result_bytes = generate_overlay(image_bytes)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"generation failed: {exc}")

    parcel_count, road_count, coverage_pct = _estimate_stats(result_bytes)
    data_url = f"data:image/png;base64,{base64.b64encode(result_bytes).decode('utf-8')}"

    return {
        "image": data_url,
        "parcel_count": parcel_count,
        "road_count": road_count,
        "overlay_coverage_pct": coverage_pct,
    }