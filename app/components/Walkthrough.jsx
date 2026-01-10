'use client';

import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useWalkthrough } from './WalkthroughProvider';

export default function Walkthrough() {
    const {
        activeWalkthrough,
        currentStep,
        isVisible,
        nextStep,
        previousStep,
        skipWalkthrough,
        completeWalkthrough
    } = useWalkthrough();

    const [targetRect, setTargetRect] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const tooltipRef = useRef(null);

    useEffect(() => {
        if (!activeWalkthrough || !isVisible) {
            setTargetRect(null);
            return;
        }

        const step = activeWalkthrough.steps[currentStep];
        if (!step) return;

        // If step has a target selector, highlight it
        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                });

                // Calculate tooltip position based on placement
                calculateTooltipPosition(rect, step.placement);

                // Scroll element into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setTargetRect(null);
            // Center tooltip for center placement
            if (tooltipRef.current) {
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                setTooltipPosition({
                    x: (window.innerWidth - tooltipRect.width) / 2,
                    y: (window.innerHeight - tooltipRect.height) / 2
                });
            }
        }
    }, [activeWalkthrough, currentStep, isVisible]);

    const calculateTooltipPosition = (rect, placement) => {
        const padding = 20;
        const tooltipWidth = 400;
        const tooltipHeight = 200; // Approximate

        let x = 0;
        let y = 0;

        switch (placement) {
            case 'top':
                x = rect.left + rect.width / 2 - tooltipWidth / 2;
                y = rect.top - tooltipHeight - padding;
                break;
            case 'bottom':
                x = rect.left + rect.width / 2 - tooltipWidth / 2;
                y = rect.bottom + padding;
                break;
            case 'left':
                x = rect.left - tooltipWidth - padding;
                y = rect.top + rect.height / 2 - tooltipHeight / 2;
                break;
            case 'right':
                x = rect.right + padding;
                y = rect.top + rect.height / 2 - tooltipHeight / 2;
                break;
            default:
                x = (window.innerWidth - tooltipWidth) / 2;
                y = (window.innerHeight - tooltipHeight) / 2;
        }

        // Keep tooltip within viewport bounds
        x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
        y = Math.max(padding, Math.min(y, window.innerHeight - tooltipHeight - padding));

        setTooltipPosition({ x, y });
    };

    if (!activeWalkthrough || !isVisible) {
        return null;
    }

    const step = activeWalkthrough.steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === activeWalkthrough.steps.length - 1;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[9998] transition-opacity duration-300"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    opacity: isVisible ? 1 : 0
                }}
            />

            {/* Spotlight on target element */}
            {targetRect && (
                <div
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        top: `${targetRect.top}px`,
                        left: `${targetRect.left}px`,
                        width: `${targetRect.width}px`,
                        height: `${targetRect.height}px`,
                        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.7)',
                        borderRadius: '8px',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                />
            )}

            {/* Walkthrough Tooltip */}
            <div
                ref={tooltipRef}
                className="fixed z-[10000] bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
                style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    maxWidth: '400px',
                    minWidth: '320px',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'scale(1)' : 'scale(0.95)'
                }}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                                Step {currentStep + 1} of {activeWalkthrough.steps.length}
                            </span>
                        </div>
                        <h3 className="text-xl font-sora font-bold text-black dark:text-white">
                            {step.title}
                        </h3>
                    </div>
                    {step.showSkip && (
                        <button
                            onClick={skipWalkthrough}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Skip walkthrough"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    <p className="text-gray-700 dark:text-gray-300 font-inter leading-relaxed">
                        {step.content}
                    </p>
                </div>

                {/* Footer with navigation */}
                <div className="flex items-center justify-between p-6 pt-0">
                    <button
                        onClick={previousStep}
                        disabled={isFirstStep}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-plus-jakarta font-semibold transition-all ${isFirstStep
                                ? 'opacity-0 pointer-events-none'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <button
                        onClick={isLastStep ? completeWalkthrough : nextStep}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-plus-jakarta font-semibold hover:scale-[0.98] transition-transform"
                    >
                        {isLastStep ? (
                            <>
                                <Check className="h-4 w-4" />
                                Finish
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
            `}</style>
        </>
    );
}
