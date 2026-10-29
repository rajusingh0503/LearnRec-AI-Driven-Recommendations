from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from app.schemas.content import ItemCandidate, InteractionRecord


class UserPreferenceSchema(BaseModel):
    preferred_categories: List[str] = Field(default=[], alias="preferredCategories")
    preferred_content_types: List[str] = Field(default=[], alias="preferredContentTypes")
    preferred_difficulty: str = Field(default="BEGINNER", alias="preferredDifficulty")

    class Config:
        populate_by_name = True


class RecommendationRequest(BaseModel):
    user_id: int = Field(..., alias="userId")
    top_k: int = Field(10, alias="topK")
    weights: Optional[Dict[str, float]] = Field(
        default={"contentWeight": 0.60, "collaborativeWeight": 0.40}
    )
    user_preferences: Optional[UserPreferenceSchema] = Field(None, alias="userPreferences")
    user_interactions: List[InteractionRecord] = Field(default=[], alias="userInteractions")
    candidate_items: List[ItemCandidate] = Field(..., alias="candidateItems")

    class Config:
        populate_by_name = True


class RecommendedItemResult(BaseModel):
    content_id: int = Field(..., alias="contentId")
    score: float
    algorithm: str
    rationale: Optional[str] = None

    class Config:
        populate_by_name = True


class RecommendationResponse(BaseModel):
    user_id: int = Field(..., alias="userId")
    strategy_used: str = Field(..., alias="strategyUsed")
    total_returned: int = Field(..., alias="totalReturned")
    recommendations: List[RecommendedItemResult]

    class Config:
        populate_by_name = True
