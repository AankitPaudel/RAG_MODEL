// File: frontend/src/components/ResponsePlayer.jsx
import React, { useState, useRef } from 'react';

export const ResponsePlayer = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />
            <button 
                onClick={togglePlay}
                className={`play-button ${isPlaying ? 'playing' : ''}`}
            >
                {isPlaying ? 'Pause' : 'Play'} Response
            </button>
        </div>
    );
};

