# File: backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from api.routes import audio, qa, lectures

app = FastAPI(title="Virtual Teacher API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(audio.router, prefix="/api/audio", tags=["audio"])
app.include_router(qa.router, prefix="/api/qa", tags=["qa"])
app.include_router(lectures.router, prefix="/api/lectures", tags=["lectures"])
