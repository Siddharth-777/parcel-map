# IMPORTS
from fastapi import APIRouter

# ROUTER CONFIGURATION
router = APIRouter(tags=["health"])

# HEALTH CHECK
@router.get("/health", summary="Service health check")
def health_check():
    return {"status": "healthy"}