'use client';
import { useState, useEffect } from 'react';
import { Download, Trash2, Edit, Shield, Lock, FileText } from 'lucide-react';

export default function PrivacyDashboard() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [exportLoading, setExportLoading] = useState(false);

    const handleDataExport = async () => {
        setExportLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/privacy/export', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to export data');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data');
        } finally {
            setExportLoading(false);
        }
    };

    const handleAccountDeletion = async () => {
        if (deleteConfirmation !== 'DELETE') {
            alert('Please type DELETE to confirm account deletion');
            return;
        }

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/privacy/delete-account', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert('Your account has been scheduled for deletion. You have 30 days to cancel this request.');
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete account');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-sora font-bold text-black dark:text-white mb-4">
                Privacy & Data Rights
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Manage your personal data and exercise your rights under GDPR
            </p>

            {/* Rights Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <Shield className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                        Your Data Rights
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Under GDPR and UK DPA 2018, you have the right to access, correct, delete, or export your personal data at any time.
                    </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                    <Lock className="h-8 w-8 text-green-600 mb-3" />
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                        Data Protection
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your data is encrypted at rest and in transit. We use Row Level Security and bcrypt password hashing for maximum protection.
                    </p>
                </div>
            </div>

            {/* Export Data */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                    <Download className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                            Download Your Data
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Exercise your <strong>Right to Access (GDPR Article 15)</strong> and <strong>Right to Data Portability (Article 20)</strong>.
                            Download a complete copy of your personal data in JSON format.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                            Includes: Account information, activity logs, chat conversations, email data, and integration settings.
                        </p>
                        <button
                            onClick={handleDataExport}
                            disabled={exportLoading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-plus-jakarta font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {exportLoading ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Export My Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Correct Data */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                    <Edit className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                            Correct Your Data
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Exercise your <strong>Right to Rectification (GDPR Article 16)</strong>. Update inaccurate or incomplete personal information.
                        </p>
                        <a
                            href="/dashboard/settings"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-plus-jakarta font-semibold hover:bg-green-700 transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Update Profile
                        </a>
                    </div>
                </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                    <FileText className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                            Privacy Policy & Legal
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Review how we collect, use, and protect your personal data.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="/privacy"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-plus-jakarta font-semibold hover:bg-purple-700 transition-colors text-sm"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="/cookies"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg font-plus-jakarta font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <Trash2 className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                            Delete My Account
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                            Exercise your <strong>Right to Erasure / "Right to be Forgotten" (GDPR Article 17)</strong>.
                            Permanently delete your account and all associated data.
                        </p>

                        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-4">
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Warning: This action is irreversible</p>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                                <li>• All your data will be permanently deleted after 30 days</li>
                                <li>• You will be immediately logged out</li>
                                <li>• You can cancel within 30 days by contacting support</li>
                                <li>• Some data may be retained for legal compliance (e.g., financial records for 7 years)</li>
                            </ul>
                        </div>

                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Type "DELETE" to confirm:
                        </label>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Type DELETE"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-800 text-black dark:text-white"
                        />

                        <button
                            onClick={handleAccountDeletion}
                            disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-plus-jakarta font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting Account...' : 'Permanently Delete My Account'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Need help?</strong> Contact our Data Protection Officer at{' '}
                    <a href="mailto:privacy@example.com" className="text-blue-600 underline">
                        privacy@example.com
                    </a>
                    {' '}or lodge a complaint with the{' '}
                    <a href="https://ico.org.uk" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                        Information Commissioner's Office (ICO)
                    </a>.
                </p>
            </div>
        </div>
    );
}
