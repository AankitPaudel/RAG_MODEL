# File: backend/app/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "sqlite:///./virtual_teacher.db"
    
    # OpenAI settings
    OPENAI_API_KEY: str
    
    # Vector store settings
    VECTOR_STORE_PATH: str = "./data/vector_store"
    
    # Audio settings
    AUDIO_TEMP_DIR: str = "./data/audio"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()