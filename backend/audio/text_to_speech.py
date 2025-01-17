# File: backend/audio/text_to_speech.py
from gtts import gTTS
import tempfile
import os
from pathlib import Path

class TextToSpeech:
    def __init__(self):
        self.temp_dir = Path("data/audio")
        self.temp_dir.mkdir(parents=True, exist_ok=True)

    async def convert(self, text: str) -> Path:
        """Convert text to speech using gTTS"""
        try:
            # Create temporary file
            temp_file = self.temp_dir / f"{hash(text)}.mp3"
            
            # Generate speech
            tts = gTTS(text=text, lang='en')
            tts.save(str(temp_file))
            
            return temp_file
        except Exception as e:
            raise Exception(f"Text to speech conversion failed: {str(e)}")

    def cleanup_old_files(self, max_age_hours: int = 1):
        """Clean up old temporary audio files"""
        import time
        current_time = time.time()
        
        for file in self.temp_dir.glob("*.mp3"):
            if (current_time - file.stat().st_mtime) > (max_age_hours * 3600):
                file.unlink()