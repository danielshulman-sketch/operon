// Walkthrough definitions for Operon

export const walkthroughs = {
    dashboard: {
        id: 'dashboard-intro',
        name: 'Dashboard Overview',
        description: 'Learn how to navigate your Operon dashboard',
        requiredPath: '/dashboard',
        steps: [
            {
                id: 'welcome',
                title: 'Welcome to Operon',
                content: 'Let\'s take a quick tour of your dashboard. Track tasks, priorities, and progress at a glance.',
                target: null, // Center of screen
                placement: 'center',
                showSkip: true
            },
            {
                id: 'pending-tasks',
                title: 'Pending Tasks',
                content: 'These are tasks that haven\'t been started yet. Click on any task to view details or change its status.',
                target: '[data-tour="pending-tasks"]',
                placement: 'bottom',
                showSkip: true
            },
            {
                id: 'in-progress',
                title: 'In Progress',
                content: 'Tasks you\'re currently working on appear here. Track your active work in real-time.',
                target: '[data-tour="in-progress-tasks"]',
                placement: 'bottom',
                showSkip: true
            },
            {
                id: 'urgent-tasks',
                title: 'Urgent Tasks',
                content: 'High-priority tasks that need immediate attention are highlighted here.',
                target: '[data-tour="urgent-tasks"]',
                placement: 'top',
                showSkip: true
            },
            {
                id: 'next-steps',
                title: 'You\'re All Set!',
                content: 'Explore the sidebar to access Tasks, Email, AI Assistant, and more. Need help? Click the help button anytime.',
                target: null,
                placement: 'center',
                showSkip: false
            }
        ]
    },

    tasks: {
        id: 'tasks-intro',
        name: 'Task Management',
        description: 'Learn how to create and manage tasks',
        requiredPath: '/dashboard/tasks',
        steps: [
            {
                id: 'tasks-page',
                title: 'Task Management',
                content: 'This is your central task hub. Create, organize, and track all your work here.',
                target: null,
                placement: 'center',
                showSkip: true
            },
            {
                id: 'create-task',
                title: 'Create a Task',
                content: 'Click here to create a new task. Add a clear title, set priority, and optionally assign it to team members.',
                target: '[data-tour="create-task-button"]',
                placement: 'bottom',
                showSkip: true
            },
            {
                id: 'task-filters',
                title: 'Filter Tasks',
                content: 'Use these filters to view tasks by status: All, Pending, In Progress, or Completed.',
                target: '[data-tour="task-filters"]',
                placement: 'bottom',
                showSkip: false
            }
        ]
    },

    aiAssistant: {
        id: 'ai-intro',
        name: 'AI Assistant Introduction',
        description: 'Meet your AI assistants',
        requiredPath: '/dashboard/chat',
        steps: [
            {
                id: 'ai-welcome',
                title: 'AI Assistant',
                content: 'Operon includes three AI assistants to help you work smarter.',
                target: null,
                placement: 'center',
                showSkip: true
            },
            {
                id: 'general-ai',
                title: 'General AI',
                content: 'Ask anything! General AI helps with questions, explanations, and general tasks.',
                target: '[data-tour="general-ai-tab"]',
                placement: 'bottom',
                showSkip: true
            },
            {
                id: 'business-ai',
                title: 'Business AI',
                content: 'Business AI is trained on your company\'s knowledge base. Ask about SOPs, processes, and documentation.',
                target: '[data-tour="business-ai-tab"]',
                placement: 'bottom',
                showSkip: true
            },
            {
                id: 'persona-ai',
                title: 'Persona AI',
                content: 'Persona AI responds in your writing voice. Perfect for drafting emails and messages.',
                target: '[data-tour="persona-ai-tab"]',
                placement: 'bottom',
                showSkip: false
            }
        ]
    },

    firstLogin: {
        id: 'first-login',
        name: 'Getting Started',
        description: 'First-time user onboarding',
        requiredPath: '/dashboard',
        steps: [
            {
                id: 'welcome-operon',
                title: 'Welcome to Operon! 👋',
                content: 'Your intelligent business automation platform. Let\'s get you set up in just a few minutes.',
                target: null,
                placement: 'center',
                showSkip: true
            },
            {
                id: 'dashboard-overview',
                title: 'Your Dashboard',
                content: 'This is your command center. Track tasks, monitor progress, and stay on top of priorities.',
                target: '[data-tour="dashboard-stats"]',
                placement: 'bottom',
                showSkip: true
            },
            {
                id: 'sidebar-nav',
                title: 'Navigation',
                content: 'Use the sidebar to access Tasks, Email, AI Assistant, Automations, and Settings.',
                target: '[data-tour="sidebar"]',
                placement: 'right',
                showSkip: true
            },
            {
                id: 'create-first-task',
                title: 'Create Your First Task',
                content: 'Get started by creating a task. Add a clear title and set a priority to stay organized.',
                target: '[data-tour="quick-create-task"]',
                placement: 'left',
                showSkip: true
            },
            {
                id: 'next-steps-setup',
                title: 'Next Steps',
                content: 'Connect your email, set up AI (admins), and explore integrations. You\'re ready to go! 🚀',
                target: null,
                placement: 'center',
                showSkip: false
            }
        ]
    }
};

export const getWalkthroughById = (id) => {
    return Object.values(walkthroughs).find(w => w.id === id);
};

export const getWalkthroughForPath = (path) => {
    return Object.values(walkthroughs).find(w => w.requiredPath === path);
};

export default walkthroughs;
