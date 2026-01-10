'use client';

import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function VoiceInputButton({
    isListening,
    onStart,
    onStop,
    disabled = false,
    isSupported = true
}) {
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isListening) {
                onStop();
            }
        };
    }, [isListening, onStop]);

    const handleClick = () => {
        if (isListening) {
            onStop();
        } else {
            onStart();
        }
    };

    if (!isSupported) {
        return (
            <button
                type="button"
                disabled
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                title="Voice input not supported in this browser"
            >
                <MicOff className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`p-3 rounded-xl font-plus-jakarta font-semibold transition-all ${isListening
                    ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
            aria-label={isListening ? 'Stop recording' : 'Start voice input'}
        >
            {isListening ? (
                <Mic className="h-5 w-5" />
            ) : (
                <Mic className="h-5 w-5" />
            )}
        </button>
    );
}
