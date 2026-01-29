/**
 * Individual Webhook API
 * PUT    /api/v1/webhooks/[id] - Update webhook
 * DELETE /api/v1/webhooks/[id] - Delete webhook
 */

import { requireApiKey, apiSuccess, apiError } from '@/utils/api-auth-middleware';
import { query } from '@/utils/db';

/**
 * PUT /api/v1/webhooks/[id]
 * Update a webhook subscription
 */
export async function PUT(request, { params }) {
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;
    const webhookId = parseInt(params.id);

    try {
        const body = await request.json();
        const { url, events, description, is_active } = body;

        // Build update query dynamically
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (url !== undefined) {
            if (!url.startsWith('http')) {
                return apiError('invalid_url', 'URL must be a valid HTTP or HTTPS URL', 400);
            }
            updates.push(`url = $${paramIndex}`);
            values.push(url);
            paramIndex++;
        }

        if (events !== undefined) {
            if (!Array.isArray(events) || events.length === 0) {
                return apiError('invalid_events', 'Events must be a non-empty array', 400);
            }
            updates.push(`events = $${paramIndex}`);
            values.push(JSON.stringify(events));
            paramIndex++;
        }

        if (description !== undefined) {
            updates.push(`description = $${paramIndex}`);
            values.push(description);
            paramIndex++;
        }

        if (is_active !== undefined) {
            updates.push(`is_active = $${paramIndex}`);
            values.push(is_active);
            paramIndex++;
        }

        if (updates.length === 0) {
            return apiError('no_updates', 'No valid fields provided for update', 400);
        }

        // Add updated_at
        updates.push(`updated_at = NOW()`);

        // Add WHERE conditions
        values.push(webhookId, orgId);

        const result = await query(
            `UPDATE webhooks 
             SET ${updates.join(', ')}
             WHERE id = $${paramIndex} AND org_id = $${paramIndex + 1}
             RETURNING id, url, events, description, is_active, updated_at`,
            values
        );

        if (result.rows.length === 0) {
            return apiError('not_found', 'Webhook not found', 404);
        }

        return apiSuccess({
            webhook: result.rows[0],
            message: 'Webhook updated successfully'
        }, rateLimit);

    } catch (error) {
        console.error('API v1/webhooks PUT error:', error);
        return apiError('internal_error', 'An error occurred while updating the webhook', 500);
    }
}

/**
 * DELETE /api/v1/webhooks/[id]
 * Delete a webhook subscription
 */
export async function DELETE(request, { params }) {
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;
    const webhookId = parseInt(params.id);

    try {
        const result = await query(
            `DELETE FROM webhooks 
             WHERE id = $1 AND org_id = $2
             RETURNING id`,
            [webhookId, orgId]
        );

        if (result.rows.length === 0) {
            return apiError('not_found', 'Webhook not found', 404);
        }

        return apiSuccess({
            message: 'Webhook deleted successfully',
            id: webhookId
        }, rateLimit);

    } catch (error) {
        console.error('API v1/webhooks DELETE error:', error);
        return apiError('internal_error', 'An error occurred while deleting the webhook', 500);
    }
}
