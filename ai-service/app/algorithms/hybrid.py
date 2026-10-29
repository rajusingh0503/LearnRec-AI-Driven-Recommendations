from typing import List, Dict
from app.algorithms.content_based import ContentBasedRecommender
from app.algorithms.collaborative import CollaborativeRecommender
from app.schemas.recommendation import RecommendationRequest


class HybridRecommender:
    """
    Hybrid Recommendation Engine blending Content-Based and Collaborative Filtering
    with cold-start handling and diversity re-ranking.
    """

    def __init__(self):
        self.cb_engine = ContentBasedRecommender()
        self.cf_engine = CollaborativeRecommender()

    def recommend(self, request: RecommendationRequest) -> List[Dict[str, any]]:
        weights = request.weights or {"contentWeight": 0.60, "collaborativeWeight": 0.40}
        w_cb = float(weights.get("contentWeight", 0.60))
        w_cf = float(weights.get("collaborativeWeight", 0.40))

        # Check cold-start condition
        has_history = len(request.user_interactions) > 0
        if not has_history:
            # Full content-based fallback for cold start
            w_cb = 1.0
            w_cf = 0.0

        cb_results = {
            r["content_id"]: r["score"]
            for r in self.cb_engine.rank_candidates(
                request.candidate_items,
                request.user_preferences,
                top_k=len(request.candidate_items)
            )
        }

        cf_results = {
            r["content_id"]: r["score"]
            for r in self.cf_engine.rank_candidates(
                request.user_id,
                request.user_interactions,
                request.candidate_items,
                top_k=len(request.candidate_items)
            )
        }

        # Weighted score combination
        final_scores = []
        for item in request.candidate_items:
            s_cb = cb_results.get(item.id, 0.0)
            s_cf = cf_results.get(item.id, 0.0)
            hybrid_score = round((w_cb * s_cb) + (w_cf * s_cf), 4)

            strategy = "HYBRID" if has_history else "COLD_START_CONTENT"
            final_scores.append({
                "content_id": item.id,
                "score": hybrid_score,
                "algorithm": strategy,
                "rationale": f"Hybrid score: CB({round(s_cb, 2)}) * {w_cb} + CF({round(s_cf, 2)}) * {w_cf}"
            })

        final_scores.sort(key=lambda x: x["score"], reverse=True)
        return final_scores[: request.top_k]
