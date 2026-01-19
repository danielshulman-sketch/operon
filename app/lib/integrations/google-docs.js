/**
 * Google Docs Integration
 * Create and edit Google Docs documents
 */

import { google } from 'googleapis';

/**
 * Initialize Google Docs API client
 */
function getDocsClient(credentials) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
    });

    return google.docs({ version: 'v1', auth: oauth2Client });
}

/**
 * Initialize Google Drive client (needed for creating docs)
 */
function getDriveClient(credentials) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Create a new Google Doc
 */
export async function create_document(credentials, config) {
    const docs = getDocsClient(credentials);
    const drive = getDriveClient(credentials);

    const title = config.title || 'Untitled Document';
    const content = config.content || '';

    // Create the document
    const createResponse = await docs.documents.create({
        requestBody: {
            title: title,
        },
    });

    const documentId = createResponse.data.documentId;

    // If content is provided, insert it
    if (content) {
        await docs.documents.batchUpdate({
            documentId: documentId,
            requestBody: {
                requests: [
                    {
                        insertText: {
                            location: {
                                index: 1,
                            },
                            text: content,
                        },
                    },
                ],
            },
        });
    }

    // Get document URL
    const file = await drive.files.get({
        fileId: documentId,
        fields: 'webViewLink',
    });

    return {
        success: true,
        document_id: documentId,
        title: title,
        web_view_link: file.data.webViewLink,
    };
}

/**
 * Append text to an existing document
 */
export async function append_text(credentials, config) {
    const docs = getDocsClient(credentials);

    const documentId = config.document_id;
    const text = config.text;

    if (!documentId || !text) {
        throw new Error('document_id and text are required');
    }

    // Get current document to find end index
    const doc = await docs.documents.get({
        documentId: documentId,
    });

    const endIndex = doc.data.body.content[doc.data.body.content.length - 1].endIndex - 1;

    // Append text at the end
    await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: {
                            index: endIndex,
                        },
                        text: text,
                    },
                },
            ],
        },
    });

    return {
        success: true,
        document_id: documentId,
        text_appended: text.length,
    };
}

/**
 * Replace text in a document
 */
export async function replace_text(credentials, config) {
    const docs = getDocsClient(credentials);

    const documentId = config.document_id;
    const find = config.find_text;
    const replace = config.replace_text;

    if (!documentId || !find) {
        throw new Error('document_id and find_text are required');
    }

    const replaceText = replace || '';

    await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests: [
                {
                    replaceAllText: {
                        containsText: {
                            text: find,
                            matchCase: false,
                        },
                        replaceText: replaceText,
                    },
                },
            ],
        },
    });

    return {
        success: true,
        document_id: documentId,
        find_text: find,
        replace_text: replaceText,
    };
}

/**
 * Get document content
 */
export async function get_document_content(credentials, config) {
    const docs = getDocsClient(credentials);

    const documentId = config.document_id;

    if (!documentId) {
        throw new Error('document_id is required');
    }

    const doc = await docs.documents.get({
        documentId: documentId,
    });

    // Extract plain text from document
    let text = '';
    const content = doc.data.body.content;

    for (const element of content) {
        if (element.paragraph) {
            for (const textElement of element.paragraph.elements || []) {
                if (textElement.textRun) {
                    text += textElement.textRun.content;
                }
            }
        }
    }

    return {
        success: true,
        document_id: documentId,
        title: doc.data.title,
        content: text,
        revision_id: doc.data.revisionId,
    };
}

/**
 * Insert a table into a document
 */
export async function insert_table(credentials, config) {
    const docs = getDocsClient(credentials);

    const documentId = config.document_id;
    const rows = config.rows || 3;
    const columns = config.columns || 3;
    const index = config.index || 1; // Where to insert (default: beginning)

    if (!documentId) {
        throw new Error('document_id is required');
    }

    await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests: [
                {
                    insertTable: {
                        rows: rows,
                        columns: columns,
                        location: {
                            index: index,
                        },
                    },
                },
            ],
        },
    });

    return {
        success: true,
        document_id: documentId,
        rows: rows,
        columns: columns,
    };
}

/**
 * Export document to different format
 */
export async function export_document(credentials, config) {
    const drive = getDriveClient(credentials);

    const documentId = config.document_id;
    const format = config.format || 'pdf'; // pdf, html, txt, docx, odt

    if (!documentId) {
        throw new Error('document_id is required');
    }

    const mimeTypes = {
        pdf: 'application/pdf',
        html: 'text/html',
        txt: 'text/plain',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        odt: 'application/vnd.oasis.opendocument.text',
    };

    const mimeType = mimeTypes[format] || mimeTypes.pdf;

    const response = await drive.files.export(
        {
            fileId: documentId,
            mimeType: mimeType,
        },
        { responseType: 'arraybuffer' }
    );

    // Convert to base64 for easier handling
    const base64Content = Buffer.from(response.data).toString('base64');

    return {
        success: true,
        document_id: documentId,
        format: format,
        mime_type: mimeType,
        content_base64: base64Content,
        size_bytes: response.data.byteLength,
    };
}

export const googleDocsIntegration = {
    name: 'Google Docs',
    create_document,
    append_text,
    replace_text,
    get_document_content,
    insert_table,
    export_document,
};
