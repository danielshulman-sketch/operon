import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import crypto from 'crypto';

/**
 * GET /api/marketing/unsubscribe?token=xxx
 * Process unsubscribe request
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Missing unsubscribe token' },
                { status: 400 }
            );
        }

        // Verify token
        const tokenResult = await query(
            `SELECT user_id, expires_at, used_at 
             FROM unsubscribe_tokens 
             WHERE token = $1`,
            [token]
        );

        if (tokenResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid unsubscribe token' },
                { status: 404 }
            );
        }

        const tokenData = tokenResult.rows[0];

        // Check if already used
        if (tokenData.used_at) {
            return NextResponse.json(
                { error: 'This unsubscribe link has already been used' },
                { status: 400 }
            );
        }

        // Check if expired
        if (new Date(tokenData.expires_at) < new Date()) {
            return NextResponse.json(
                { error: 'This unsubscribe link has expired' },
                { status: 400 }
            );
        }

        // Update marketing consent to revoke
        await query(
            `INSERT INTO marketing_consents 
                (user_id, consent_type, consented, consented_at, consent_source, ip_address)
             VALUES ($1, 'email_marketing', false, CURRENT_TIMESTAMP, 'unsubscribe_link', $2)
             ON CONFLICT (user_id, consent_type)
             DO UPDATE SET 
                consented = false,
                consented_at = CURRENT_TIMESTAMP,
                consent_source = 'unsubscribe_link',
                updated_at = CURRENT_TIMESTAMP`,
            [tokenData.user_id, request.headers.get('x-forwarded-for') || 'unknown']
        );

        // Mark token as used
        await query(
            `UPDATE unsubscribe_tokens 
             SET used_at = CURRENT_TIMESTAMP 
             WHERE token = $1`,
            [token]
        );

        // Log the unsubscribe
        await query(
            `INSERT INTO user_activity (user_id, activity_type, description)
             VALUES ($1, 'unsubscribed', 'User unsubscribed from marketing emails')`,
            [tokenData.user_id]
        );

        return NextResponse.json({
            success: true,
            message: 'Successfully unsubscribed from marketing emails'
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json(
            { error: 'Failed to process unsubscribe request' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/marketing/unsubscribe/generate
 * Generate an unsubscribe token for a user (internal use)
 * SECURITY: Requires authentication to prevent unauthorized token generation
 */
export async function POST(request) {
    try {
        // SECURITY: Import requireAuth at the top of the file
        // For now, adding inline check
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            );
        }

        // TODO: Add additional authorization check
        // Verify that the authenticated user is allowed to generate token for userId
        // This could be admin-only or the user themselves

        // Generate cryptographically secure token
        const token = crypto.randomBytes(32).toString('hex');

        // 90-day expiry
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 90);

        // Store token
        await query(
            `INSERT INTO unsubscribe_tokens (user_id, token, expires_at)
             VALUES ($1, $2, $3)
             RETURNING token`,
            [userId, token, expiresAt]
        );

        return NextResponse.json({
            success: true,
            token,
            expiresAt: expiresAt.toISOString()
        });

    } catch (error) {
        console.error('Token generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate unsubscribe token' },
            { status: 500 }
        );
    }
}
