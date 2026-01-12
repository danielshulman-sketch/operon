/**
 * Integration Registry
 * Central registry of all available integrations
 */

export const INTEGRATIONS = {
    slack: {
        name: 'Slack',
        description: 'Send messages and manage channels',
        icon: 'K',
        authType: 'oauth2',
        color: '#4A154B',
        actions: ['send_message', 'create_channel', 'schedule_message', 'invite_user'],
        helpUrl: 'https://api.slack.com/authentication/oauth-v2',
        setupInstructions: '1. Go to https://api.slack.com/apps and click "Create New App" > "From scratch"\n2. Name the app, choose a workspace, and create it\n3. Open "OAuth & Permissions" and add scopes: chat:write, channels:manage, channels:read, users:read, team:read\n4. Add redirect URL: {APP_URL}/api/integrations/oauth/callback\n5. Click "Save URLs" and then "Install to Workspace"\n6. Copy the Client ID and Client Secret from "Basic Information"\n7. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://slack.com/oauth/v2/authorize',
            tokenUrl: 'https://slack.com/api/oauth.v2/access',
            scopes: ['chat:write', 'channels:manage', 'channels:read', 'users:read', 'team:read']
        },
        actionSchemas: {
            send_message: [
                { name: 'channel', label: 'Channel ID', type: 'text', required: true, help: 'e.g. C12345678' },
                { name: 'text', label: 'Message Text', type: 'textarea', required: true }
            ],
            create_channel: [
                { name: 'name', label: 'Channel Name', type: 'text', required: true }
            ],
            schedule_message: [
                { name: 'channel', label: 'Channel ID', type: 'text', required: true },
                { name: 'message', label: 'Message Text', type: 'textarea', required: true },
                { name: 'post_at', label: 'Send At', type: 'datetime-local', required: true }
            ],
            invite_user: [
                { name: 'channel', label: 'Channel ID', type: 'text', required: true },
                { name: 'user', label: 'User ID', type: 'text', required: true, help: 'User ID like U123456' }
            ]
        }
    },

    google_sheets: {
        name: 'Google Sheets',
        description: 'Read and write spreadsheet data',
        icon: '',
        authType: 'oauth2',
        color: '#0F9D58',
        actions: ['read_rows', 'append_row', 'create_sheet', 'update_row', 'delete_row'],
        helpUrl: 'https://developers.google.com/sheets/api/guides/authorizing',
        setupInstructions: '1. Go to Google Cloud Console (https://console.cloud.google.com/)\n2. Create or select a project, then enable the Google Sheets API\n3. Go to "APIs & Services" > "OAuth consent screen" and configure it\n4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"\n5. Choose "Web application" and add redirect URI: {APP_URL}/api/integrations/oauth/callback\n6. Save and copy the Client ID and Client Secret\n7. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        },
        actionSchemas: {
            read_rows: [
                { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text', required: true },
                { name: 'range', label: 'Range', type: 'text', required: true, help: 'e.g. Sheet1!A1:B10' }
            ],
            append_row: [
                { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text', required: true },
                { name: 'values', label: 'Row Values (JSON Array)', type: 'text', required: true, help: 'e.g. ["Column A", "Column B"]' }
            ],
            update_row: [
                { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text', required: true },
                { name: 'sheetName', label: 'Sheet Name', type: 'text' },
                { name: 'rowNumber', label: 'Row Number', type: 'number', required: true },
                { name: 'values', label: 'Row Values (JSON Array)', type: 'text', required: true }
            ],
            delete_row: [
                { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text', required: true },
                { name: 'sheetId', label: 'Sheet ID', type: 'text', help: 'Optional specific sheet ID' },
                { name: 'rowNumber', label: 'Row Number', type: 'number', required: true }
            ]
        }
    },

    notion: {
        name: 'Notion',
        description: 'Create and update pages and databases',
        icon: '',
        authType: 'oauth2',
        color: '#000000',
        actions: ['create_page', 'update_database'],
        helpUrl: 'https://developers.notion.com/docs/authorization',
        setupInstructions: '1. Go to https://www.notion.so/my-integrations and click "New integration"\n2. Choose "Public integration" and select the workspace\n3. Add redirect URL: {APP_URL}/api/integrations/oauth/callback\n4. Copy the OAuth Client ID and Client Secret\n5. Paste them into Operon OAuth Settings and connect\n6. Share the target pages/databases with the integration',
        oauth: {
            authUrl: 'https://api.notion.com/v1/oauth/authorize',
            tokenUrl: 'https://api.notion.com/v1/oauth/token',
            scopes: []
        },
        actionSchemas: {
            create_page: [
                { name: 'databaseId', label: 'Database ID', type: 'text', required: true },
                { name: 'properties', label: 'Properties (JSON)', type: 'textarea', required: true }
            ]
        }
    },

    airtable: {
        name: 'Airtable',
        description: 'Manage bases, tables, and records',
        icon: '',
        authType: 'oauth2',
        color: '#18BFFF',
        actions: ['read_records', 'create_record', 'update_record', 'delete_record'],
        helpUrl: 'https://airtable.com/developers/web/api/oauth-reference',
        setupInstructions: '1. Go to https://airtable.com/create/oauth and create an OAuth integration\n2. Add redirect URI: {APP_URL}/api/integrations/oauth/callback\n3. Add scopes: data.records:read, data.records:write\n4. Save and copy the Client ID and Client Secret\n5. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://airtable.com/oauth2/v1/authorize',
            tokenUrl: 'https://airtable.com/oauth2/v1/token',
            scopes: ['data.records:read', 'data.records:write']
        },
        actionSchemas: {
            read_records: [
                { name: 'base_id', label: 'Base ID', type: 'text', required: true, help: 'Starts with app...' },
                { name: 'table_name', label: 'Table Name', type: 'text', required: true },
                { name: 'view', label: 'View Name', type: 'text', help: 'Optional view name' },
                { name: 'max_records', label: 'Max Records', type: 'number', help: 'Max 100' },
                { name: 'filter_formula', label: 'Filter Formula', type: 'text', help: 'Airtable formula' }
            ],
            create_record: [
                { name: 'base_id', label: 'Base ID', type: 'text', required: true },
                { name: 'table_name', label: 'Table Name', type: 'text', required: true },
                { name: 'fields', label: 'Fields (JSON)', type: 'textarea', required: true, help: '{"Name": "John", "Email": "john@example.com"}' }
            ],
            update_record: [
                { name: 'base_id', label: 'Base ID', type: 'text', required: true },
                { name: 'table_name', label: 'Table Name', type: 'text', required: true },
                { name: 'record_id', label: 'Record ID', type: 'text', required: true, help: 'Starts with rec...' },
                { name: 'fields', label: 'Fields (JSON)', type: 'textarea', required: true }
            ],
            delete_record: [
                { name: 'base_id', label: 'Base ID', type: 'text', required: true },
                { name: 'table_name', label: 'Table Name', type: 'text', required: true },
                { name: 'record_id', label: 'Record ID', type: 'text', required: true }
            ]
        }
    },

    stripe: {
        name: 'Stripe',
        description: 'Process payments and manage customers',
        icon: '',
        authType: 'api_key',
        color: '#635BFF',
        actions: ['create_customer', 'create_payment', 'create_payment_link', 'create_checkout_session', 'check_payment_status'],
        helpUrl: 'https://stripe.com/docs/keys',
        setupInstructions: `1. Log in to your Stripe Dashboard
2. Click "Developers" in the sidebar
3. Go to "API keys"
4. Copy your "Secret key" (starts with sk_)
 Never share your secret key publicly`,
        authFields: [
            { name: 'apiKey', label: 'Secret API Key', type: 'password', required: true, help: 'Found in Developers > API keys' }
        ],
        actionSchemas: {
            create_customer: [
                { name: 'email', label: 'Customer Email', type: 'email', required: true },
                { name: 'name', label: 'Customer Name', type: 'text' }
            ],
            create_payment_link: [
                { name: 'amount', label: 'Amount', type: 'number', required: true, help: 'Amount in dollars (e.g., 50.00)' },
                { name: 'currency', label: 'Currency', type: 'text', required: true, help: 'e.g., usd' },
                { name: 'description', label: 'Description', type: 'text', required: true }
            ],
            create_checkout_session: [
                { name: 'amount', label: 'Amount', type: 'number', required: true, help: 'Amount in dollars (e.g., 50.00)' },
                { name: 'currency', label: 'Currency', type: 'text', required: true, help: 'e.g., usd' },
                { name: 'description', label: 'Description', type: 'text', required: true },
                { name: 'customer_email', label: 'Customer Email', type: 'email' },
                { name: 'success_url', label: 'Success URL', type: 'text' },
                { name: 'cancel_url', label: 'Cancel URL', type: 'text' }
            ],
            check_payment_status: [
                { name: 'session_id', label: 'Checkout Session ID', type: 'text', help: 'Required if checking checkout session' },
                { name: 'payment_intent_id', label: 'Payment Intent ID', type: 'text', help: 'Required if checking payment intent' }
            ]
        }
    },

    google_calendar: {
        name: 'Google Calendar',
        description: 'Create and manage calendar events',
        icon: '📅',
        authType: 'oauth2',
        color: '#4285F4',
        actions: ['create_event', 'check_availability', 'update_event', 'delete_event'],
        helpUrl: 'https://developers.google.com/calendar/api/guides/auth',
        setupInstructions: '1. Go to Google Cloud Console (https://console.cloud.google.com/)\n2. Create or select a project, then enable the Google Calendar API\n3. Go to "APIs & Services" > "OAuth consent screen" and configure it\n4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"\n5. Choose "Web application" and add redirect URI: {APP_URL}/api/integrations/oauth/callback\n6. Save and copy the Client ID and Client Secret\n7. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
        },
        actionSchemas: {
            create_event: [
                { name: 'title', label: 'Event Title', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'start_time', label: 'Start Time', type: 'datetime-local', required: true, help: 'ISO 8601 format' },
                { name: 'end_time', label: 'End Time', type: 'datetime-local', required: true, help: 'ISO 8601 format' },
                { name: 'attendees', label: 'Attendees', type: 'text', help: 'Comma-separated email addresses' },
                { name: 'zoom_link', label: 'Zoom Link', type: 'text', help: 'Optional Zoom meeting link' },
                { name: 'timezone', label: 'Timezone', type: 'text', help: 'e.g., America/New_York' }
            ],
            check_availability: [
                { name: 'start_time', label: 'Start Time', type: 'datetime-local', required: true },
                { name: 'end_time', label: 'End Time', type: 'datetime-local', required: true },
                { name: 'timezone', label: 'Timezone', type: 'text', help: 'e.g., America/New_York' }
            ],
            update_event: [
                { name: 'event_id', label: 'Event ID', type: 'text', required: true },
                { name: 'title', label: 'Event Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'start_time', label: 'Start Time', type: 'datetime-local' },
                { name: 'end_time', label: 'End Time', type: 'datetime-local' }
            ],
            delete_event: [
                { name: 'event_id', label: 'Event ID', type: 'text', required: true }
            ]
        }
    },

    outlook_calendar: {
        name: 'Outlook Calendar',
        description: 'Create and manage Outlook calendar events',
        icon: '📆',
        authType: 'oauth2',
        color: '#0078D4',
        actions: ['create_event', 'check_availability', 'update_event', 'delete_event'],
        helpUrl: 'https://learn.microsoft.com/en-us/graph/auth-v2-user',
        setupInstructions: '1. Go to Azure Portal (https://portal.azure.com/)\n2. Navigate to "App registrations" and create a new registration\n3. Add redirect URI: {APP_URL}/api/integrations/oauth/callback\n4. Go to "API permissions" and add: Calendars.ReadWrite, offline_access\n5. Go to "Certificates & secrets" and create a new client secret\n6. Copy the Application (client) ID and client secret value\n7. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            scopes: ['Calendars.ReadWrite', 'offline_access', 'User.Read']
        },
        actionSchemas: {
            create_event: [
                { name: 'title', label: 'Event Title', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'start_time', label: 'Start Time', type: 'datetime-local', required: true, help: 'ISO 8601 format' },
                { name: 'end_time', label: 'End Time', type: 'datetime-local', required: true, help: 'ISO 8601 format' },
                { name: 'attendees', label: 'Attendees', type: 'text', help: 'Comma-separated email addresses' },
                { name: 'zoom_link', label: 'Zoom Link', type: 'text', help: 'Optional Zoom meeting link' },
                { name: 'timezone', label: 'Timezone', type: 'text', help: 'e.g., America/New_York' }
            ],
            check_availability: [
                { name: 'start_time', label: 'Start Time', type: 'datetime-local', required: true },
                { name: 'end_time', label: 'End Time', type: 'datetime-local', required: true },
                { name: 'timezone', label: 'Timezone', type: 'text', help: 'e.g., America/New_York' }
            ],
            update_event: [
                { name: 'event_id', label: 'Event ID', type: 'text', required: true },
                { name: 'title', label: 'Event Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'start_time', label: 'Start Time', type: 'datetime-local' },
                { name: 'end_time', label: 'End Time', type: 'datetime-local' }
            ],
            delete_event: [
                { name: 'event_id', label: 'Event ID', type: 'text', required: true }
            ]
        }
    },

    zoom: {
        name: 'Zoom',
        description: 'Create and manage Zoom meetings',
        icon: '🎥',
        authType: 'oauth2',
        color: '#2D8CFF',
        actions: ['create_meeting', 'get_meeting', 'update_meeting', 'delete_meeting'],
        helpUrl: 'https://marketplace.zoom.us/docs/guides/auth/oauth/',
        setupInstructions: '1. Go to Zoom App Marketplace (https://marketplace.zoom.us/)\n2. Click "Develop" > "Build App"\n3. Choose "OAuth" app type\n4. Fill in app information and add redirect URL: {APP_URL}/api/integrations/oauth/callback\n5. Add scopes: meeting:write, meeting:read\n6. Activate the app and copy Client ID and Client Secret\n7. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://zoom.us/oauth/authorize',
            tokenUrl: 'https://zoom.us/oauth/token',
            scopes: ['meeting:write:admin', 'meeting:read:admin']
        },
        actionSchemas: {
            create_meeting: [
                { name: 'topic', label: 'Meeting Topic', type: 'text', required: true },
                { name: 'start_time', label: 'Start Time', type: 'datetime-local', help: 'Leave empty for instant meeting' },
                { name: 'duration', label: 'Duration (minutes)', type: 'number', help: 'Default: 60' },
                { name: 'description', label: 'Agenda/Description', type: 'textarea' },
                { name: 'timezone', label: 'Timezone', type: 'text', help: 'e.g., America/New_York' }
            ],
            get_meeting: [
                { name: 'meeting_id', label: 'Meeting ID', type: 'text', required: true }
            ],
            update_meeting: [
                { name: 'meeting_id', label: 'Meeting ID', type: 'text', required: true },
                { name: 'topic', label: 'Meeting Topic', type: 'text' },
                { name: 'start_time', label: 'Start Time', type: 'datetime-local' },
                { name: 'duration', label: 'Duration (minutes)', type: 'number' }
            ],
            delete_meeting: [
                { name: 'meeting_id', label: 'Meeting ID', type: 'text', required: true }
            ]
        }
    },

    email: {
        name: 'Email (SMTP/IMAP)',
        description: 'Send and receive emails',
        icon: '',
        authType: 'smtp',
        color: '#EA4335',
        actions: ['send_email', 'check_emails'],
        helpUrl: 'https://support.google.com/accounts/answer/185833',
        setupInstructions: 'For Gmail:\n1. Enable 2-Step Verification\n2. Go to Security > App passwords\n3. Create app password for "Mail"\n4. Use app password (not your Gmail password)\nSMTP: smtp.gmail.com:587\nIMAP: imap.gmail.com:993',
        authFields: [
            { name: 'host', label: 'SMTP Host', type: 'text', required: true, help: 'e.g. smtp.gmail.com' },
            { name: 'port', label: 'SMTP Port', type: 'number', required: true, help: 'e.g. 587' },
            { name: 'user', label: 'Username/Email', type: 'text', required: true },
            { name: 'pass', label: 'Password/App Password', type: 'password', required: true },
            { name: 'imapHost', label: 'IMAP Host', type: 'text', required: true, help: 'e.g. imap.gmail.com' },
            { name: 'imapPort', label: 'IMAP Port', type: 'number', required: true, help: 'e.g. 993' }
        ],
        actionSchemas: {
            send_email: [
                { name: 'to', label: 'To', type: 'text', required: true },
                { name: 'subject', label: 'Subject', type: 'text', required: true },
                { name: 'text', label: 'Body', type: 'textarea', required: true }
            ]
        }
    },

    kartra: {
        name: 'Kartra',
        description: 'Marketing automation and sales funnels',
        icon: 'K',
        authType: 'api_key',
        color: '#00BFA5',
        actions: ['create_lead', 'subscribe_to_list'],
        helpUrl: 'https://help.kartra.com/article/212-api-documentation',
        setupInstructions: '1. Log in to Kartra\n2. Go to My Account > Integrations\n3. Click on "API" tab\n4. Copy your API Key and API Password\n5. Keep these credentials secure',
        authFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true, help: 'Settings > API' },
            { name: 'apiPassword', label: 'API Password', type: 'password', required: true }
        ],
        actionSchemas: {
            create_lead: [
                { name: 'firstName', label: 'First Name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true }
            ],
            subscribe_to_list: [
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'listId', label: 'List ID', type: 'text', required: true }
            ]
        }
    },

    kajabi: {
        name: 'Kajabi',
        description: 'Courses, memberships, and marketing automation',
        icon: 'K',
        authType: 'api_key',
        color: '#1B2A4E',
        actions: ['create_member', 'grant_offer', 'tag_member'],
        helpUrl: 'https://help.kajabi.com/hc/en-us/categories/360000436573-API',
        setupInstructions: '1. Log in to Kajabi\n2. Go to Settings > API Credentials\n3. Create a new API key\n4. Copy the API Key and API Secret\n5. Paste them when connecting in Operon',
        authFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true },
            { name: 'apiSecret', label: 'API Secret', type: 'password', required: true }
        ],
        actionSchemas: {
            create_member: [
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'firstName', label: 'First Name', type: 'text' },
                { name: 'lastName', label: 'Last Name', type: 'text' }
            ],
            grant_offer: [
                { name: 'memberId', label: 'Member ID', type: 'text', required: true },
                { name: 'offerId', label: 'Offer ID', type: 'text', required: true }
            ],
            tag_member: [
                { name: 'memberId', label: 'Member ID', type: 'text', required: true },
                { name: 'tag', label: 'Tag', type: 'text', required: true }
            ]
        }
    },

    gohighlevel: {
        name: 'GoHighLevel',
        description: 'CRM, pipelines, and marketing automation',
        icon: 'G',
        authType: ['oauth2', 'api_key'],
        color: '#1E4ED8',
        actions: ['create_contact', 'update_contact', 'create_opportunity'],
        helpUrl: 'https://developers.gohighlevel.com/',
        setupInstructions: 'OAuth:\n1. Go to https://developers.gohighlevel.com/ and create an OAuth app\n2. Add redirect URL: {APP_URL}/api/integrations/oauth/callback\n3. Copy the Client ID and Client Secret\n4. Paste them into Operon OAuth Settings and connect\n\nAPI Key:\n1. Log in to GoHighLevel\n2. Go to Settings > Company > API Keys\n3. Create a new API key\n4. Copy the API key\n5. Paste it when connecting in Operon',
        oauth: {
            authUrl: 'https://marketplace.gohighlevel.com/oauth/chooselocation',
            tokenUrl: 'https://services.leadconnectorhq.com/oauth/token',
            scopes: []
        },
        authFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ],
        actionSchemas: {
            create_contact: [
                { name: 'firstName', label: 'First Name', type: 'text' },
                { name: 'lastName', label: 'Last Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Phone', type: 'text' }
            ],
            update_contact: [
                { name: 'contactId', label: 'Contact ID', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Phone', type: 'text' }
            ],
            create_opportunity: [
                { name: 'name', label: 'Opportunity Name', type: 'text', required: true },
                { name: 'pipelineId', label: 'Pipeline ID', type: 'text', required: true },
                { name: 'stageId', label: 'Stage ID', type: 'text', required: true },
                { name: 'contactId', label: 'Contact ID', type: 'text', required: true }
            ]
        }
    },

    mailerlite: {
        name: 'MailerLite',
        description: 'Email marketing and newsletters',
        icon: 'M',
        authType: 'api_key',
        color: '#00A152',
        actions: ['create_subscriber', 'add_to_group', 'remove_from_group', 'update_subscriber'],
        helpUrl: 'https://developers.mailerlite.com/docs/authentication',
        setupInstructions: '1. Log in to MailerLite\n2. Go to Integrations > Developer API\n3. Generate a new API token\n4. Copy the token (starts with eyJ...)\n5. Paste it when connecting',
        authFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true, help: 'Integrations > API' }
        ],
        actionSchemas: {
            create_subscriber: [
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'name', label: 'Name', type: 'text' }
            ],
            add_to_group: [
                { name: 'email', label: 'Subscriber Email', type: 'email', required: true },
                { name: 'groupId', label: 'Group ID', type: 'text', required: true }
            ],
            remove_from_group: [
                { name: 'subscriberId', label: 'Subscriber ID', type: 'text', required: true },
                { name: 'groupId', label: 'Group ID', type: 'text', required: true }
            ],
            update_subscriber: [
                { name: 'subscriberId', label: 'Subscriber ID', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'fields', label: 'Custom Fields (JSON)', type: 'textarea', help: 'e.g. {"name":"Jane"}' }
            ]
        }
    },

    mailchimp: {
        name: 'Mailchimp',
        description: 'Marketing platform and email service',
        icon: 'M',
        authType: 'api_key',
        color: '#FFE01B',
        actions: ['add_member', 'send_campaign', 'create_campaign', 'add_tag'],
        helpUrl: 'https://mailchimp.com/help/about-api-keys/',
        setupInstructions: '1. Log in to Mailchimp\n2. Go to Account > Extras > API keys\n3. Click "Create A Key"\n4. Copy the API key\n5. Note server prefix from URL (e.g., us1)',
        authFields: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true, help: 'Account > Extras > API Keys' },
            { name: 'serverPrefix', label: 'Server Prefix', type: 'text', required: true, help: 'e.g. us1 (found in URL)' }
        ],
        actionSchemas: {
            add_member: [
                { name: 'listId', label: 'Audience ID', type: 'text', required: true },
                { name: 'email', label: 'Email Address', type: 'email', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['subscribed', 'pending'], required: true }
            ],
            send_campaign: [
                { name: 'campaignId', label: 'Campaign ID', type: 'text', required: true }
            ],
            create_campaign: [
                { name: 'listId', label: 'Audience ID', type: 'text', required: true },
                { name: 'subject', label: 'Subject Line', type: 'text', required: true },
                { name: 'fromName', label: 'From Name', type: 'text', required: true },
                { name: 'replyTo', label: 'Reply-To', type: 'email', required: true },
                { name: 'title', label: 'Internal Title', type: 'text' }
            ],
            add_tag: [
                { name: 'listId', label: 'Audience ID', type: 'text', required: true },
                { name: 'email', label: 'Subscriber Email', type: 'email', required: true },
                { name: 'tagName', label: 'Tag Name', type: 'text', required: true }
            ]
        }
    },

    wix: {
        name: 'Wix',
        description: 'Manage Wix orders and contacts',
        icon: 'W',
        authType: 'api_key',
        color: '#0C6EFC',
        actions: ['get_orders', 'get_contacts', 'create_contact'],
        helpUrl: 'https://dev.wix.com/api/rest/getting-started',
        setupInstructions: '1. Go to Wix Developers Center\n2. Create an App\n3. Get API Key or OAuth Token (depending on setup)\n4. If using API Key, paste it here.',
        authFields: [
            { name: 'apiKey', label: 'API Key / Access Token', type: 'password', required: true },
            { name: 'siteId', label: 'Site ID', type: 'text', help: 'Optional: Required for some API calls' }
        ],
        actionSchemas: {
            get_orders: [
                { name: 'limit', label: 'Limit', type: 'number', help: 'Max number of orders to fetch' }
            ],
            get_contacts: [
                { name: 'limit', label: 'Limit', type: 'number', help: 'Max number of contacts to fetch' }
            ],
            create_contact: [
                { name: 'firstName', label: 'First Name', type: 'text' },
                { name: 'lastName', label: 'Last Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'phone', label: 'Phone', type: 'text' }
            ]
        }
    },

    wordpress: {
        name: 'WordPress',
        description: 'Manage posts and comments',
        icon: 'W',
        authType: 'api_key',
        color: '#21759B',
        actions: ['create_post', 'get_posts', 'get_comments'],
        helpUrl: 'https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/',
        setupInstructions: '1. Go to Users > Profile in your WordPress Admin\n2. Scroll to Application Passwords\n3. specificy a name and Create a new Application Password\n4. Copy the password\n5. Enter your Site URL, Username, and this Password below',
        authFields: [
            { name: 'siteUrl', label: 'Site URL', type: 'text', required: true, help: 'e.g. https://mysite.com' },
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'applicationPassword', label: 'Application Password', type: 'password', required: true }
        ],
        actionSchemas: {
            create_post: [
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'content', label: 'Content', type: 'textarea', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['publish', 'draft', 'pending', 'private'], help: 'Default: draft' }
            ],
            get_posts: [
                { name: 'limit', label: 'Limit', type: 'number', help: 'Max posts to fetch' },
                { name: 'status', label: 'Status', type: 'select', options: ['publish', 'draft', 'pending', 'private'] }
            ],
            get_comments: [
                { name: 'post_id', label: 'Post ID', type: 'text', help: 'Optional: Filter by post' },
                { name: 'limit', label: 'Limit', type: 'number' }
            ]
        }
    },

    calendly: {
        name: 'Calendly',
        description: 'Appointment scheduling and calendar management',
        icon: '📅',
        authType: 'api_key',
        color: '#006BFF',
        actions: ['get_events', 'get_event_invitees', 'get_user', 'cancel_event'],
        helpUrl: 'https://developer.calendly.com/api-docs/ZG9jOjM2MzE2MDM4-overview',
        setupInstructions: '1. Log in to your Calendly account\n2. Go to Integrations > API & Webhooks\n3. Click "Get a Personal Access Token"\n4. Generate your token (starts with eyJ...)\n5. Copy the token and paste it below\n6. Keep this token secure - it provides full access to your account',
        authFields: [
            { name: 'apiKey', label: 'Personal Access Token', type: 'password', required: true, help: 'Found in Integrations > API & Webhooks' }
        ],
        actionSchemas: {
            get_events: [
                { name: 'user_uri', label: 'User URI', type: 'text', help: 'Optional: Filter by user URI' },
                { name: 'status', label: 'Status', type: 'select', options: ['active', 'canceled'], help: 'Event status' },
                { name: 'min_start_time', label: 'Min Start Time', type: 'datetime-local', help: 'ISO 8601 format' },
                { name: 'max_start_time', label: 'Max Start Time', type: 'datetime-local', help: 'ISO 8601 format' }
            ],
            get_event_invitees: [
                { name: 'event_uuid', label: 'Event UUID', type: 'text', required: true, help: 'The UUID of the scheduled event' }
            ],
            get_user: [],
            cancel_event: [
                { name: 'event_uuid', label: 'Event UUID', type: 'text', required: true },
                { name: 'reason', label: 'Cancellation Reason', type: 'textarea', help: 'Optional reason for cancellation' }
            ]
        }
    },

    dropbox: {
        name: 'Dropbox',
        description: 'Cloud file storage and sharing',
        icon: '📦',
        authType: 'oauth2',
        color: '#0061FF',
        actions: ['upload_file', 'create_folder', 'list_folder', 'share_file', 'download_file'],
        helpUrl: 'https://www.dropbox.com/developers/documentation/http/documentation',
        setupInstructions: '1. Go to Dropbox App Console (https://www.dropbox.com/developers/apps)\n2. Click "Create app"\n3. Choose "Scoped access" API\n4. Choose "Full Dropbox" access type\n5. Name your app\n6. Add redirect URI: {APP_URL}/api/integrations/oauth/callback\n7. Copy App key and App secret\n8. In Permissions tab, enable: files.metadata.write, files.metadata.read, files.content.write, files.content.read, sharing.write\n9. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://www.dropbox.com/oauth2/authorize',
            tokenUrl: 'https://api.dropbox.com/oauth2/token',
            scopes: []
        },
        actionSchemas: {
            upload_file: [
                { name: 'path', label: 'File Path', type: 'text', required: true, help: 'e.g. /documents/file.pdf' },
                { name: 'content', label: 'File Content', type: 'textarea', required: true },
                { name: 'mode', label: 'Write Mode', type: 'select', options: ['add', 'overwrite'], help: 'add or overwrite' }
            ],
            create_folder: [
                { name: 'path', label: 'Folder Path', type: 'text', required: true, help: 'e.g. /documents/new_folder' }
            ],
            list_folder: [
                { name: 'path', label: 'Folder Path', type: 'text', required: true, help: 'Empty string for root' },
                { name: 'recursive', label: 'Recursive', type: 'checkbox', help: 'List all subfolders' }
            ],
            share_file: [
                { name: 'path', label: 'File Path', type: 'text', required: true },
                { name: 'access_level', label: 'Access Level', type: 'select', options: ['viewer', 'editor'] }
            ],
            download_file: [
                { name: 'path', label: 'File Path', type: 'text', required: true }
            ]
        }
    },

    gmail: {
        name: 'Gmail',
        description: 'Send and manage emails with Gmail OAuth',
        icon: '📧',
        authType: 'oauth2',
        color: '#EA4335',
        actions: ['send_email', 'read_emails', 'create_draft', 'search_emails', 'list_labels'],
        helpUrl: 'https://developers.google.com/gmail/api/guides/sending',
        setupInstructions: '1. Go to Google Cloud Console (https://console.cloud.google.com/)\n2. Create or select a project\n3. Enable Gmail API\n4. Go to "APIs & Services" > "OAuth consent screen" and configure it\n5. Go to "Credentials" > "Create Credentials" > "OAuth client ID"\n6. Choose "Web application"\n7. Add redirect URI: {APP_URL}/api/integrations/oauth/callback\n8. Copy Client ID and Client Secret\n9. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
        },
        actionSchemas: {
            send_email: [
                { name: 'to', label: 'To', type: 'text', required: true, help: 'Comma-separated email addresses' },
                { name: 'subject', label: 'Subject', type: 'text', required: true },
                { name: 'body', label: 'Body', type: 'textarea', required: true },
                { name: 'cc', label: 'CC', type: 'text', help: 'Optional CC recipients' },
                { name: 'bcc', label: 'BCC', type: 'text', help: 'Optional BCC recipients' }
            ],
            read_emails: [
                { name: 'max_results', label: 'Max Results', type: 'number', help: 'Max 50' },
                { name: 'label_ids', label: 'Label IDs', type: 'text', help: 'Comma-separated, e.g. INBOX, SENT' }
            ],
            create_draft: [
                { name: 'to', label: 'To', type: 'text', required: true },
                { name: 'subject', label: 'Subject', type: 'text', required: true },
                { name: 'body', label: 'Body', type: 'textarea', required: true }
            ],
            search_emails: [
                { name: 'query', label: 'Search Query', type: 'text', required: true, help: 'e.g. from:user@example.com' },
                { name: 'max_results', label: 'Max Results', type: 'number', help: 'Default: 10' }
            ],
            list_labels: []
        }
    },

    onedrive: {
        name: 'OneDrive',
        description: 'Microsoft cloud file storage',
        icon: '☁️',
        authType: 'oauth2',
        color: '#0078D4',
        actions: ['upload_file', 'create_folder', 'share_file', 'download_file', 'search_files'],
        helpUrl: 'https://learn.microsoft.com/en-us/graph/onedrive-concept-overview',
        setupInstructions: '1. Go to Azure Portal (https://portal.azure.com/)\n2. Create app registration for "Operon OneDrive Integration"\n3. Add redirect URI: {APP_URL}/api/integrations/oauth/callback\n4. Go to "API permissions" and add: Files.ReadWrite.All, Files.Read.All, offline_access, User.Read\n5. Grant admin consent if required\n6. Go to "Certificates & secrets" and create client secret\n7. Copy Application (client) ID and secret value\n8. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            scopes: ['Files.ReadWrite.All', 'Files.Read.All', 'offline_access', 'User.Read']
        },
        actionSchemas: {
            upload_file: [
                { name: 'file_name', label: 'File Name', type: 'text', required: true, help: 'e.g. document.pdf' },
                { name: 'content', label: 'File Content', type: 'textarea', required: true },
                { name: 'folder_path', label: 'Folder Path', type: 'text', help: 'Optional folder, e.g. /Documents' }
            ],
            create_folder: [
                { name: 'folder_name', label: 'Folder Name', type: 'text', required: true },
                { name: 'parent_path', label: 'Parent Path', type: 'text', help: 'Optional parent folder' }
            ],
            share_file: [
                { name: 'file_id', label: 'File ID', type: 'text', required: true },
                { name: 'permission_type', label: 'Permission Type', type: 'select', options: ['view', 'edit'], required: true }
            ],
            download_file: [
                { name: 'file_id', label: 'File ID', type: 'text', required: true }
            ],
            search_files: [
                { name: 'query', label: 'Search Query', type: 'text', required: true },
                { name: 'max_results', label: 'Max Results', type: 'number', help: 'Default: 10' }
            ]
        }
    },

    sharepoint: {
        name: 'SharePoint',
        description: 'Microsoft document management and collaboration',
        icon: '📁',
        authType: 'oauth2',
        color: '#0078D4',
        actions: ['upload_file', 'create_folder', 'list_items', 'download_file', 'delete_item'],
        helpUrl: 'https://learn.microsoft.com/en-us/graph/api/resources/sharepoint',
        setupInstructions: '1. Go to Azure Portal (https://portal.azure.com/)\n2. Navigate to "App registrations" and create a new registration\n3. Name it "Operon SharePoint Integration"\n4. Add redirect URI: {APP_URL}/api/integrations/oauth/callback\n5. Go to "API permissions" and add: Sites.ReadWrite.All, Files.ReadWrite.All, offline_access\n6. Grant admin consent for these permissions\n7. Go to "Certificates & secrets" and create client secret\n8. Copy Application (client) ID and secret value\n9. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            scopes: ['Sites.ReadWrite.All', 'Files.ReadWrite.All', 'offline_access']
        },
        actionSchemas: {
            upload_file: [
                { name: 'site_id', label: 'Site ID', type: 'text', required: true, help: 'SharePoint site ID' },
                { name: 'folder_path', label: 'Folder Path', type: 'text', required: true, help: 'e.g. /Shared Documents' },
                { name: 'file_name', label: 'File Name', type: 'text', required: true },
                { name: 'content', label: 'File Content', type: 'textarea', required: true }
            ],
            create_folder: [
                { name: 'site_id', label: 'Site ID', type: 'text', required: true },
                { name: 'parent_path', label: 'Parent Path', type: 'text', required: true },
                { name: 'folder_name', label: 'Folder Name', type: 'text', required: true }
            ],
            list_items: [
                { name: 'site_id', label: 'Site ID', type: 'text', required: true },
                { name: 'folder_path', label: 'Folder Path', type: 'text', required: true }
            ],
            download_file: [
                { name: 'site_id', label: 'Site ID', type: 'text', required: true },
                { name: 'file_id', label: 'File ID', type: 'text', required: true }
            ],
            delete_item: [
                { name: 'site_id', label: 'Site ID', type: 'text', required: true },
                { name: 'item_id', label: 'Item ID', type: 'text', required: true }
            ]
        }
    },

    teams: {
        name: 'Microsoft Teams',
        description: 'Chat, channels, and team collaboration',
        icon: '💬',
        authType: 'oauth2',
        color: '#6264A7',
        actions: ['send_message', 'create_channel', 'list_teams', 'list_channels', 'post_announcement'],
        helpUrl: 'https://learn.microsoft.com/en-us/graph/api/resources/teams-api-overview',
        setupInstructions: '1. Go to Azure Portal (https://portal.azure.com/)\n2. Navigate to "App registrations" and create a new registration\n3. Name it "Operon Teams Integration"\n4. Add redirect URI: {APP_URL}/api/integrations/oauth/callback\n5. Go to "API permissions" and add: Team.ReadBasic.All, Channel.ReadWrite.All, ChatMessage.Send, offline_access\n6. Grant admin consent for permissions\n7. Go to "Certificates & secrets" and create a client secret\n8. Copy the Application (client) ID and client secret value\n9. Paste them into Operon OAuth Settings and connect',
        oauth: {
            authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            scopes: ['Team.ReadBasic.All', 'Channel.ReadWrite.All', 'ChatMessage.Send', 'offline_access']
        },
        actionSchemas: {
            send_message: [
                { name: 'team_id', label: 'Team ID', type: 'text', required: true },
                { name: 'channel_id', label: 'Channel ID', type: 'text', required: true },
                { name: 'message', label: 'Message', type: 'textarea', required: true }
            ],
            create_channel: [
                { name: 'team_id', label: 'Team ID', type: 'text', required: true },
                { name: 'channel_name', label: 'Channel Name', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea' }
            ],
            list_teams: [],
            list_channels: [
                { name: 'team_id', label: 'Team ID', type: 'text', required: true }
            ],
            post_announcement: [
                { name: 'team_id', label: 'Team ID', type: 'text', required: true },
                { name: 'channel_id', label: 'Channel ID', type: 'text', required: true },
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'message', label: 'Message', type: 'textarea', required: true }
            ]
        }
    }
};

export function normalizeAuthTypes(authType) {
    if (!authType) return [];
    return Array.isArray(authType) ? authType : [authType];
}

export function supportsOAuth(integration) {
    return normalizeAuthTypes(integration?.authType).includes('oauth2');
}

export function supportsCredentialAuth(integration) {
    return normalizeAuthTypes(integration?.authType).some((type) => type !== 'oauth2');
}

export function getIntegration(name) {
    return INTEGRATIONS[name] || null;
}

export function getAllIntegrations() {
    return Object.entries(INTEGRATIONS).map(([key, value]) => ({
        id: key,
        ...value,
    }));
}

export function isIntegrationSupported(name) {
    return name in INTEGRATIONS;
}
