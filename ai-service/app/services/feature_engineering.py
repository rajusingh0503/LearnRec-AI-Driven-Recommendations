import re
from typing import List
from app.schemas.content import ItemCandidate


class FeatureEngineeringService:
    @staticmethod
    def clean_text(text: str) -> str:
        if not text:
            return ""
        # Lowercase, strip non-alphanumeric characters, and normalize spaces
        text = text.lower()
        text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
        return " ".join(text.split())

    @classmethod
    def create_content_soup(cls, item: ItemCandidate) -> str:
        """
        Combines title, category, tags, difficulty, and description
        into a weighted text document for vectorization.
        """
        tags_str = " ".join([cls.clean_text(t) for t in item.tags])
        soup_parts = [
            cls.clean_text(item.title) * 2,  # Title given higher weight
            cls.clean_text(item.category_name) * 2,
            tags_str * 2,
            cls.clean_text(item.difficulty_level),
            cls.clean_text(item.content_type),
            cls.clean_text(item.description)
        ]
        return " ".join([part for part in soup_parts if part])
