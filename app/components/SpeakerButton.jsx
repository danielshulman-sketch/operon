'use client';

import { Volume2, VolumeX, Pause } from 'lucide-react';

export default function SpeakerButton({
    isSpeaking,
    isPaused,
    onSpeak,
    onPause,
    onResume,
    onStop,
    disabled = false,
    isSupported = true
}) {
    const handleClick = () => {
        if (!isSpeaking) {
            onSpeak();
        } else if (isPaused) {
            onResume();
        } else {
            onPause();
        }
    };

    if (!isSupported) {
        return (
            <button
                type="button"
                disabled
                className="p-2 rounded-lg text-gray-400 cursor-not-allowed"
                title="Text-to-speech not supported"
            >
                <VolumeX className="h-4 w-4" />
            </button>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className={`p-2 rounded-lg transition-colors ${isSpeaking && !isPaused
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={
                    !isSpeaking
                        ? 'Read message aloud'
                        : isPaused
                            ? 'Resume'
                            : 'Pause'
                }
                aria-label={
                    !isSpeaking
                        ? 'Read message aloud'
                        : isPaused
                            ? 'Resume'
                            : 'Pause'
                }
            >
                {!isSpeaking ? (
                    <Volume2 className="h-4 w-4" />
                ) : isPaused ? (
                    <Volume2 className="h-4 w-4" />
                ) : (
                    <Pause className="h-4 w-4" />
                )}
            </button>

            {isSpeaking && (
                <button
                    type="button"
                    onClick={onStop}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Stop"
                    aria-label="Stop reading"
                >
                    <VolumeX className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
