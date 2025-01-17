# File: backend/audio/speech_to_text.py
from faster_whisper import WhisperModel
from pathlib import Path
import tempfile
import os

class SpeechToText:
    def __init__(self):
        self.model = WhisperModel("base")

    async def convert(self, audio_file: Path) -> str:
        """Convert speech to text using Whisper"""
        try:
            # Transcribe audio
            segments, _ = self.model.transcribe(str(audio_file))
            text = " ".join([segment.text for segment in segments])
            return text.strip()
        except Exception as e:
            raise Exception(f"Speech to text conversion failed: {str(e)}")

