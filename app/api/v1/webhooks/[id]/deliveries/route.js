/**
 * GET /api/v1/webhooks/[id]/deliveries
 * View webhook delivery logs
 */

import { requireApiKey, apiSuccess, apiError } from '@/utils/api-auth-middleware';
import { query } from '@/utils/db';

export async function GET(request, { params }) {
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;
    const webhookId = parseInt(params.id);

    try {
        // Verify webhook belongs to org
        const webhookResult = await query(
            `SELECT id FROM webhooks WHERE id = $1 AND org_id = $2`,
            [webhookId, orgId]
        );

        if (webhookResult.rows.length === 0) {
            return apiError('not_found', 'Webhook not found', 404);
        }

        // Get pagination params
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const offset = (page - 1) * limit;

        // Get deliveries
        const result = await query(
            `SELECT 
                id, event_type, status, response_code, 
                error_message, attempts, created_at, completed_at
             FROM webhook_deliveries
             WHERE webhook_id = $1
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [webhookId, limit, offset]
        );

        // Get total count
        const countResult = await query(
            `SELECT COUNT(*) as total FROM webhook_deliveries WHERE webhook_id = $1`,
            [webhookId]
        );

        const total = parseInt(countResult.rows[0].total);

        return apiSuccess({
            deliveries: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: (page * limit) < total
            }
        }, rateLimit);

    } catch (error) {
        console.error('API v1/webhooks deliveries error:', error);
        return apiError('internal_error', 'An error occurred while fetching delivery logs', 500);
    }
}
