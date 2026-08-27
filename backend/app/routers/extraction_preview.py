# Generative AI preview overlay endpoint. Calls aml/generate.py directly (OpenAI
# image-edit model) — this is NOT the trained segmentation model. For real detections
# from meridian/traverse/plat, see /inference/run instead.

import os
import sys
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response

router = APIRouter()


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
    return Response(content=result_bytes, media_type="image/png")