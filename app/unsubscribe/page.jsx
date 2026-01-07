'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

export default function UnsubscribePage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No unsubscribe token provided');
            return;
        }

        // Process unsubscribe
        fetch(`/api/marketing/unsubscribe?token=${token}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Failed to unsubscribe');
                }
            })
            .catch(error => {
                setStatus('error');
                setMessage('An error occurred while processing your request');
                console.error('Unsubscribe error:', error);
            });
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full">
                {status === 'loading' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <h2 className="text-xl font-sora font-bold text-black dark:text-white mb-2">
                            Processing...
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Please wait while we unsubscribe you from marketing emails.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-sora font-bold text-black dark:text-white mb-4">
                            Successfully Unsubscribed
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {message || "You've been unsubscribed from our marketing emails."}
                        </p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                You will no longer receive promotional emails from us.
                                You may still receive transactional emails related to your account
                                (receipts, password resets, etc).
                            </p>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Changed your mind?{' '}
                            <a href="/dashboard/settings" className="text-blue-600 hover:underline">
                                Update your email preferences
                            </a>
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                        <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-sora font-bold text-black dark:text-white mb-4">
                            Unsubscribe Failed
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {message || "We couldn't process your unsubscribe request."}
                        </p>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                This could be because:
                            </p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1 text-left">
                                <li>• The link has already been used</li>
                                <li>• The link has expired (valid for 90 days)</li>
                                <li>• The link is invalid</li>
                            </ul>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Need help?{' '}
                            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                                Contact support
                            </a>
                        </p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        ← Return to homepage
                    </a>
                </div>
            </div>
        </div>
    );
}
