import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { requireAuth } from '@/utils/auth';
import { encrypt } from '@/lib/automation/encryption';
import { ensureIntegrationCredentialsTable } from '@/utils/ensure-integration-credentials';

export const dynamic = 'force-dynamic';

/**
 * Connect all Google services using existing Google authentication
 * GET /api/integrations/google/connect-all
 */
export async function GET(request) {
    try {
        // Ensure table exists
        await ensureIntegrationCredentialsTable();

        // Verify authentication
        const user = await requireAuth(request);

        // Check if user has Google authentication
        const authResult = await query(
            `SELECT access_token, refresh_token FROM auth_accounts 
             WHERE user_id = $1 AND provider = 'google' LIMIT 1`,
            [user.id]
        );

        if (authResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'No Google account linked. Please sign in with Google first.' },
                { status: 400 }
            );
        }

        const { access_token, refresh_token } = authResult.rows[0];

        // Auto-connect all Google integrations
        const googleIntegrations = [
            'gmail',
            'google_drive',
            'google_docs',
            'google_sheets',
            'google_calendar'
        ];

        const integrationCredentials = {
            access_token,
            refresh_token,
            token_type: 'Bearer',
            expiry_date: Date.now() + 3600000 // 1 hour from now
        };

        // Encrypt credentials
        const encryptedCreds = encrypt(JSON.stringify(integrationCredentials));

        let connectedCount = 0;

        for (const integration of googleIntegrations) {
            try {
                await query(
                    `INSERT INTO integration_credentials (org_id, integration_name, credentials, created_at, updated_at)
                     VALUES ($1, $2, $3, NOW(), NOW())
                     ON CONFLICT (org_id, integration_name) DO UPDATE SET
                       credentials = $3,
                       updated_at = NOW()`,
                    [user.org_id, integration, encryptedCreds]
                );
                connectedCount++;
            } catch (err) {
                console.error(`Failed to connect ${integration}:`, err);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully connected ${connectedCount} Google services`,
            connected: googleIntegrations,
            count: connectedCount
        });

    } catch (error) {
        console.error('Error connecting Google services:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Failed to connect Google services', details: error.message },
            { status: 500 }
        );
    }
}
