/**
 * GET /api/v1/emails
 * List emails for the organization
 */

import { requireApiKey, apiSuccess, apiError } from '@/utils/api-auth-middleware';
import { query } from '@/utils/db';

export async function GET(request) {
    // Authenticate request
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;

    try {
        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const folder = searchParams.get('folder') || 'inbox';
        const mailboxId = searchParams.get('mailbox_id');

        const offset = (page - 1) * limit;

        // Build query
        let queryText = `
            SELECT 
                e.id, e.mailbox_id, e.message_id, e.subject, 
                e.from_address, e.to_address, e.cc_address, 
                e.date, e.folder, e.is_read, e.has_attachments,
                e.created_at
            FROM emails e
            JOIN mailboxes m ON m.id = e.mailbox_id
            WHERE m.org_id = $1
        `;
        const params = [orgId];
        let paramIndex = 2;

        // Add folder filter
        if (folder) {
            queryText += ` AND e.folder = $${paramIndex}`;
            params.push(folder);
            paramIndex++;
        }

        // Add mailbox filter
        if (mailboxId) {
            queryText += ` AND e.mailbox_id = $${paramIndex}`;
            params.push(parseInt(mailboxId));
            paramIndex++;
        }

        queryText += ` ORDER BY e.date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        // Execute query
        const result = await query(queryText, params);

        // Get total count
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM emails e
            JOIN mailboxes m ON m.id = e.mailbox_id
            WHERE m.org_id = $1
        `;
        const countParams = [orgId];
        let countParamIndex = 2;

        if (folder) {
            countQuery += ` AND e.folder = $${countParamIndex}`;
            countParams.push(folder);
            countParamIndex++;
        }

        if (mailboxId) {
            countQuery += ` AND e.mailbox_id = $${countParamIndex}`;
            countParams.push(parseInt(mailboxId));
        }

        const countResult = await query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        return apiSuccess({
            emails: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: (page * limit) < total
            }
        }, rateLimit);

    } catch (error) {
        console.error('API v1/emails error:', error);
        return apiError(
            'internal_error',
            'An error occurred while fetching emails',
            500
        );
    }
}
