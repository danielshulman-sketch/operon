'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isSupported, setIsSupported] = useState(false);

    const utteranceRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);

            // Load voices
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);

                // Set default voice (prefer English)
                const defaultVoice = availableVoices.find(voice =>
                    voice.lang.startsWith('en')
                ) || availableVoices[0];

                setSelectedVoice(defaultVoice);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = useCallback((text, options = {}) => {
        if (!isSupported) {
            console.error('Text-to-speech not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Set voice
        if (options.voice || selectedVoice) {
            utterance.voice = options.voice || selectedVoice;
        }

        // Set options
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        // Event handlers
        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            utteranceRef.current = null;
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [isSupported, selectedVoice]);

    const pause = useCallback(() => {
        if (isSpeaking && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    }, [isSpeaking, isPaused]);

    const resume = useCallback(() => {
        if (isSpeaking && isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    }, [isSpeaking, isPaused]);

    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
    }, []);

    return {
        speak,
        pause,
        resume,
        cancel,
        isSpeaking,
        isPaused,
        voices,
        selectedVoice,
        setSelectedVoice,
        isSupported
    };
}
