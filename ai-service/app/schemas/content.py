from typing import List, Optional
from pydantic import BaseModel, Field


class ItemCandidate(BaseModel):
    id: int
    title: str
    description: str
    content_type: str = Field(..., alias="contentType")
    difficulty_level: str = Field(..., alias="difficultyLevel")
    category_id: int = Field(..., alias="categoryId")
    category_name: str = Field(..., alias="categoryName")
    tags: List[str] = []
    author_or_instructor: Optional[str] = Field(None, alias="authorOrInstructor")
    rating_avg: float = Field(0.0, alias="ratingAvg")

    class Config:
        populate_by_name = True


class InteractionRecord(BaseModel):
    content_id: int = Field(..., alias="contentId")
    interaction_type: str = Field(..., alias="interactionType")
    weight: float = 1.0

    class Config:
        populate_by_name = True
