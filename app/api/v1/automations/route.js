/**
 * GET /api/v1/automations
 * List automations for the organization
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
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Max 100
        const isActive = searchParams.get('is_active');

        const offset = (page - 1) * limit;

        // Build query
        let queryText = `
            SELECT 
                id, name, description, trigger_type, trigger_config, 
                steps, is_active, created_at, updated_at
            FROM workflow_definitions
            WHERE org_id = $1
        `;
        const params = [orgId];
        let paramIndex = 2;

        // Add filters
        if (isActive !== null && isActive !== undefined) {
            queryText += ` AND is_active = $${paramIndex}`;
            params.push(isActive === 'true');
            paramIndex++;
        }

        queryText += ` ORDER BY updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        // Execute query
        const result = await query(queryText, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) as total FROM workflow_definitions WHERE org_id = $1`;
        const countParams = [orgId];

        if (isActive !== null && isActive !== undefined) {
            countQuery += ` AND is_active = $2`;
            countParams.push(isActive === 'true');
        }

        const countResult = await query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        return apiSuccess({
            automations: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: (page * limit) < total
            }
        }, rateLimit);

    } catch (error) {
        console.error('API v1/automations error:', error);
        return apiError(
            'internal_error',
            'An error occurred while fetching automations',
            500
        );
    }
}
