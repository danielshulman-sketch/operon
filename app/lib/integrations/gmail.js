/**
 * Gmail Integration
 * Send and manage emails using Gmail API
 */

import { google } from 'googleapis';

/**
 * Initialize Gmail API client
 */
function getGmailClient(credentials) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
}

/**
 * Send an email
 */
export async function send_email(credentials, config) {
    const gmail = getGmailClient(credentials);

    // Build email message in RFC 2822 format
    const to = config.to;
    const subject = config.subject;
    const body = config.body;
    const cc = config.cc || '';
    const bcc = config.bcc || '';

    const headers = [
        `To: ${to}`,
        subject ? `Subject: ${subject}` : '',
        cc ? `Cc: ${cc}` : '',
        bcc ? `Bcc: ${bcc}` : '',
        'Content-Type: text/html; charset=utf-8',
    ].filter(Boolean).join('\r\n');

    const message = `${headers}\r\n\r\n${body}`;

    // Encode message in base64url
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });

    return {
        success: true,
        message_id: response.data.id,
        thread_id: response.data.threadId,
    };
}

/**
 * Read emails from inbox or specific labels
 */
export async function read_emails(credentials, config) {
    const gmail = getGmailClient(credentials);

    const maxResults = config.max_results || 10;
    const labelIds = config.label_ids ? config.label_ids.split(',').map(l => l.trim()) : ['INBOX'];

    const response = await gmail.users.messages.list({
        userId: 'me',
        labelIds: labelIds,
        maxResults: Math.min(maxResults, 50), // Cap at 50
    });

    const messages = response.data.messages || [];

    // Fetch full message details for each message
    const emailDetails = await Promise.all(
        messages.map(async (message) => {
            const detail = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'full',
            });

            const headers = detail.data.payload.headers;
            const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

            return {
                id: detail.data.id,
                thread_id: detail.data.threadId,
                snippet: detail.data.snippet,
                from: getHeader('From'),
                to: getHeader('To'),
                subject: getHeader('Subject'),
                date: getHeader('Date'),
                labels: detail.data.labelIds || [],
            };
        })
    );

    return {
        success: true,
        emails: emailDetails,
        count: emailDetails.length,
    };
}

/**
 * Create a draft email
 */
export async function create_draft(credentials, config) {
    const gmail = getGmailClient(credentials);

    const to = config.to;
    const subject = config.subject;
    const body = config.body;

    const headers = [
        `To: ${to}`,
        subject ? `Subject: ${subject}` : '',
        'Content-Type: text/html; charset=utf-8',
    ].filter(Boolean).join('\r\n');

    const message = `${headers}\r\n\r\n${body}`;

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const response = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
            message: {
                raw: encodedMessage,
            },
        },
    });

    return {
        success: true,
        draft_id: response.data.id,
        message_id: response.data.message?.id,
    };
}

/**
 * Search emails by query
 */
export async function search_emails(credentials, config) {
    const gmail = getGmailClient(credentials);

    const query = config.query;
    const maxResults = config.max_results || 10;

    if (!query) {
        throw new Error('Search query is required');
    }

    const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: Math.min(maxResults, 50),
    });

    const messages = response.data.messages || [];

    // Fetch details for each message
    const emailDetails = await Promise.all(
        messages.map(async (message) => {
            const detail = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'full',
            });

            const headers = detail.data.payload.headers;
            const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

            return {
                id: detail.data.id,
                thread_id: detail.data.threadId,
                snippet: detail.data.snippet,
                from: getHeader('From'),
                to: getHeader('To'),
                subject: getHeader('Subject'),
                date: getHeader('Date'),
                labels: detail.data.labelIds || [],
            };
        })
    );

    return {
        success: true,
        emails: emailDetails,
        count: emailDetails.length,
        query: query,
    };
}

/**
 * List all Gmail labels
 */
export async function list_labels(credentials, config) {
    const gmail = getGmailClient(credentials);

    const response = await gmail.users.labels.list({
        userId: 'me',
    });

    const labels = response.data.labels || [];

    return {
        success: true,
        labels: labels.map(label => ({
            id: label.id,
            name: label.name,
            type: label.type,
        })),
        count: labels.length,
    };
}

/**
 * Mark email as read
 */
export async function mark_as_read(credentials, config) {
    const gmail = getGmailClient(credentials);

    const messageId = config.message_id;

    if (!messageId) {
        throw new Error('message_id is required');
    }

    await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
            removeLabelIds: ['UNREAD'],
        },
    });

    return {
        success: true,
        message_id: messageId,
    };
}

/**
 * Add label to email
 */
export async function add_label(credentials, config) {
    const gmail = getGmailClient(credentials);

    const messageId = config.message_id;
    const labelId = config.label_id;

    if (!messageId || !labelId) {
        throw new Error('message_id and label_id are required');
    }

    await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
            addLabelIds: [labelId],
        },
    });

    return {
        success: true,
        message_id: messageId,
        label_id: labelId,
    };
}

/**
 * Send an existing draft
 */
export async function send_draft(credentials, config) {
    const gmail = getGmailClient(credentials);

    const draftId = config.draft_id;

    if (!draftId) {
        throw new Error('draft_id is required');
    }

    const response = await gmail.users.drafts.send({
        userId: 'me',
        requestBody: {
            id: draftId,
        },
    });

    return {
        success: true,
        message_id: response.data.id,
        thread_id: response.data.threadId,
    };
}

export const gmailIntegration = {
    name: 'Gmail',
    send_email,
    read_emails,
    create_draft,
    search_emails,
    list_labels,
    mark_as_read,
    add_label,
    send_draft,
};
