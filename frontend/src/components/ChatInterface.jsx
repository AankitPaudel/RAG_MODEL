// frontend/src/components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { AudioRecorder } from './AudioRecorder';
import { ResponsePlayer } from './ResponsePlayer';
import { LoadingIndicator } from './LoadingIndicator';
import { MessageList } from './MessageList';
import { TranscriptBubble } from './TranscriptBubble';
import { 
  Send, 
  Mic, 
  Settings, 
  HelpCircle, 
  Moon, 
  Sun, 
  Volume2 
} from 'lucide-react';
import { useTheme } from '../context/AppContext';

export const ChatInterface = () => {
    const { messages, sendMessage, isLoading } = useChat();
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, transcript]);

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            await sendMessage({ type: 'text', content: inputText });
            setInputText('');
        }
    };

    const handleTranscriptUpdate = (newTranscript) => {
        setTranscript(newTranscript);
    };

    const handleAudioSubmit = async (audioBlob, finalTranscript) => {
        setIsRecording(false);
        setTranscript('');
        await sendMessage({ 
            type: 'audio', 
            content: audioBlob,
            transcript: finalTranscript 
        });
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-72 md:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Virtual Teacher
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Your AI Learning Assistant
                        </p>
                    </div>
                    
                    <nav className="flex-1 p-4 space-y-2">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <HelpCircle className="w-5 h-5 mr-3" />
                            Help & FAQs
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                        </button>
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5 mr-3" />
                            ) : (
                                <Sun className="w-5 h-5 mr-3" />
                            )}
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {/* Messages Area */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto"
                >
                    <MessageList messages={messages} />
                    
                    {/* Live Transcript */}
                    {transcript && (
                        <TranscriptBubble transcript={transcript} />
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="max-w-4xl mx-auto">
                        <form 
                            onSubmit={handleTextSubmit}
                            className="flex items-end space-x-4"
                        >
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask me anything..."
                                    rows="1"
                                    disabled={isRecording}
                                    className="w-full p-4 text-base text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none disabled:opacity-50"
                                    style={{
                                        minHeight: '60px',
                                        maxHeight: '200px'
                                    }}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <AudioRecorder 
                                    onTranscriptUpdate={handleTranscriptUpdate}
                                    onRecordingComplete={handleAudioSubmit}
                                    onRecordingStart={() => setIsRecording(true)}
                                    silenceThreshold={3000}
                                />
                                
                                <button
                                    type="submit"
                                    disabled={isLoading || isRecording || !inputText.trim()}
                                    className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-2 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {isRecording ? 'Listening... (3s silence to auto-stop)' : 'Press Enter to send message'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;