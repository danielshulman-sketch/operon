import { NextResponse } from 'next/server';
import { query, getClient } from '@/utils/db';
import { executeAutomation } from '@/app/lib/automation/engine';

/**
 * POST /api/webhooks/forms
 * Webhook endpoint to receive form submissions and trigger automations
 */
export async function POST(request) {
    try {
        const formData = await request.json();

        // Extract webhook token or form ID from headers or body
        const webhookToken = request.headers.get('x-webhook-token') || formData.webhook_token;
        const formId = formData.form_id;

        if (!webhookToken && !formId) {
            return NextResponse.json(
                { error: 'Missing webhook token or form ID' },
                { status: 400 }
            );
        }

        const client = await getClient();
        try {
            // Find matching automation
            let automation;

            if (webhookToken) {
                // Find automation by webhook token stored in trigger_config
                const result = await client.query(
                    `SELECT id, org_id, name, steps, trigger_config 
                     FROM workflow_definitions 
                     WHERE trigger_type = 'form_received' 
                     AND is_active = true 
                     AND trigger_config->>'webhook_token' = $1`,
                    [webhookToken]
                );
                automation = result.rows[0];
            } else if (formId) {
                // Find automation by form ID
                const result = await client.query(
                    `SELECT id, org_id, name, steps, trigger_config 
                     FROM workflow_definitions 
                     WHERE trigger_type = 'form_received' 
                     AND is_active = true 
                     AND trigger_config->>'form_id' = $1`,
                    [formId]
                );
                automation = result.rows[0];
            }

            if (!automation) {
                return NextResponse.json(
                    { error: 'No matching automation found' },
                    { status: 404 }
                );
            }

            // Create workflow run
            const runResult = await client.query(
                `INSERT INTO workflow_runs 
                 (workflow_id, org_id, trigger_data, status, started_at)
                 VALUES ($1, $2, $3, 'running', NOW())
                 RETURNING id`,
                [automation.id, automation.org_id, JSON.stringify({ form: formData })]
            );

            const runId = runResult.rows[0].id;

            // Execute automation asynchronously
            executeAutomation(runId, automation, { form: formData }, automation.org_id)
                .catch(error => {
                    console.error(`Form webhook automation ${automation.id} failed:`, error);
                });

            return NextResponse.json({
                success: true,
                message: 'Form submission received and automation triggered',
                automation_id: automation.id,
                run_id: runId
            });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Form webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * GET /api/webhooks/forms
 * Return webhook information
 */
export async function GET(request) {
    return NextResponse.json({
        message: 'Form webhook endpoint',
        usage: 'POST to this endpoint with form data. Include x-webhook-token header or webhook_token in body.',
        example: {
            webhook_token: 'your-webhook-token',
            form_id: 'optional-form-id',
            name: 'John Doe',
            email: 'john@example.com',
            date: '2026-01-15T10:00:00Z',
            service: 'Consultation',
            // ... any other form fields
        }
    });
}
