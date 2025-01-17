// File: frontend/src/components/ChatInterface.jsx
import React, { useState, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { AudioRecorder } from './AudioRecorder';
import { ResponsePlayer } from './ResponsePlayer';
import { LoadingIndicator } from './LoadingIndicator';

export const ChatInterface = () => {
    const { messages, sendMessage, isLoading } = useChat();
    const [inputText, setInputText] = useState('');
    const chatContainerRef = useRef(null);

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            await sendMessage({ type: 'text', content: inputText });
            setInputText('');
        }
    };

    const handleAudioSubmit = async (audioBlob) => {
        await sendMessage({ type: 'audio', content: audioBlob });
    };

    return (
        <div className="chat-container" ref={chatContainerRef}>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        <div className="message-content">{message.text}</div>
                        {message.audioUrl && (
                            <ResponsePlayer audioUrl={message.audioUrl} />
                        )}
                    </div>
                ))}
                {isLoading && <LoadingIndicator />}
            </div>
            
            <div className="input-container">
                <form onSubmit={handleTextSubmit}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your question..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        Send
                    </button>
                </form>
                <AudioRecorder onRecordingComplete={handleAudioSubmit} />
            </div>
        </div>
    );
};

