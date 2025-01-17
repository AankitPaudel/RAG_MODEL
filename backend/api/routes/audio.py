# File: backend/api/routes/audio.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from audio.speech_to_text import SpeechToText
from audio.text_to_speech import TextToSpeech

router = APIRouter()
speech_to_text = SpeechToText()
text_to_speech = TextToSpeech()

@router.post("/speech-to-text")
async def convert_speech_to_text(audio: UploadFile = File(...)):
    """Convert speech to text"""
    temp_file = Path(f"data/audio/temp_{audio.filename}")
    try:
        # Save uploaded file
        with temp_file.open("wb") as f:
            f.write(await audio.read())
        
        # Convert to text
        text = await speech_to_text.convert(temp_file)
        
        return {"text": text}
    finally:
        if temp_file.exists():
            temp_file.unlink()

@router.post("/text-to-speech")
async def convert_text_to_speech(text: str):
    """Convert text to speech"""
    try:
        audio_file = await text_to_speech.convert(text)
        return FileResponse(
            path=audio_file,
            media_type="audio/mpeg",
            filename="response.mp3"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


