from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health", summary="AI Service Health Check")
def health_check():
    return {
        "status": "UP",
        "service": "learnrec-ai-service",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
