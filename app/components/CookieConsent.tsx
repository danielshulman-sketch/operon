'use client';
import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';

interface CookieConsent {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
}

export default function CookieConsentBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState<CookieConsent>({
        necessary: true, // Always true
        functional: false,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // Check if consent has already been given
        const savedConsent = localStorage.getItem('cookie_consent');
        if (!savedConsent) {
            setShowBanner(true);
        } else {
            setConsent(JSON.parse(savedConsent));
        }
    }, []);

    const saveConsent = (consentData: CookieConsent) => {
        localStorage.setItem('cookie_consent', JSON.stringify(consentData));
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        setShowBanner(false);
        setShowSettings(false);
    };

    const acceptAll = () => {
        const fullConsent = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
        };
        setConsent(fullConsent);
        saveConsent(fullConsent);
    };

    const rejectNonEssential = () => {
        const essentialOnly = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
        };
        setConsent(essentialOnly);
        saveConsent(essentialOnly);
    };

    const saveCustom = () => {
        saveConsent(consent);
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Cookie Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t-4 border-blue-600 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-start gap-4">
                        <Cookie className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

                        <div className="flex-1">
                            <h3 className="text-xl font-sora font-bold text-black dark:text-white mb-2">
                                We Use Cookies
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                We use cookies to provide you with the best experience, keep you logged in, and understand how you use our platform.
                                By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or reject non-essential cookies.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Read our{' '}
                                <a href="/cookies" className="text-blue-600 underline hover:text-blue-700">
                                    Cookie Policy
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-blue-600 underline hover:text-blue-700">
                                    Privacy Policy
                                </a>
                                .
                            </p>
                        </div>

                        <button
                            onClick={() => setShowBanner(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Close banner"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                        <button
                            onClick={acceptAll}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-plus-jakarta font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={rejectNonEssential}
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-xl font-plus-jakarta font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Reject Non-Essential
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-xl font-plus-jakarta font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <Settings className="h-4 w-4" />
                            Cookie Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Cookie Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-2xl font-sora font-bold text-black dark:text-white">
                                Cookie Preferences
                            </h2>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Strictly Necessary */}
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                                            Strictly Necessary Cookies
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            These cookies are essential for the website to function and cannot be disabled. They enable core functionality like security, authentication, and login.
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-semibold">
                                            Always Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Functional */}
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                                            Functional Cookies
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            These cookies allow us to remember your preferences and provide enhanced, personalized features.
                                        </p>
                                    </div>
                                    <label className="ml-4 relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={consent.functional}
                                            onChange={(e) => setConsent({ ...consent, functional: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                                            Analytics Cookies
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                        </p>
                                    </div>
                                    <label className="ml-4 relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={consent.analytics}
                                            onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Marketing */}
                            <div className="pb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                                            Marketing Cookies
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            These cookies track your activity to help deliver advertisements that are more relevant to you and your interests.
                                        </p>
                                    </div>
                                    <label className="ml-4 relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={consent.marketing}
                                            onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                            <button
                                onClick={saveCustom}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-plus-jakarta font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Save Preferences
                            </button>
                            <button
                                onClick={acceptAll}
                                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-xl font-plus-jakarta font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
