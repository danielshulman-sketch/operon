/**
 * Google Drive Integration
 * Manage files and folders in Google Drive
 */

import { google } from 'googleapis';

/**
 * Initialize Google Drive API client
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
 * Upload a file to Google Drive
 */
export async function upload_file(credentials, config) {
    const drive = getDriveClient(credentials);

    const fileName = config.file_name;
    const content = config.content;
    const folderId = config.folder_id || null;
    const mimeType = config.mime_type || 'text/plain';

    if (!fileName || !content) {
        throw new Error('file_name and content are required');
    }

    const fileMetadata = {
        name: fileName,
        ...(folderId && { parents: [folderId] }),
    };

    const media = {
        mimeType: mimeType,
        body: content,
    };

    const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, mimeType, createdTime',
    });

    return {
        success: true,
        file_id: response.data.id,
        file_name: response.data.name,
        web_view_link: response.data.webViewLink,
        mime_type: response.data.mimeType,
        created_time: response.data.createdTime,
    };
}

/**
 * Create a new folder
 */
export async function create_folder(credentials, config) {
    const drive = getDriveClient(credentials);

    const folderName = config.folder_name;
    const parentFolderId = config.parent_folder_id || null;

    if (!folderName) {
        throw new Error('folder_name is required');
    }

    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentFolderId && { parents: [parentFolderId] }),
    };

    const response = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id, name, webViewLink',
    });

    return {
        success: true,
        folder_id: response.data.id,
        folder_name: response.data.name,
        web_view_link: response.data.webViewLink,
    };
}

/**
 * Share a file or folder
 */
export async function share_file(credentials, config) {
    const drive = getDriveClient(credentials);

    const fileId = config.file_id;
    const email = config.email;
    const role = config.role || 'reader'; // reader, writer, commenter
    const type = config.type || 'user'; // user, group, domain, anyone

    if (!fileId) {
        throw new Error('file_id is required');
    }

    const permission = {
        type: type,
        role: role,
        ...(email && type === 'user' && { emailAddress: email }),
    };

    const response = await drive.permissions.create({
        fileId: fileId,
        requestBody: permission,
        fields: 'id',
    });

    // Get shareable link
    const file = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
    });

    return {
        success: true,
        file_id: fileId,
        permission_id: response.data.id,
        web_view_link: file.data.webViewLink,
        web_content_link: file.data.webContentLink,
    };
}

/**
 * List files in a folder
 */
export async function list_files(credentials, config) {
    const drive = getDriveClient(credentials);

    const folderId = config.folder_id || 'root';
    const pageSize = config.page_size || 20;

    const query = `'${folderId}' in parents and trashed = false`;

    const response = await drive.files.list({
        q: query,
        pageSize: Math.min(pageSize, 100),
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)',
        orderBy: 'modifiedTime desc',
    });

    const files = response.data.files || [];

    return {
        success: true,
        files: files.map(file => ({
            id: file.id,
            name: file.name,
            mime_type: file.mimeType,
            size: file.size,
            created_time: file.createdTime,
            modified_time: file.modifiedTime,
            web_view_link: file.webViewLink,
        })),
        count: files.length,
    };
}

/**
 * Search for files
 */
export async function search_files(credentials, config) {
    const drive = getDriveClient(credentials);

    const query = config.query;
    const pageSize = config.page_size || 20;

    if (!query) {
        throw new Error('query is required');
    }

    const searchQuery = `name contains '${query}' and trashed = false`;

    const response = await drive.files.list({
        q: searchQuery,
        pageSize: Math.min(pageSize, 100),
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)',
        orderBy: 'modifiedTime desc',
    });

    const files = response.data.files || [];

    return {
        success: true,
        files: files.map(file => ({
            id: file.id,
            name: file.name,
            mime_type: file.mimeType,
            size: file.size,
            created_time: file.createdTime,
            modified_time: file.modifiedTime,
            web_view_link: file.webViewLink,
        })),
        count: files.length,
        query: query,
    };
}

/**
 * Download file content
 */
export async function download_file(credentials, config) {
    const drive = getDriveClient(credentials);

    const fileId = config.file_id;

    if (!fileId) {
        throw new Error('file_id is required');
    }

    // Get file metadata first
    const metadata = await drive.files.get({
        fileId: fileId,
        fields: 'name, mimeType, size',
    });

    // Download file content
    const response = await drive.files.get(
        {
            fileId: fileId,
            alt: 'media',
        },
        { responseType: 'text' }
    );

    return {
        success: true,
        file_id: fileId,
        file_name: metadata.data.name,
        mime_type: metadata.data.mimeType,
        size: metadata.data.size,
        content: response.data,
    };
}

/**
 * Delete a file (move to trash)
 */
export async function delete_file(credentials, config) {
    const drive = getDriveClient(credentials);

    const fileId = config.file_id;

    if (!fileId) {
        throw new Error('file_id is required');
    }

    await drive.files.delete({
        fileId: fileId,
    });

    return {
        success: true,
        file_id: fileId,
        deleted: true,
    };
}

export const googleDriveIntegration = {
    name: 'Google Drive',
    upload_file,
    create_folder,
    share_file,
    list_files,
    search_files,
    download_file,
    delete_file,
};
