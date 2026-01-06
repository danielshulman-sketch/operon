export const guideData = {
    tabs: [
        { id: 'start', label: 'Getting Started' },
        { id: 'email', label: 'Email Stream' },
        { id: 'tasks', label: 'Tasks & Projects' },
        { id: 'setup', label: 'Setup & Integrations' },
        { id: 'automations', label: 'Automations' },
        { id: 'chat', label: 'AI Assistant' },
        { id: 'admin', label: 'Admin & KB' },
    ],
    sections: {
        start: [
            {
                title: 'Welcome to Operon',
                description: 'Operon is your intelligent workspace that combines email, task management, and automation into one seamless platform. This guide covers everything you need to know to become a power user.',
                image: '/images/ug-dashboard.png',
                steps: [
                    '**Dashboard**: Your central command center showing real-time metrics, revenue, and active users.',
                    '**Navigation**: Access key features like Email Stream, Tasks, and Automations from the sidebar.',
                    '**Quick Actions**: Use Command+K to open the command palette for fast navigation.'
                ]
            }
        ],
        email: [
            {
                title: 'Email Stream Overview',
                description: 'A unified inbox that uses AI to classify and prioritize your communications.',
                steps: [
                    '**Syncing**: Click the "Sync" button to fetch recent emails from your connected accounts.',
                    '**AI Classification**: Emails are automatically tagged as "Task", "FYI", "Question", or "Meeting" based on content.',
                    '**Filtering**: Use the pill buttons at the top to filter emails by their classification (e.g., show only "Questions").'
                ]
            },
            {
                title: 'Drafting & Replies',
                description: 'Let the AI handle your correspondence.',
                steps: [
                    '**Generate Reply**: Click "Generate Reply" on any email to have the AI draft a response based on your writing style.',
                    '**Regenerate**: If the draft isn\'t quite right, click "Regenerate" to try again.',
                    '**Approve & Send**: Review the draft, make edits if necessary, and click "Approve & Send" to dispatch it immediately.',
                    '**Bulk Actions**: Select multiple emails and click "Generate Drafts" to process them in batches.'
                ]
            }
        ],
        tasks: [
            {
                title: 'Task Management',
                description: 'Keep track of your work with a powerful task manager integrated directly with your email.',
                steps: [
                    '**Create Tasks**: Click the "+" button to create a new task manually.',
                    '**From Email**: Emails classified as "Task" can be automatically converted into actionable items.',
                    '**Status Tracking**: Move tasks between "Pending", "In Progress", and "Completed".'
                ]
            },
            {
                title: 'Priorities & Assignment',
                description: 'Manage team workload effectively.',
                steps: [
                    '**Priority Levels**: Set tasks as High (Red), Medium (Orange), or Low (Green) priority.',
                    '**Assignment**: Admins can assign tasks to specific team members directly from the task card.',
                    '**Due Dates**: Set deadlines to keep projects on track.'
                ]
            }
        ],
        setup: [
            {
                title: 'Connecting Your Email',
                description: 'Link your Gmail, Outlook, or custom email account to start using AI features.',
                steps: [
                    '**Navigate**: Go to **Settings > Email Connections** or click "Sync" in the Email Stream if not connected.',
                    '**Gmail**: Use your email and an **App Password** (required by Google for 3rd party apps).',
                    '**Outlook**: Login with your normal credentials or App Password.',
                    '**Custom IMAP**: Enter your host (e.g., `imap.mail.com`), port (`993`), and credentials manually.'
                ]
            },
            {
                title: 'Integration Stats',
                description: 'Monitor the health of your connections.',
                steps: [
                    'Check the **Integration Stats** page to see sync history.',
                    'View connection status for Stripe, Slack, and other tools.',
                    'Reconnect any failed integrations immediately.'
                ]
            }
        ],
        automations: [
            {
                title: 'Building Workflow Automations',
                description: 'Create powerful automations to handle repetitive tasks.',
                image: '/images/ug-automations.png',
                steps: [
                    '**Create New**: Go to **Automations** and click "**Create Automation**".',
                    '**Trigger**: Choose what starts the flow (e.g., "**New Email Received**" or "**Form Submission**").',
                    '**Logic**: Add an action step. For example, "If New Email -> Send Slack Notification".',
                    '**Activate**: Toggle the automation to "Active" to start running it.'
                ]
            },
            {
                title: 'Example: Email to Task',
                description: 'How to automatically turn high-priority emails into tasks.',
                steps: [
                    '**Trigger**: Select "New Email" and add a filter for "Subject contains: Urgent".',
                    '**Action**: Add a "Create Task" node.',
                    '**Configure**: Map the email Subject to Task Title and Body to Description.',
                    '**Result**: Every "Urgent" email will now instantly become a task on your board.'
                ]
            }
        ],
        chat: [
            {
                title: 'AI Assistant',
                description: 'Your 24/7 intelligent partner for research and content creation.',
                image: '/images/ug-chat.png',
                steps: [
                    '**Context Aware**: The AI has access to your Knowledge Base and can answer questions about your specific company processes.',
                    '**Content Creation**: Ask the AI to write blog posts, emails, or summaries.',
                    '**Problem Solving**: Use the chat to brainstorm ideas or troubleshoot issues.'
                ]
            }
        ],
        admin: [
            {
                title: 'Knowledge Base (KB)',
                description: 'Train your AI assistant with your company\'s own data.',
                steps: [
                    '**Upload Documents**: Upload PDFs, Word docs, or text files to the Knowledge Base.',
                    '**Categorization**: Tag and categorize documents (e.g., "HR", "Technical") for better organization.',
                    '**AI Training**: The AI automatically ingests these documents to provide accurate, business-specific answers in the Chat.'
                ]
            },
            {
                title: 'User Management',
                description: 'Control access and roles within your organization.',
                steps: [
                    '**Invite Users**: Add new team members via email invitation.',
                    '**Roles**: Assign "Admin" or "Standard" roles to control access to sensitive features.',
                    '**Activity Logs**: specific View detailed logs of user actions for security and compliance.'
                ]
            }
        ]
    }
};
