/**
 * GET /api/v1/user
 * Get current user information based on API key
 */

import { requireApiKey, apiSuccess, apiError } from '@/utils/api-auth-middleware';
import { query } from '@/utils/db';

export async function GET(request) {
    // Authenticate request
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;

    try {
        // Get organization info
        const result = await query(
            `SELECT id, name, created_at 
             FROM organizations 
             WHERE id = $1`,
            [orgId]
        );

        if (result.rows.length === 0) {
            return apiError('not_found', 'Organization not found', 404);
        }

        const org = result.rows[0];

        // Get organization users count
        const usersResult = await query(
            `SELECT COUNT(*) as user_count 
             FROM users 
             WHERE org_id = $1 AND is_active = true`,
            [orgId]
        );

        return apiSuccess({
            organization: {
                id: org.id,
                name: org.name,
                createdAt: org.created_at,
                userCount: parseInt(usersResult.rows[0].user_count)
            }
        }, rateLimit);

    } catch (error) {
        console.error('API v1/user error:', error);
        return apiError(
            'internal_error',
            'An error occurred while fetching user information',
            500
        );
    }
}
