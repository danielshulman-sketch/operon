/**
 * POST /api/v1/webhooks/[id]/test
 * Send a test webhook event
 */

import { requireApiKey, apiSuccess, apiError } from '@/utils/api-auth-middleware';
import { query } from '@/utils/db';
import { testWebhook } from '@/lib/webhook-dispatcher';

export async function POST(request, { params }) {
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;
    const webhookId = parseInt(params.id);

    try {
        // Verify webhook belongs to org
        const result = await query(
            `SELECT id FROM webhooks WHERE id = $1 AND org_id = $2`,
            [webhookId, orgId]
        );

        if (result.rows.length === 0) {
            return apiError('not_found', 'Webhook not found', 404);
        }

        // Send test webhook
        const testResult = await testWebhook(webhookId);

        if (testResult.success) {
            return apiSuccess({
                message: 'Test webhook sent successfully',
                statusCode: testResult.statusCode,
                responseBody: testResult.responseBody
            }, rateLimit);
        } else {
            return apiError(
                'test_failed',
                `Test webhook failed: ${testResult.error}`,
                400,
                { details: testResult }
            );
        }

    } catch (error) {
        console.error('API v1/webhooks test error:', error);
        return apiError('internal_error', 'An error occurred while testing the webhook', 500);
    }
}
