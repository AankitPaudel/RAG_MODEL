# File: backend/api/routes/qa.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.dependencies import get_db
from qa.pipeline import QAPipeline
from api.schemas.responses import QuestionResponse

router = APIRouter()
qa_pipeline = QAPipeline()

@router.post("/ask", response_model=QuestionResponse)
async def ask_question(
    question: str,
    db: Session = Depends(get_db),
    chat_history: Optional[list] = None
):
    """Process question and return answer"""
    try:
        response = await qa_pipeline.get_answer(question, chat_history)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
