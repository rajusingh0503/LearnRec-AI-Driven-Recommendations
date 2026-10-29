from typing import List, Dict
from app.schemas.content import ItemCandidate
from app.schemas.recommendation import UserPreferenceSchema


class ContentBasedRecommender:
    """
    Content-Based Recommendation Engine skeleton.
    Utilizes TF-IDF and Cosine Similarity over metadata soups.
    Full model training and similarity matrix precomputation implemented in Phase 3.
    """

    def rank_candidates(
        self,
        candidate_items: List[ItemCandidate],
        user_preferences: UserPreferenceSchema = None,
        interacted_item_ids: List[int] = None,
        top_k: int = 10
    ) -> List[Dict[str, any]]:
        if not candidate_items:
            return []

        # Baseline foundation ranking (will be replaced by full TF-IDF cosine matrix in Phase 3)
        ranked = []
        for item in candidate_items:
            # Baseline score based on ratings or preference match
            score = round(float(item.rating_avg / 5.0), 4)
            ranked.append({
                "content_id": item.id,
                "score": score,
                "algorithm": "CONTENT_BASED",
                "rationale": f"High rating ({item.rating_avg}) in category {item.category_name}"
            })

        ranked.sort(key=lambda x: x["score"], reverse=True)
        return ranked[:top_k]
