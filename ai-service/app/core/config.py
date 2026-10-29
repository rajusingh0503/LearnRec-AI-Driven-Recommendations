from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "LearnRec AI Recommendation Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Internal Security Token (matches Spring Boot app.ai-service.internal-key)
    INTERNAL_API_KEY: str = "learnrec-internal-secret-token"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173"
    ]
    
    # Model Hyperparameters defaults
    DEFAULT_CONTENT_WEIGHT: float = 0.60
    DEFAULT_COLLAB_WEIGHT: float = 0.40
    SVD_N_COMPONENTS: int = 15

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
