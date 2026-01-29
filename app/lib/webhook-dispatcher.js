/**
 * Webhook Dispatcher
 * Handles sending webhook events to subscribed URLs
 */

import crypto from 'crypto';
import { query } from '@/utils/db';

/**
 * Dispatch a webhook event to all subscribers
 * 
 * @param {string} orgId - Organization UUID
 * @param {string} eventType - Event type (e.g., 'automation.completed')
 * @param {Object} payload - Event data
 * @returns {Promise<void>}
 */
export async function dispatchWebhookEvent(orgId, eventType, payload) {
    try {
        // Find all active webhooks subscribed to this event
        const result = await query(
            `SELECT id, url, secret 
             FROM webhooks
             WHERE org_id = $1 
             AND is_active = true
             AND events @> $2::jsonb`,
            [orgId, JSON.stringify([eventType])]
        );

        const webhooks = result.rows;

        if (webhooks.length === 0) {
            return; // No subscribers for this event
        }

        // Send to each webhook (in parallel)
        const deliveryPromises = webhooks.map(webhook =>
            sendWebhook(webhook.id, webhook.url, webhook.secret, eventType, payload)
        );

        await Promise.allSettled(deliveryPromises);

    } catch (error) {
        console.error('Webhook dispatch error:', error);
    }
}

/**
 * Send webhook to a single URL
 * 
 * @param {number} webhookId - Webhook ID
 * @param {string} url - Destination URL
 * @param {string} secret - Webhook secret for signature
 * @param {string} eventType - Event type
 * @param {Object} payload - Event data
 * @returns {Promise<void>}
 */
async function sendWebhook(webhookId, url, secret, eventType, payload) {
    const deliveryId = await createDeliveryRecord(webhookId, eventType, payload);

    try {
        const webhookPayload = {
            event: eventType,
            timestamp: new Date().toISOString(),
            data: payload
        };

        const signature = generateWebhookSignature(webhookPayload, secret);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Operon-Signature': signature,
                'X-Operon-Event': eventType,
                'User-Agent': 'Operon-Webhooks/1.0'
            },
            body: JSON.stringify(webhookPayload),
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        const responseBody = await response.text().catch(() => '');

        await updateDeliveryRecord(deliveryId, {
            status: response.ok ? 'success' : 'failed',
            responseCode: response.status,
            responseBody: responseBody.substring(0, 1000), // Limit to 1000 chars
            completedAt: new Date()
        });

        // Update webhook last_triggered_at
        await query(
            `UPDATE webhooks SET last_triggered_at = NOW() WHERE id = $1`,
            [webhookId]
        );

    } catch (error) {
        console.error(`Webhook delivery error (ID: ${deliveryId}):`, error);

        await updateDeliveryRecord(deliveryId, {
            status: 'failed',
            errorMessage: error.message,
            completedAt: new Date()
        });

        // Schedule retry
        await scheduleRetry(deliveryId, webhookId, url, secret, eventType, payload);
    }
}

/**
 * Generate HMAC signature for webhook payload
 * 
 * @param {Object} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {string} Signature
 */
export function generateWebhookSignature(payload, secret) {
    const payloadString = JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadString);
    return `sha256=${hmac.digest('hex')}`;
}

/**
 * Verify webhook signature
 * 
 * @param {string} signature - Signature from header
 * @param {Object} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {boolean} Valid or not
 */
export function verifyWebhookSignature(signature, payload, secret) {
    const expectedSignature = generateWebhookSignature(payload, secret);
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * Create a webhook delivery record
 * 
 * @param {number} webhookId - Webhook ID
 * @param {string} eventType - Event type
 * @param {Object} payload - Event data
 * @returns {Promise<number>} Delivery ID
 */
async function createDeliveryRecord(webhookId, eventType, payload) {
    const result = await query(
        `INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status, attempts)
         VALUES ($1, $2, $3, 'pending', 0)
         RETURNING id`,
        [webhookId, eventType, JSON.stringify(payload)]
    );

    return result.rows[0].id;
}

/**
 * Update a webhook delivery record
 * 
 * @param {number} deliveryId - Delivery ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
async function updateDeliveryRecord(deliveryId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${snakeKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
    }

    if (fields.length === 0) return;

    values.push(deliveryId);

    await query(
        `UPDATE webhook_deliveries SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
        values
    );
}

/**
 * Schedule a retry for a failed webhook
 * Uses exponential backoff: 1min, 5min, 30min
 * 
 * @param {number} deliveryId - Delivery ID
 * @param {number} webhookId - Webhook ID
 * @param {string} url - Destination URL
 * @param {string} secret - Webhook secret
 * @param {string} eventType - Event type
 * @param {Object} payload - Event data
 * @returns {Promise<void>}
 */
async function scheduleRetry(deliveryId, webhookId, url, secret, eventType, payload) {
    // Get current attempt count
    const result = await query(
        `SELECT attempts FROM webhook_deliveries WHERE id = $1`,
        [deliveryId]
    );

    const attempts = result.rows[0]?.attempts || 0;

    if (attempts >= 3) {
        // Max retries reached
        return;
    }

    // Calculate next retry time with exponential backoff
    const delays = [60, 300, 1800]; // 1min, 5min, 30min in seconds
    const delaySeconds = delays[attempts] || 1800;

    const nextRetry = new Date();
    nextRetry.setSeconds(nextRetry.getSeconds() + delaySeconds);

    await query(
        `UPDATE webhook_deliveries 
         SET attempts = attempts + 1, next_retry_at = $1
         WHERE id = $2`,
        [nextRetry, deliveryId]
    );

    // In a production environment, you'd want to use a job queue like Bull or similar
    console.log(`Scheduled retry for delivery ${deliveryId} at ${nextRetry.toISOString()}`);
}

/**
 * Process pending webhook retries
 * Should be called periodically (e.g., every minute via cron)
 * 
 * @returns {Promise<void>}
 */
export async function processWebhookRetries() {
    try {
        const result = await query(
            `SELECT wd.id, wd.webhook_id, wd.event_type, wd.payload, w.url, w.secret
             FROM webhook_deliveries wd
             JOIN webhooks w ON w.id = wd.webhook_id
             WHERE wd.status = 'pending' 
             AND wd.next_retry_at <= NOW()
             AND wd.attempts < 3
             LIMIT 100`
        );

        const retries = result.rows;

        for (const retry of retries) {
            await sendWebhook(
                retry.webhook_id,
                retry.url,
                retry.secret,
                retry.event_type,
                retry.payload
            );
        }

    } catch (error) {
        console.error('Webhook retry processing error:', error);
    }
}

/**
 * Create a webhook secret
 * 
 * @returns {string} Random secret
 */
export function generateWebhookSecret() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Test a webhook by sending a test event
 * 
 * @param {number} webhookId - Webhook ID
 * @returns {Promise<Object>} Test result
 */
export async function testWebhook(webhookId) {
    try {
        const result = await query(
            `SELECT url, secret FROM webhooks WHERE id = $1`,
            [webhookId]
        );

        if (result.rows.length === 0) {
            throw new Error('Webhook not found');
        }

        const { url, secret } = result.rows[0];

        const testPayload = {
            event: 'test.webhook',
            timestamp: new Date().toISOString(),
            data: {
                message: 'This is a test webhook from Operon',
                webhookId
            }
        };

        const signature = generateWebhookSignature(testPayload, secret);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Operon-Signature': signature,
                'X-Operon-Event': 'test.webhook',
                'User-Agent': 'Operon-Webhooks/1.0'
            },
            body: JSON.stringify(testPayload),
            signal: AbortSignal.timeout(10000)
        });

        const responseBody = await response.text().catch(() => '');

        return {
            success: response.ok,
            statusCode: response.status,
            responseBody: responseBody.substring(0, 500)
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
