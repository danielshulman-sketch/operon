'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const WalkthroughContext = createContext();

export function WalkthroughProvider({ children }) {
    const [activeWalkthrough, setActiveWalkthrough] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [completedWalkthroughs, setCompletedWalkthroughs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    // Load completed walkthroughs from localStorage
    useEffect(() => {
        const completed = localStorage.getItem('operon_completed_walkthroughs');
        if (completed) {
            try {
                setCompletedWalkthroughs(JSON.parse(completed));
            } catch (error) {
                console.error('Failed to parse completed walkthroughs:', error);
            }
        }

        // Check if this is first login
        const hasSeenIntro = localStorage.getItem('operon_has_seen_intro');
        if (!hasSeenIntro) {
            // Will trigger first login walkthrough
            localStorage.setItem('operon_needs_intro', 'true');
        }
    }, []);

    const startWalkthrough = (walkthrough) => {
        if (!walkthrough) return;

        setActiveWalkthrough(walkthrough);
        setCurrentStep(0);
        setIsVisible(true);
    };

    const nextStep = () => {
        if (!activeWalkthrough) return;

        if (currentStep < activeWalkthrough.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeWalkthrough();
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const skipWalkthrough = () => {
        if (activeWalkthrough) {
            markAsCompleted(activeWalkthrough.id);
        }
        closeWalkthrough();
    };

    const completeWalkthrough = () => {
        if (activeWalkthrough) {
            markAsCompleted(activeWalkthrough.id);
        }
        closeWalkthrough();
    };

    const closeWalkthrough = () => {
        setIsVisible(false);
        setTimeout(() => {
            setActiveWalkthrough(null);
            setCurrentStep(0);
        }, 300); // Wait for fade out animation
    };

    const markAsCompleted = (walkthroughId) => {
        const updated = [...completedWalkthroughs, walkthroughId];
        setCompletedWalkthroughs(updated);
        localStorage.setItem('operon_completed_walkthroughs', JSON.stringify(updated));

        // Mark intro as seen if it was the first login walkthrough
        if (walkthroughId === 'first-login') {
            localStorage.setItem('operon_has_seen_intro', 'true');
            localStorage.removeItem('operon_needs_intro');
        }
    };

    const isWalkthroughCompleted = (walkthroughId) => {
        return completedWalkthroughs.includes(walkthroughId);
    };

    const resetWalkthrough = (walkthroughId) => {
        const updated = completedWalkthroughs.filter(id => id !== walkthroughId);
        setCompletedWalkthroughs(updated);
        localStorage.setItem('operon_completed_walkthroughs', JSON.stringify(updated));
    };

    const resetAllWalkthroughs = () => {
        setCompletedWalkthroughs([]);
        localStorage.removeItem('operon_completed_walkthroughs');
        localStorage.removeItem('operon_has_seen_intro');
    };

    const value = {
        activeWalkthrough,
        currentStep,
        isVisible,
        completedWalkthroughs,
        startWalkthrough,
        nextStep,
        previousStep,
        skipWalkthrough,
        completeWalkthrough,
        closeWalkthrough,
        isWalkthroughCompleted,
        resetWalkthrough,
        resetAllWalkthroughs
    };

    return (
        <WalkthroughContext.Provider value={value}>
            {children}
        </WalkthroughContext.Provider>
    );
}

export function useWalkthrough() {
    const context = useContext(WalkthroughContext);
    if (!context) {
        throw new Error('useWalkthrough must be used within WalkthroughProvider');
    }
    return context;
}

export default WalkthroughContext;
