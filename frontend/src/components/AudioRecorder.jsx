// File: frontend/src/components/AudioRecorder.jsx
import React, { useState, useRef } from 'react';

export const AudioRecorder = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                onRecordingComplete(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="audio-recorder">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`record-button ${isRecording ? 'recording' : ''}`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
};

