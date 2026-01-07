'use client';

export default function CookiePolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-sora font-bold text-black dark:text-white mb-8">
                Cookie Policy
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB')}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">What Are Cookies?</h2>
                    <p>
                        Cookies are small text files stored on your device when you visit a website. They help us provide you with a better experience
                        by remembering your preferences and enabling essential functionality.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">How We Use Cookies</h2>
                    <p>
                        We use cookies to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Keep you signed in to your account</li>
                        <li>Remember your preferences and settings</li>
                        <li>Understand how you use our platform</li>
                        <li>Improve our services</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">Types of Cookies We Use</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Cookie Name</th>
                                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Type</th>
                                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><code>auth_token</code></td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Strictly Necessary</td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Keeps you logged in</td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">7 days</td>
                                </tr>
                                <tr className="bg-gray-50 dark:bg-gray-900">
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><code>oauth_state</code></td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Strictly Necessary</td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Secure OAuth authentication</td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">10 minutes</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><code>cookie_consent</code></td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Strictly Necessary</td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Remembers your cookie preferences</td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Cookie Categories</h3>

                    <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-bold text-green-800 dark:text-green-300">✅ Strictly Necessary Cookies</h4>
                            <p className="text-sm mt-2">
                                These cookies are essential for the website to function. They cannot be disabled as they enable core functionality
                                like security, authentication, and basic site operations.
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300">🔧 Functional Cookies</h4>
                            <p className="text-sm mt-2">
                                These cookies allow us to remember your preferences and provide enhanced features.
                                <strong> Not currently used.</strong>
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-300">📊 Analytics Cookies</h4>
                            <p className="text-sm mt-2">
                                These cookies help us understand how visitors interact with our website.
                                <strong> Not currently used.</strong>
                            </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-bold text-purple-800 dark:text-purple-300">🎯 Marketing Cookies</h4>
                            <p className="text-sm mt-2">
                                These cookies track your activity to deliver personalized advertisements.
                                <strong> Not currently used.</strong>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">Managing Cookies</h2>

                    <h3 className="text-xl font-semibold mt-6 mb-3">In This Website</h3>
                    <p>
                        You can manage your cookie preferences at any time by clicking the "Cookie Settings" button in the footer of any page.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">In Your Browser</h3>
                    <p>Most web browsers allow you to control cookies through their settings:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                        <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                        <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                    </ul>
                    <p className="mt-4 text-yellow-600 dark:text-yellow-400">
                        ⚠️ <strong>Warning:</strong> Disabling necessary cookies may prevent you from using certain features of our platform,
                        such as staying logged in.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">Third-Party Cookies</h2>
                    <p>
                        Some cookies are set by third-party services that appear on our pages. We do not control these cookies.
                        Please refer to the third parties' own cookie policies:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><a href="https://policies.google.com/technologies/cookies" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Google (OAuth)</a></li>
                        <li><a href="https://stripe.com/cookies-policy/legal" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Stripe (Payments)</a></li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">Updates to This Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">Contact Us</h2>
                    <p>
                        If you have questions about our use of cookies, please contact us at:
                        <br /><strong>[your-email@example.com]</strong>
                    </p>
                </section>
            </div>
        </div>
    );
}
