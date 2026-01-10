// Operon User Guide Data
// This guide is used for tooltips, walkthroughs, and AI assistant knowledge

export const operonGuide = {
    meta: {
        title: "Operon – Complete User & Admin Guide",
        version: "1.1",
        last_updated: "2026-01",
        audience: ["user", "admin"],
        description: "Setup, daily use, integrations, and administration"
    },

    quickStart: {
        title: "Quick Start",
        estimatedTimeMinutes: 15,
        steps: [
            {
                order: 1,
                title: "Log in",
                description: "Sign in with your email and password to access the dashboard."
            },
            {
                order: 2,
                title: "Connect AI (Admins only)",
                description: "Go to Settings → API Settings and add your AI provider key (e.g. OpenAI).",
                role: "admin"
            },
            {
                order: 3,
                title: "Connect your email",
                description: "Go to Settings → Email Accounts and connect an inbox. App passwords may be required."
            },
            {
                order: 4,
                title: "Create your first task",
                description: "Create a task from the Dashboard or Tasks page with a clear title and priority."
            },
            {
                order: 5,
                title: "Optional: Connect integrations",
                description: "Go to Automations → Integrations to connect tools like Slack, Google Sheets, or Stripe."
            }
        ]
    },

    tooltips: {
        email_field: "Enter the email address associated with your Operon account.",
        password_field: "Your password is case-sensitive.",
        urgent_tasks: "High-priority tasks that need attention.",
        api_key: "Stored securely and encrypted. Never shared.",
        sync_now: "Fetch the latest emails immediately.",
        pending_tasks: "Tasks not yet started.",
        in_progress_tasks: "Tasks currently being worked on.",
        completed_tasks: "Tasks finished this week.",
        general_ai: "Ask me anything! I can help with general questions, explanations, and tasks.",
        business_ai: "Ask me about your company processes, SOPs, and documentation. I'm trained on your knowledge base.",
        persona_ai: "Ask questions and get responses in your writing voice.",
        task_priority: "Set task priority: Low, Medium, High, or Urgent.",
        task_assignment: "Admins can assign tasks to team members.",
        email_provider: "Supported: Gmail, Outlook/Hotmail, Yahoo, and custom IMAP/SMTP.",
        app_password: "Some providers require app-specific passwords instead of your regular password.",
        openai_setup: "Add your OpenAI API key to enable AI features. Get one from platform.openai.com.",
        model_selection: "gpt-4o-mini is recommended for cost-effectiveness and speed."
    },

    sections: {
        loginAndSetup: {
            id: "login_account_setup",
            title: "Login & Account Setup",
            role: "user",
            subsections: {
                login: {
                    title: "Logging In",
                    content: [
                        "Navigate to the Operon login page.",
                        "Enter your registered email address.",
                        "Enter your password (case-sensitive).",
                        "Click Continue to sign in.",
                        "On success, you will be redirected to the Dashboard."
                    ],
                    notes: [
                        "A 'Skip to dashboard (demo)' option may be available for demonstration use."
                    ]
                },
                openaiSetup: {
                    title: "Connecting Your OpenAI Account",
                    role: "admin",
                    content: [
                        "Create an OpenAI account and verify your email.",
                        "Add billing information in the OpenAI dashboard.",
                        "Generate an API key (shown only once).",
                        "In Operon, go to Settings → API Settings.",
                        "Select OpenAI as the provider and choose a model (gpt-4o-mini recommended).",
                        "Paste the API key and save settings."
                    ],
                    tips: [
                        "Set a monthly spend limit in OpenAI.",
                        "Monitor usage regularly."
                    ]
                },
                emailSetup: {
                    title: "Connecting Your Email",
                    content: [
                        "Operon supports Gmail, Outlook/Hotmail, Yahoo, and custom IMAP/SMTP providers.",
                        "Some providers require app-specific passwords.",
                        "Removing an email disconnects it from Operon but does not delete emails."
                    ],
                    providers: {
                        gmail: {
                            requiresAppPassword: true,
                            imap: "imap.gmail.com:993",
                            smtp: "smtp.gmail.com:587",
                            instructions: "Enable 2FA in Google Account settings, then generate an app password from Security settings."
                        },
                        outlook: {
                            imap: "outlook.office365.com:993",
                            smtp: "smtp.office365.com:587",
                            instructions: "Use your regular Microsoft account password."
                        },
                        yahoo: {
                            requiresAppPassword: true,
                            imap: "imap.mail.yahoo.com:993",
                            smtp: "smtp.mail.yahoo.com:587",
                            instructions: "Generate an app password from Yahoo Account Security settings."
                        }
                    }
                }
            }
        },

        dashboardAndTasks: {
            id: "dashboard_tasks",
            title: "Dashboard & Task Management",
            role: "user",
            subsections: {
                dashboard: {
                    title: "Understanding the Dashboard",
                    content: [
                        "Pending Tasks: tasks not yet started.",
                        "In Progress: tasks currently being worked on.",
                        "Completed: tasks finished this week.",
                        "Urgent: high-priority tasks requiring attention."
                    ]
                },
                tasks: {
                    title: "Tasks Overview",
                    content: [
                        "Tasks track action items across the organisation.",
                        "Tasks can be created manually or extracted from emails.",
                        "Lifecycle: Pending → In Progress → Completed."
                    ]
                },
                taskAdmin: {
                    title: "Assigning Tasks",
                    role: "admin",
                    content: [
                        "Admins can assign tasks to team members.",
                        "Assigned tasks appear in the assignee's dashboard."
                    ]
                }
            }
        },

        integrations: {
            id: "integrations",
            title: "Integrations & OAuth",
            role: "advanced",
            content: [
                "Integrations connect Operon with third-party tools.",
                "OAuth allows secure connections without sharing passwords.",
                "API keys are used for developer-based integrations."
            ],
            supportedCategories: [
                "Communication (Slack)",
                "Productivity (Google Sheets, Notion, Airtable)",
                "Scheduling (Google Calendar, Outlook, Zoom, Calendly)",
                "Payments (Stripe)",
                "Marketing & CRM (Mailchimp, MailerLite, GoHighLevel, Kajabi)"
            ]
        },

        adminUsers: {
            id: "admin_users",
            title: "Admin – User Management",
            role: "admin",
            subsections: {
                adminAccess: {
                    title: "Accessing Admin Dashboard",
                    content: [
                        "Log in to Operon.",
                        "Navigate to Dashboard.",
                        "Click Admin in the sidebar."
                    ]
                },
                userManagement: {
                    title: "Managing Users",
                    content: [
                        "Create users with a unique email and password.",
                        "Reset passwords when required.",
                        "Deactivate users to temporarily block access.",
                        "Remove users only when access is permanently no longer needed."
                    ]
                }
            }
        }
    },

    // Format guide content for AI assistant knowledge base
    getKnowledgeBaseContent() {
        return `# Operon User Guide

## Quick Start (15 minutes)

1. **Log in**: Sign in with your email and password
2. **Connect AI (Admins)**: Settings → API Settings. Add OpenAI key (gpt-4o-mini recommended)
3. **Connect Email**: Settings → Email Accounts. Gmail/Outlook/Yahoo supported. App passwords may be required.
4. **Create First Task**: Use Dashboard or Tasks page with clear title and priority
5. **Optional Integrations**: Automations → Integrations for Slack, Google Sheets, Stripe, etc.

## Email Setup

### Gmail
- Requires app-specific password (NOT your regular password)
- Enable 2FA first, then generate app password in Google Account Security
- IMAP: imap.gmail.com:993
- SMTP: smtp.gmail.com:587

### Outlook/Hotmail
- Use regular Microsoft account password
- IMAP: outlook.office365.com:993
- SMTP: smtp.office365.com:587

### Yahoo
- Requires app-specific password
- Generate from Yahoo Account Security settings
- IMAP: imap.mail.yahoo.com:993
- SMTP: smtp.mail.yahoo.com:587

## OpenAI Setup (Admin Only)

1. Create OpenAI account at platform.openai.com
2. Add billing information
3. Generate API key (shown only once - save it!)
4. In Operon: Settings → API Settings
5. Select OpenAI provider
6. Choose model: gpt-4o-mini (recommended for cost/speed)
7. Paste API key and save
8. Tip: Set monthly spend limit in OpenAI dashboard

## Dashboard Overview

- **Pending Tasks**: Not yet started
- **In Progress**: Currently being worked on
- **Completed**: Finished this week
- **Urgent**: High-priority tasks needing attention

## Task Management

- Tasks can be created manually or extracted from emails
- Lifecycle: Pending → In Progress → Completed
- Admins can assign tasks to team members
- Set priority: Low, Medium, High, Urgent

## AI Assistants

### General AI
General-purpose assistant for any questions, explanations, and tasks.

### Business AI
Trained on your company's knowledge base (SOPs, documentation). Ask about company processes.

### Persona AI
Responds in your writing voice based on voice training samples.

## Integrations

Operon connects with:
- Communication: Slack
- Productivity: Google Sheets, Notion, Airtable
- Scheduling: Google Calendar, Outlook, Zoom, Calendly
- Payments: Stripe
- Marketing & CRM: Mailchimp, MailerLite, GoHighLevel, Kajabi

OAuth provides secure connections without sharing passwords.

## Admin Features

### User Management
- Create users with unique email and password
- Reset passwords as needed
- Deactivate users to temporarily block access
- Remove users only when permanently needed

### Accessing Admin Dashboard
Dashboard → Admin (in sidebar)
`;
    }
};

export default operonGuide;
