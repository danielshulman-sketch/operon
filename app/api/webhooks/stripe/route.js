import { NextResponse } from 'next/server';
import { query, getClient } from '@/utils/db';

/**
 * POST /api/webhooks/stripe
 * Webhook endpoint to receive Stripe payment events
 * 
 * SECURITY: Webhook signature verification is CRITICAL to prevent forged payment events
 * Setup instructions:
 * 1. Install Stripe SDK: npm install stripe
 * 2. Get webhook secret from Stripe Dashboard → Developers → Webhooks
 * 3. Add STRIPE_WEBHOOK_SECRET to environment variables
 */
export async function POST(request) {
    try {
        // SECURITY FIX: Verify webhook signature
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        // Check if Stripe is configured
        if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
            console.error('Stripe not configured - missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
            return NextResponse.json(
                { error: 'Stripe not configured' },
                { status: 500 }
            );
        }

        // Verify the signature
        // NOTE: To enable this, you need to:
        // 1. npm install stripe
        // 2. Uncomment the code below
        // 3. Add STRIPE_WEBHOOK_SECRET to your environment variables

        /*
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        let event;
        
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }
        */

        // TEMPORARY: Parse event without verification (INSECURE - for testing only)
        // TODO: Remove this and use the verified event above
        const event = JSON.parse(body);

        console.log('Stripe webhook event:', event.type);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;

            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Stripe webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutSessionCompleted(session) {
    const client = await getClient();

    try {
        // Store payment confirmation
        await client.query(
            `INSERT INTO payment_confirmations 
             (session_id, payment_status, amount, currency, customer_email, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (session_id) DO UPDATE 
             SET payment_status = EXCLUDED.payment_status, updated_at = NOW()`,
            [
                session.id,
                session.payment_status,
                session.amount_total / 100,
                session.currency,
                session.customer_email || session.customer_details?.email
            ]
        );

        // Find and update any workflow runs waiting for this payment
        const result = await client.query(
            `SELECT id, workflow_id, org_id, trigger_data 
             FROM workflow_runs 
             WHERE trigger_data::jsonb @> $1
             AND status = 'pending_payment'`,
            [JSON.stringify({ payment_session_id: session.id })]
        );

        for (const run of result.rows) {
            // Update run status and continue execution if needed
            await client.query(
                `UPDATE workflow_runs 
                 SET status = 'running',
                     trigger_data = trigger_data::jsonb || $1
                 WHERE id = $2`,
                [
                    JSON.stringify({ payment_confirmed: true, payment_amount: session.amount_total / 100 }),
                    run.id
                ]
            );

            console.log(`Payment confirmed for workflow run ${run.id}, resuming execution`);
            // In a real implementation, you might want to resume workflow execution here
        }

    } finally {
        client.release();
    }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
    const client = await getClient();

    try {
        await client.query(
            `INSERT INTO payment_confirmations 
             (payment_intent_id, payment_status, amount, currency, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (payment_intent_id) DO UPDATE 
             SET payment_status = EXCLUDED.payment_status, updated_at = NOW()`,
            [
                paymentIntent.id,
                paymentIntent.status,
                paymentIntent.amount / 100,
                paymentIntent.currency
            ]
        );

        console.log(`Payment intent ${paymentIntent.id} succeeded`);

    } finally {
        client.release();
    }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent) {
    const client = await getClient();

    try {
        // Find workflow runs associated with this payment
        const result = await client.query(
            `SELECT id FROM workflow_runs 
             WHERE trigger_data::jsonb @> $1
             AND status IN ('running', 'pending_payment')`,
            [JSON.stringify({ payment_intent_id: paymentIntent.id })]
        );

        for (const run of result.rows) {
            await client.query(
                `UPDATE workflow_runs 
                 SET status = 'failed',
                     error_message = 'Payment failed',
                     completed_at = NOW()
                 WHERE id = $1`,
                [run.id]
            );
        }

        console.log(`Payment intent ${paymentIntent.id} failed`);

    } finally {
        client.release();
    }
}

/**
 * GET /api/webhooks/stripe
 * Return webhook information
 */
export async function GET() {
    return NextResponse.json({
        message: 'Stripe webhook endpoint',
        usage: 'Configure this URL in your Stripe Dashboard under Webhooks',
        events: [
            'checkout.session.completed',
            'payment_intent.succeeded',
            'payment_intent.payment_failed'
        ]
    });
}
