'use client';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid md:grid-cols-3 gap-8 mb-6">
                    {/* Company Info */}
                    <div>
                        <h3 className="font-sora font-bold text-black dark:text-white mb-3">
                            Operon
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Business automation platform for modern teams.
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-black dark:text-white mb-3 text-sm">
                            Legal
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="/privacy"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/cookies"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Cookie Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/dashboard/privacy"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Your Privacy Rights
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="font-semibold text-black dark:text-white mb-3 text-sm">
                            Support
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="/dashboard/user-guide"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    User Guide
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@example.com"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    <p>
                        © {currentYear} Operon. All rights reserved.
                    </p>
                    <p className="text-xs">
                        Compliant with GDPR, UK DPA 2018, and PECR
                    </p>
                </div>

                {/* Cookie Settings Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem('cookie_consent');
                            window.location.reload();
                        }}
                        className="text-xs text-gray-500 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 underline transition-colors"
                    >
                        Cookie Settings
                    </button>
                </div>
            </div>
        </footer>
    );
}
