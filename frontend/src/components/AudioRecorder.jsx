// frontend/src/components/AudioRecorder.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';

export const AudioRecorder = ({
    onTranscriptUpdate,
    onRecordingComplete,
    onRecordingStart,
    silenceThreshold = 3000
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    
    const mediaRecorder = useRef(null);
    const recognitionRef = useRef(null);
    const audioChunks = useRef([]);
    const audioContext = useRef(null);
    const analyzerNode = useRef(null);
    const lastAudioTime = useRef(Date.now());
    const silenceTimeoutRef = useRef(null);

    useEffect(() => {
        // Cleanup function
        return () => {
            stopRecording();
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, []);

    const initializeRecognition = () => {
        if (!recognitionRef.current && 'webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            
            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                onTranscriptUpdate?.(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Recognition error:', event.error);
                if (event.error === 'no-speech') {
                    stopRecording();
                }
            };

            recognitionRef.current.onend = () => {
                // Only restart if we're still supposed to be recording
                if (isRecording) {
                    recognitionRef.current?.start();
                }
            };
        }
    };

    const checkAudioLevel = () => {
        if (!analyzerNode.current || !isRecording) return;

        const dataArray = new Uint8Array(analyzerNode.current.frequencyBinCount);
        analyzerNode.current.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedLevel = average / 128;
        
        setAudioLevel(normalizedLevel);

        if (normalizedLevel > 0.1) {
            lastAudioTime.current = Date.now();
        } else {
            const timeSinceLastAudio = Date.now() - lastAudioTime.current;
            if (timeSinceLastAudio >= silenceThreshold) {
                stopRecording();
                return;
            }
        }

        if (isRecording) {
            requestAnimationFrame(checkAudioLevel);
        }
    };

    const startRecording = async () => {
        try {
            setIsInitializing(true);

            // Initialize audio context
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            analyzerNode.current = audioContext.current.createAnalyser();
            analyzerNode.current.fftSize = 256;

            // Get media stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = audioContext.current.createMediaStreamSource(stream);
            source.connect(analyzerNode.current);

            // Initialize media recorder
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                onRecordingComplete?.(audioBlob);
            };

            // Initialize speech recognition
            initializeRecognition();

            // Start recording
            mediaRecorder.current.start();
            recognitionRef.current?.start();
            setIsRecording(true);
            onRecordingStart?.();
            
            // Start monitoring audio levels
            requestAnimationFrame(checkAudioLevel);
            
        } catch (error) {
            console.error('Error starting recording:', error);
        } finally {
            setIsInitializing(false);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder.current?.state === 'recording') {
            mediaRecorder.current.stop();
            
            // Get final transcript
            const finalTranscript = recognitionRef.current?.resultText || '';
            
            // Create audio blob and pass both audio and transcript
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            onRecordingComplete(audioBlob, finalTranscript);
            
            // Reset states
            setIsRecording(false);
            setAudioLevel(0);
            
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (audioContext.current) {
                audioContext.current.close();
            }
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
        }
    };


    const stopRecording = () => {
        try {
            if (mediaRecorder.current?.state === 'recording') {
                mediaRecorder.current.stop();
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (audioContext.current) {
                audioContext.current.close();
            }

            setIsRecording(false);
            setAudioLevel(0);
            
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    const handleRecordButtonClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="relative inline-flex items-center">
            <button
                onClick={handleRecordButtonClick}
                disabled={isInitializing}
                className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50
                    ${isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                    }`}
            >
                {isInitializing ? (
                    <Loader className="w-5 h-5 animate-spin" />
                ) : isRecording ? (
                    <MicOff className="w-5 h-5" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </button>
            
            {isRecording && (
                <div className="absolute left-full ml-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-200 ${
                                    i < Math.floor(audioLevel * 5) 
                                        ? 'bg-blue-500' 
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                style={{
                                    height: `${8 + (i * 4)}px`
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;