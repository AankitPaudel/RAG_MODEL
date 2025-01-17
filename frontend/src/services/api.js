// File: frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    async sendQuestion(text) {
        const response = await fetch(`${API_BASE_URL}/qa/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: text }),
        });
        return response.json();
    },

    async sendAudio(audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob);

        const response = await fetch(`${API_BASE_URL}/audio/speech-to-text`, {
            method: 'POST',
            body: formData,
        });
        return response.json();
    },
};






