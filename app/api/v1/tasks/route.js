/**
 * GET /api/v1/tasks
 * List tasks for the organization
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
        const status = searchParams.get('status'); // 'pending', 'in_progress', 'completed'

        const offset = (page - 1) * limit;

        // Build query
        let queryText = `
            SELECT 
                id, title, description, status, priority, 
                due_date, assigned_to, created_by, 
                created_at, updated_at, completed_at
            FROM tasks
            WHERE org_id = $1
        `;
        const params = [orgId];
        let paramIndex = 2;

        // Add status filter
        if (status) {
            queryText += ` AND status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        // Execute query
        const result = await query(queryText, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) as total FROM tasks WHERE org_id = $1`;
        const countParams = [orgId];

        if (status) {
            countQuery += ` AND status = $2`;
            countParams.push(status);
        }

        const countResult = await query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        return apiSuccess({
            tasks: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: (page * limit) < total
            }
        }, rateLimit);

    } catch (error) {
        console.error('API v1/tasks error:', error);
        return apiError(
            'internal_error',
            'An error occurred while fetching tasks',
            500
        );
    }
}
