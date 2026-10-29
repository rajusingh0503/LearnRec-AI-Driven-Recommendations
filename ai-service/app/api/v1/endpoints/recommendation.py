from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from app.core.config import settings
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse, RecommendedItemResult
from app.algorithms.hybrid import HybridRecommender

router = APIRouter()
hybrid_engine = HybridRecommender()


@router.post(
    "/recommend/hybrid",
    response_model=RecommendationResponse,
    summary="Compute Hybrid Recommendations"
)
def compute_hybrid_recommendations(
    request: RecommendationRequest,
    x_internal_service_key: Optional[str] = Header(None, alias="X-Internal-Service-Key")
):
    # Optional internal token verification
    if x_internal_service_key and x_internal_service_key != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid internal service token")

    ranked = hybrid_engine.recommend(request)

    return RecommendationResponse(
        userId=request.user_id,
        strategyUsed="HYBRID_BLENDED",
        totalReturned=len(ranked),
        recommendations=[
            RecommendedItemResult(
                contentId=r["content_id"],
                score=r["score"],
                algorithm=r["algorithm"],
                rationale=r.get("rationale")
            )
            for r in ranked
        ]
    )
