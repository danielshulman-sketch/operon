'use client';
import { useState } from 'react';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-sora font-bold text-black dark:text-white mb-8">
                Privacy Policy
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB')}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">1. Introduction</h2>
                    <p>
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our business automation platform.
                        We are committed to protecting your privacy and complying with the UK Data Protection Act 2018 and the General Data Protection Regulation (GDPR).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">2. Data Controller</h2>
                    <p>
                        The data controller responsible for your personal information is:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
                        <p><strong>[Your Company Name]</strong></p>
                        <p>[Your Company Address]</p>
                        <p>Email: [your-email@example.com]</p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">3. Information We Collect</h2>

                    <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Personal Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Information:</strong> Name, email address, organization name</li>
                        <li><strong>Authentication Data:</strong> Encrypted password, login timestamps</li>
                        <li><strong>Profile Information:</strong> User preferences, settings, role within organization</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Usage Data</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Activity Logs:</strong> Actions performed within the platform</li>
                        <li><strong>AI Interactions:</strong> Chat conversations with AI assistants</li>
                        <li><strong>Email Data:</strong> Email content for automation purposes</li>
                        <li><strong>Integration Data:</strong> OAuth tokens for third-party services</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Technical Data</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                        <li><strong>Cookies:</strong> Authentication tokens (see Cookie Policy)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">4. Legal Basis for Processing</h2>
                    <p>We process your personal data under the following legal bases:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Contract Performance:</strong> To provide our services to you</li>
                        <li><strong>Legitimate Interests:</strong> To improve our platform and prevent fraud</li>
                        <li><strong>Consent:</strong> For marketing communications (where applicable)</li>
                        <li><strong>Legal Obligation:</strong> To comply with legal requirements</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">5. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Provide, operate, and maintain our services</li>
                        <li>Process automations and workflows</li>
                        <li>Authenticate users and prevent unauthorized access</li>
                        <li>Send transactional emails (receipts, notifications)</li>
                        <li>Improve and optimize our platform</li>
                        <li>Respond to support requests</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">6. Third-Party Services</h2>
                    <p>We use the following third-party processors:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Supabase:</strong> Database hosting (EU region)</li>
                        <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
                        <li><strong>Google:</strong> OAuth authentication, Calendar, Gmail APIs</li>
                        <li><strong>OpenAI/Anthropic:</strong> AI model providers</li>
                        <li><strong>Zoom:</strong> Video conference integration</li>
                    </ul>
                    <p className="mt-4">
                        All third-party processors are GDPR-compliant and have appropriate data processing agreements in place.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">7. Data Retention</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Data:</strong> Retained while your account is active</li>
                        <li><strong>Activity Logs:</strong> Retained for 12 months</li>
                        <li><strong>Chat Conversations:</strong> Retained until deleted by user</li>
                        <li><strong>Email Data:</strong> Retained per your organization's policy</li>
                        <li><strong>Deleted Accounts:</strong> 30-day grace period, then permanently deleted</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">8. Your Rights Under GDPR</h2>
                    <p>You have the following rights:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
                        <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                        <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                        <li><strong>Right to Data Portability:</strong> Receive your data in machine-readable format</li>
                        <li><strong>Right to Object:</strong> Object to certain processing activities</li>
                    </ul>
                    <p className="mt-4">
                        To exercise these rights, visit your <a href="/dashboard/privacy" className="text-blue-600 underline">Privacy Settings</a> or contact us.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">9. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Encryption at rest (Row Level Security on all database tables)</li>
                        <li>Encryption in transit (HTTPS/TLS)</li>
                        <li>Bcrypt password hashing</li>
                        <li>Role-based access controls</li>
                        <li>Regular security audits</li>
                        <li>JWT token authentication</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">10. International Transfers</h2>
                    <p>
                        Your data is primarily processed within the EU/UK. Where data is transferred outside these regions,
                        we ensure appropriate safeguards are in place (Standard Contractual Clauses).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">11. Children's Privacy</h2>
                    <p>
                        Our service is not directed to children under 16. We do not knowingly collect personal information from children.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">12. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any material changes by email or
                        through a notice on our platform.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">13. Contact & Complaints</h2>
                    <p>
                        For privacy-related questions or to exercise your rights, contact us at:
                        <br /><strong>[your-email@example.com]</strong>
                    </p>
                    <p className="mt-4">
                        You have the right to lodge a complaint with the Information Commissioner's Office (ICO):
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
                        <p><strong>Information Commissioner's Office</strong></p>
                        <p>Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
                        <p>Phone: 0303 123 1113</p>
                        <p>Website: <a href="https://ico.org.uk" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a></p>
                    </div>
                </section>
            </div>
        </div>
    );
}
