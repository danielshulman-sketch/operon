import { NextResponse } from 'next/server';
import { requireAuth } from '@/utils/auth';
import { query } from '@/utils/db';

/**
 * POST /api/marketing/consent
 * Record or update marketing consent for a user
 */
export async function POST(request) {
    try {
        const user = await requireAuth(request);
        const body = await request.json();

        const { consentType, consented, source } = body;

        // Validate input
        if (!consentType || typeof consented !== 'boolean') {
            return NextResponse.json(
                { error: 'Missing required fields: consentType, consented' },
                { status: 400 }
            );
        }

        // Get IP address and user agent for audit trail
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Insert or update consent
        const result = await query(
            `INSERT INTO marketing_consents 
                (user_id, consent_type, consented, consented_at, consent_source, ip_address, user_agent)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)
             ON CONFLICT (user_id, consent_type)
             DO UPDATE SET 
                consented = $3,
                consented_at = CURRENT_TIMESTAMP,
                consent_source = $4,
                ip_address = $5,
                user_agent = $6,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [user.id, consentType, consented, source || 'api', ip, userAgent]
        );

        // Log the consent change
        await query(
            `INSERT INTO user_activity (org_id, user_id, activity_type, description)
             VALUES ($1, $2, 'marketing_consent_changed', $3)`,
            [
                user.org_id,
                user.id,
                `Marketing consent (${consentType}) ${consented ? 'granted' : 'revoked'} via ${source || 'api'}`
            ]
        );

        return NextResponse.json({
            success: true,
            consent: result.rows[0]
        });

    } catch (error) {
        console.error('Marketing consent error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update consent' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

/**
 * GET /api/marketing/consent
 * Get user's current marketing consent status
 */
export async function GET(request) {
    try {
        const user = await requireAuth(request);

        const result = await query(
            `SELECT consent_type, consented, consented_at, consent_source, updated_at
             FROM marketing_consents
             WHERE user_id = $1
             ORDER BY consent_type`,
            [user.id]
        );

        return NextResponse.json({
            consents: result.rows
        });

    } catch (error) {
        console.error('Get consent error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get consent' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
