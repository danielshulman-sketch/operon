'use client';

export default function PrivacyPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-sora font-bold text-black dark:text-white mb-4">
                Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                <strong>Last Updated:</strong> January 29, 2026
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                {/* Introduction */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">1. Introduction</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Welcome to Operon, an AI-powered business automation and workflow management platform. This Privacy Policy explains how Operon ("we," "us," or "our") collects, uses, processes, and protects your personal information when you use our platform and services.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-3">
                        We are committed to protecting your privacy and complying with all applicable data protection laws, including the UK Data Protection Act 2018, the General Data Protection Regulation (GDPR), and the Privacy and Electronic Communications Regulations (PECR).
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-3">
                        By using Operon, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                    </p>
                </section>

                {/* Data Controller */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">2. Data Controller Information</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        The data controller responsible for your personal information is:
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
                        <p className="text-gray-800 dark:text-gray-200"><strong>Company Name:</strong> [Your Company Name]</p>
                        <p className="text-gray-800 dark:text-gray-200"><strong>Registered Address:</strong> [Your Complete Business Address]</p>
                        <p className="text-gray-800 dark:text-gray-200"><strong>Company Registration:</strong> [Your Company Number]</p>
                        <p className="text-gray-800 dark:text-gray-200"><strong>Email:</strong> <a href="mailto:privacy@yourcompany.com" className="text-blue-600 dark:text-blue-400 underline">privacy@yourcompany.com</a></p>
                        <p className="text-gray-800 dark:text-gray-200"><strong>Data Protection Officer:</strong> <a href="mailto:dpo@yourcompany.com" className="text-blue-600 dark:text-blue-400 underline">dpo@yourcompany.com</a></p>
                    </div>
                </section>

                {/* Information We Collect */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">3. Information We Collect</h2>

                    <h3 className="text-xl font-semibold text-black dark:text-white mt-6 mb-3">3.1 Personal Information You Provide</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Account Registration:</strong> Name, email address, password (encrypted), organization name, job title</li>
                        <li><strong>Profile Information:</strong> User preferences, display settings, notification preferences, language settings</li>
                        <li><strong>Authentication Data:</strong> Login credentials, OAuth tokens, two-factor authentication data</li>
                        <li><strong>Billing Information:</strong> Processed securely through Stripe (we do not store credit card details)</li>
                        <li><strong>Communication Data:</strong> Support ticket requests, feedback, survey responses</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-black dark:text-white mt-6 mb-3">3.2 Business and Workflow Data</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Email Content:</strong> Emails processed through our automation engine (Gmail, Outlook, Exchange, custom IMAP/SMTP)</li>
                        <li><strong>Documents:</strong> Files uploaded to the Knowledge Base, shared documents, attachments</li>
                        <li><strong>AI Conversations:</strong> Chat messages exchanged with AI assistants, prompts, responses</li>
                        <li><strong>Task and Project Data:</strong> Tasks created, project workflows, automation rules, assigned team members</li>
                        <li><strong>Calendar Events:</strong> Meeting scheduling data from integrated calendars (Google Calendar, Outlook Calendar)</li>
                        <li><strong>Integration Data:</strong> Data synchronized from third-party services (CRM, payment platforms, video conferencing)</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-black dark:text-white mt-6 mb-3">3.3 Automatically Collected Technical Data</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Device Information:</strong> IP address, browser type and version, device type, operating system, screen resolution</li>
                        <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, click patterns, navigation paths</li>
                        <li><strong>Log Data:</strong> Access times, error logs, API requests, system performance metrics</li>
                        <li><strong>Cookies and Tracking:</strong> Session cookies, authentication tokens, preference cookies (see our Cookie Policy)</li>
                        <li><strong>Activity Logs:</strong> User actions, automation executions, integration sync events, login/logout timestamps</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-black dark:text-white mt-6 mb-3">3.4 Third-Party Integration Data</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>OAuth Credentials:</strong> Encrypted access tokens and refresh tokens for Google, Microsoft, Stripe, Zoom, and other integrated services</li>
                        <li><strong>Synchronized Data:</strong> Contacts, calendar events, emails, files, and other data from connected third-party platforms</li>
                        <li><strong>API Keys:</strong> Encrypted API credentials for custom integrations</li>
                    </ul>
                </section>

                {/* Legal Basis */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">4. Legal Basis for Processing (GDPR Article 6)</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We process your personal data under the following legal bases:
                    </p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-black dark:text-white mb-2">Contract Performance (Article 6(1)(b))</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Processing necessary to provide our services, execute automations, manage your account, and fulfill our contractual obligations to you.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-black dark:text-white mb-2">Legitimate Interests (Article 6(1)(f))</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Improving our platform, preventing fraud and security threats, conducting analytics, optimizing performance, and providing customer support.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-black dark:text-white mb-2">Consent (Article 6(1)(a))</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Marketing communications, optional analytics cookies, and processing of special categories of data (where applicable). You may withdraw consent at any time.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-black dark:text-white mb-2">Legal Obligation (Article 6(1)(c))</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Compliance with tax laws, financial regulations, law enforcement requests, and other legal requirements.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How We Use Your Information */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">5. How We Use Your Information</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">We use your personal data for the following purposes:</p>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Service Delivery</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Create and manage your user account and organization</li>
                        <li>Process and execute workflow automations</li>
                        <li>Provide AI-powered assistance and chat functionality</li>
                        <li>Synchronize data with integrated third-party services</li>
                        <li>Manage email processing and auto-drafting</li>
                        <li>Enable document sharing and knowledge base features</li>
                        <li>Schedule and manage calendar events and meetings</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Security and Authentication</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Authenticate users and prevent unauthorized access</li>
                        <li>Detect and prevent fraudulent activity, spam, and abuse</li>
                        <li>Monitor system security and investigate breaches</li>
                        <li>Implement rate limiting and access controls</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Communication</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Send transactional emails (password resets, receipts, notifications)</li>
                        <li>Provide customer support and respond to inquiries</li>
                        <li>Send important service updates and security alerts</li>
                        <li>Marketing communications (with your consent only)</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Platform Improvement</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Analyze usage patterns to improve features and user experience</li>
                        <li>Develop new features and integrations</li>
                        <li>Optimize AI model performance and accuracy</li>
                        <li>Conduct research and development</li>
                        <li>Perform quality assurance and testing</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Legal and Compliance</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Comply with legal obligations and regulations</li>
                        <li>Respond to legal requests and prevent illegal activities</li>
                        <li>Enforce our Terms of Service</li>
                        <li>Maintain audit logs and records as required by law</li>
                    </ul>
                </section>

                {/* Third-Party Services */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">6. Third-Party Data Processors</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We work with carefully selected third-party service providers who process data on our behalf. All processors are GDPR-compliant and have signed Data Processing Agreements (DPAs) with appropriate security measures.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-white border-b">Service Provider</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-white border-b">Purpose</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-white border-b">Data Location</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-black dark:text-white border-b">Compliance</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 dark:text-gray-300">
                                <tr className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3"><strong>Supabase</strong></td>
                                    <td className="px-4 py-3">Database hosting, data storage</td>
                                    <td className="px-4 py-3">EU (Frankfurt)</td>
                                    <td className="px-4 py-3">GDPR, SOC 2</td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3"><strong>Stripe</strong></td>
                                    <td className="px-4 py-3">Payment processing, billing</td>
                                    <td className="px-4 py-3">US/EU</td>
                                    <td className="px-4 py-3">PCI-DSS Level 1, GDPR</td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3"><strong>Google Cloud</strong></td>
                                    <td className="px-4 py-3">OAuth, Gmail, Calendar, Drive APIs</td>
                                    <td className="px-4 py-3">Global</td>
                                    <td className="px-4 py-3">GDPR, ISO 27001</td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3"><strong>OpenAI</strong></td>
                                    <td className="px-4 py-3">AI language models, chat assistance</td>
                                    <td className="px-4 py-3">US</td>
                                    <td className="px-4 py-3">SOC 2, Privacy Shield (successor)</td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3"><strong>Anthropic</strong></td>
                                    <td className="px-4 py-3">AI language models (Claude)</td>
                                    <td className="px-4 py-3">US</td>
                                    <td className="px-4 py-3">SOC 2</td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3"><strong>Zoom</strong></td>
                                    <td className="px-4 py-3">Video conferencing integration</td>
                                    <td className="px-4 py-3">Global</td>
                                    <td className="px-4 py-3">GDPR, ISO 27001</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3"><strong>Vercel</strong></td>
                                    <td className="px-4 py-3">Application hosting, CDN</td>
                                    <td className="px-4 py-3">Global (EU available)</td>
                                    <td className="px-4 py-3">GDPR, SOC 2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mt-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <strong>⚠️ AI Data Processing:</strong> When you use AI features (chat assistants, auto-drafting), your prompts and content are sent to third-party AI providers (OpenAI, Anthropic, Google). These providers process data according to their own privacy policies and typically do not use your data to train their models when accessed via API.
                        </p>
                    </div>
                </section>

                {/* Data Retention */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">7. Data Retention</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-start">
                            <div className="w-48 flex-shrink-0 font-semibold text-black dark:text-white">Account Data:</div>
                            <div className="text-gray-700 dark:text-gray-300">Retained while your account is active and for 30 days after deletion request</div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-48 flex-shrink-0 font-semibold text-black dark:text-white">Activity Logs:</div>
                            <div className="text-gray-700 dark:text-gray-300">12 months for security and audit purposes</div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-48 flex-shrink-0 font-semibold text-black dark:text-white">Chat History:</div>
                            <div className="text-gray-700 dark:text-gray-300">Until deleted by user or account closure</div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-48 flex-shrink-0 font-semibold text-black dark:text-white">Email Data:</div>
                            <div className="text-gray-700 dark:text-gray-300">Per your organization's retention policy or until disconnected</div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-48 flex-shrink-0 font-semibold text-black dark:text-white">Billing Records:</div>
                            <div className="text-gray-700 dark:text-gray-300">7 years (UK tax law requirement)</div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-48 flex-shrink-0 font-semibold text-black dark:text-white">Marketing Consent:</div>
                            <div className="text-gray-700 dark:text-gray-300">Until consent is withdrawn, then immediately deleted</div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-48 flex-shrink-0 font-semibold text-black dark:text-white">Backup Data:</div>
                            <div className="text-gray-700 dark:text-gray-300">30 days in encrypted backups, then permanently deleted</div>
                        </div>
                    </div>
                </section>

                {/* Your Rights */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">8. Your Rights Under GDPR and UK DPA 2018</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        You have the following rights regarding your personal data. To exercise any of these rights, visit your <a href="/dashboard/privacy" className="text-blue-600 dark:text-blue-400 underline font-semibold">Privacy Dashboard</a> or contact our Data Protection Officer.
                    </p>

                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Access (Article 15)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Request a copy of all personal data we hold about you. Available via the "Export My Data" button in your Privacy Dashboard.
                            </p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Rectification (Article 16)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Correct any inaccurate or incomplete personal information. Update your profile in Account Settings.
                            </p>
                        </div>

                        <div className="border-l-4 border-red-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Erasure / "Right to be Forgotten" (Article 17)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Request deletion of your personal data. Use the "Delete My Account" option in your Privacy Dashboard (30-day grace period applies).
                            </p>
                        </div>

                        <div className="border-l-4 border-yellow-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Restrict Processing (Article 18)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Request that we limit how we use your data while disputes are resolved.
                            </p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Data Portability (Article 20)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Receive your data in a structured, machine-readable format (JSON). Available via data export.
                            </p>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Object (Article 21)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Object to processing based on legitimate interests, direct marketing, or profiling.
                            </p>
                        </div>

                        <div className="border-l-4 border-pink-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Withdraw Consent (Article 7)</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Withdraw consent for marketing or optional data processing at any time without affecting service access.
                            </p>
                        </div>

                        <div className="border-l-4 border-cyan-500 pl-4">
                            <h4 className="font-semibold text-black dark:text-white mb-1">Right to Lodge a Complaint</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Complain to the Information Commissioner's Office (ICO) if you believe your data rights have been violated.
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Response Time:</strong> We will respond to all rights requests within one month (extendable to three months for complex requests). There is no charge for exercising your rights unless requests are manifestly unfounded or excessive.
                        </p>
                    </div>
                </section>

                {/* Data Security */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">9. Data Security Measures</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We implement industry-leading technical and organizational security measures to protect your personal data:
                    </p>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Technical Security Controls</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Encryption at Rest:</strong> All database tables protected with Row Level Security (RLS) policies and AES-256 encryption</li>
                        <li><strong>Encryption in Transit:</strong> TLS 1.3 encryption for all data transmitted between your browser and our servers (HTTPS)</li>
                        <li><strong>Password Security:</strong> Bcrypt hashing with 12 rounds (industry-leading standard)</li>
                        <li><strong>Token Protection:</strong> JWT (JSON Web Tokens) with 7-day expiration and secure secret keys</li>
                        <li><strong>OAuth Token Encryption:</strong> Third-party access tokens encrypted using AES-256-CBC before database storage</li>
                        <li><strong>API Key Protection:</strong> All API credentials encrypted and never exposed in logs or error messages</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Access Controls</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Role-Based Access Control (RBAC):</strong> User, Admin, and Superadmin permission levels</li>
                        <li><strong>Organization Isolation:</strong> Strict data segregation between organizations</li>
                        <li><strong>Session Management:</strong> Automatic logout after inactivity, secure session storage</li>
                        <li><strong>Two-Factor Authentication:</strong> Available for enhanced account security (optional)</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Application Security</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Security Headers:</strong> X-Frame-Options, X-Content-Type-Options, CSP, X-XSS-Protection</li>
                        <li><strong>Content Security Policy (CSP):</strong> Prevents XSS attacks and code injection</li>
                        <li><strong>CSRF Protection:</strong> Cross-Site Request Forgery prevention mechanisms</li>
                        <li><strong>Rate Limiting:</strong> 100 requests per minute per IP to prevent abuse and DDoS attacks</li>
                        <li><strong>Input Sanitization:</strong> DOMPurify for XSS prevention in user-generated content</li>
                        <li><strong>SQL Injection Prevention:</strong> Parameterized queries and prepared statements</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Organizational Security</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Security Audits:</strong> Regular third-party security assessments and penetration testing</li>
                        <li><strong>Employee Training:</strong> All staff trained on data protection and security best practices</li>
                        <li><strong>Incident Response Plan:</strong> Documented procedures for data breach notification and remediation</li>
                        <li><strong>Vendor Management:</strong> All third-party processors undergo security due diligence</li>
                        <li><strong>Backup and Recovery:</strong> Encrypted daily backups with 30-day retention and tested recovery procedures</li>
                        <li><strong>Audit Logging:</strong> Comprehensive activity logs retained for 12 months for forensic analysis</li>
                    </ul>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 mt-4">
                        <p className="text-sm text-green-800 dark:text-green-300">
                            <strong>🔒 Security Certifications:</strong> Our infrastructure partners maintain SOC 2 Type II, ISO 27001, and GDPR compliance certifications. We conduct annual security audits and maintain vulnerability disclosure programs.
                        </p>
                    </div>
                </section>

                {/* International Transfers */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">10. International Data Transfers</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Your data is primarily stored and processed within the European Union (EU) and United Kingdom (UK). However, some third-party services may process data outside these regions.
                    </p>

                    <h3 className="text-lg font-semibold text-black dark:text-white mt-4 mb-2">Transfer Safeguards</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                        Where personal data is transferred outside the EU/UK, we ensure appropriate safeguards are in place:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li><strong>Standard Contractual Clauses (SCCs):</strong> EU Commission-approved contracts with third-party processors</li>
                        <li><strong>Adequacy Decisions:</strong> Transfers to countries deemed adequate by the EU Commission</li>
                        <li><strong>Binding Corporate Rules:</strong> For multinational service providers</li>
                        <li><strong>Encryption:</strong> All data encrypted during international transmission</li>
                    </ul>

                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Primary Data Storage:</strong> Supabase (EU - Frankfurt), <strong>Backups:</strong> EU region only, <strong>AI Processing:</strong> OpenAI and Anthropic (US - with SCCs in place)
                        </p>
                    </div>
                </section>

                {/* Cookies */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">11. Cookies and Tracking Technologies</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We use cookies and similar technologies to provide and improve our services. You can manage your cookie preferences through our Cookie Consent banner or in your browser settings.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        For detailed information about our use of cookies, please see our <a href="/cookies" className="text-blue-600 dark:text-blue-400 underline font-semibold">Cookie Policy</a>.
                    </p>
                </section>

                {/* Children's Privacy */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">12. Children's Privacy</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Operon is a business platform not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected personal data from a child under 16, we will take steps to delete such information as quickly as possible. If you believe a child has provided us with personal data, please contact us immediately at <a href="mailto:privacy@yourcompany.com" className="text-blue-600 dark:text-blue-400 underline">privacy@yourcompany.com</a>.
                    </p>
                </section>

                {/* Changes to Policy */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">13. Changes to This Privacy Policy</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                        <strong>Notification of Changes:</strong> We will notify you of material changes by:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300 mb-3">
                        <li>Email notification to your registered email address</li>
                        <li>Prominent notice on the platform dashboard</li>
                        <li>In-app notification banner</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300">
                        Your continued use of Operon after changes become effective constitutes acceptance of the updated Privacy Policy. We encourage you to review this policy periodically.
                    </p>
                </section>

                {/* Contact Information */}
                <section>
                    <h2 className="text-2xl font-sora font-bold text-black dark:text-white mb-4">14. Contact Us & Exercise Your Rights</h2>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl mb-6">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Data Protection Officer</h3>
                        <div className="space-y-2 text-gray-800 dark:text-gray-200">
                            <p><strong>Email:</strong> <a href="mailto:dpo@yourcompany.com" className="text-blue-600 dark:text-blue-400 underline">dpo@yourcompany.com</a></p>
                            <p><strong>Privacy Inquiries:</strong> <a href="mailto:privacy@yourcompany.com" className="text-blue-600 dark:text-blue-400 underline">privacy@yourcompany.com</a></p>
                            <p><strong>Address:</strong> [Your Company Address]</p>
                            <p><strong>Response Time:</strong> Within 1 business day for acknowledgment, full response within 30 days</p>
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-6">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Supervisory Authority</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            You have the right to lodge a complaint with your local data protection authority. In the UK, this is:
                        </p>
                        <div className="space-y-2 text-gray-800 dark:text-gray-200">
                            <p><strong>Information Commissioner's Office (ICO)</strong></p>
                            <p>Wycliffe House</p>
                            <p>Water Lane, Wilmslow</p>
                            <p>Cheshire, SK9 5AF</p>
                            <p><strong>Phone:</strong> 0303 123 1113</p>
                            <p><strong>Website:</strong> <a href="https://ico.org.uk" className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a></p>
                            <p><strong>Report a Concern:</strong> <a href="https://ico.org.uk/make-a-complaint" className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">https://ico.org.uk/make-a-complaint</a></p>
                        </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                        <p className="text-sm text-purple-900 dark:text-purple-300">
                            <strong>Quick Actions:</strong> To exercise your data rights immediately, visit your <a href="/dashboard/privacy" className="text-purple-600 dark:text-purple-400 underline font-semibold">Privacy Dashboard</a> where you can export your data, update your information, or request account deletion with just a few clicks.
                        </p>
                    </div>
                </section>

                {/* Effective Date */}
                <section className="border-t border-gray-300 dark:border-gray-700 pt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Effective Date:</strong> January 29, 2026<br />
                        <strong>Version:</strong> 1.0<br />
                        <strong>Last Reviewed:</strong> January 29, 2026
                    </p>
                </section>
            </div>
        </div>
    );
}
