// File: frontend/src/hooks/useChat.js
import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async ({ type, content }) => {
        try {
            setIsLoading(true);
            setError(null);

            let response;
            if (type === 'audio') {
                const textResult = await api.sendAudio(content);
                response = await api.sendQuestion(textResult.text);
            } else {
                response = await api.sendQuestion(content);
            }

            setMessages(prev => [
                ...prev,
                { sender: 'user', text: type === 'text' ? content : response.question },
                { 
                    sender: 'assistant', 
                    text: response.answer,
                    audioUrl: response.audio_url 
                }
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { messages, isLoading, error, sendMessage };
};