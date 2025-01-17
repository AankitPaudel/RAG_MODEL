// File: frontend/src/components/LoadingIndicator.jsx
import React from 'react';

export const LoadingIndicator = () => {
    return (
        <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Processing...</span>
        </div>
    );
};