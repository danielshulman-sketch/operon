/**
 * Webhooks API
 * GET  /api/v1/webhooks - List webhook subscriptions
 * POST /api/v1/webhooks - Create webhook subscription
 */

import { requireApiKey, apiSuccess, apiError } from '@/utils/api-auth-middleware';
import { query } from '@/utils/db';
import { generateWebhookSecret } from '@/lib/webhook-dispatcher';

/**
 * GET /api/v1/webhooks
 * List all webhook subscriptions for the organization
 */
export async function GET(request) {
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;

    try {
        const result = await query(
            `SELECT 
                id, url, events, description, is_active, 
                last_triggered_at, created_at, updated_at
             FROM webhooks
             WHERE org_id = $1
             ORDER BY created_at DESC`,
            [orgId]
        );

        // Don't expose the secret in the list
        const webhooks = result.rows.map(row => ({
            ...row,
            secret: undefined // Remove secret from response
        }));

        return apiSuccess({
            webhooks,
            total: webhooks.length
        }, rateLimit);

    } catch (error) {
        console.error('API v1/webhooks GET error:', error);
        return apiError(
            'internal_error',
            'An error occurred while fetching webhooks',
            500
        );
    }
}

/**
 * POST /api/v1/webhooks
 * Create a new webhook subscription
 */
export async function POST(request) {
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;

    try {
        const body = await request.json();
        const { url, events, description } = body;

        // Validation
        if (!url || !url.startsWith('http')) {
            return apiError(
                'invalid_url',
                'URL must be a valid HTTP or HTTPS URL',
                400
            );
        }

        if (!events || !Array.isArray(events) || events.length === 0) {
            return apiError(
                'invalid_events',
                'Events must be a non-empty array of event types',
                400
            );
        }

        // Valid event types
        const validEvents = [
            'automation.created',
            'automation.completed',
            'automation.failed',
            'email.received',
            'email.sent',
            'task.created',
            'task.completed',
            'task.updated',
            'integration.connected',
            'integration.disconnected'
        ];

        const invalidEvents = events.filter(e => !validEvents.includes(e));
        if (invalidEvents.length > 0) {
            return apiError(
                'invalid_events',
                `Invalid event types: ${invalidEvents.join(', ')}. Valid events: ${validEvents.join(', ')}`,
                400
            );
        }

        // Generate webhook secret
        const secret = generateWebhookSecret();

        // Create webhook
        const result = await query(
            `INSERT INTO webhooks (org_id, url, events, description, secret)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, url, events, description, secret, is_active, created_at`,
            [orgId, url, JSON.stringify(events), description || null, secret]
        );

        const webhook = result.rows[0];

        return apiSuccess({
            webhook: {
                id: webhook.id,
                url: webhook.url,
                events: webhook.events,
                description: webhook.description,
                secret: webhook.secret, // Only returned on creation
                isActive: webhook.is_active,
                createdAt: webhook.created_at
            },
            message: 'Webhook created successfully. Save the secret - it will not be shown again.'
        }, rateLimit);

    } catch (error) {
        console.error('API v1/webhooks POST error:', error);
        return apiError(
            'internal_error',
            'An error occurred while creating the webhook',
            500
        );
    }
}
