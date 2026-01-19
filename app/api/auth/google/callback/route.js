import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { generateToken } from '@/utils/auth';
import { encrypt } from '@/app/lib/automation/encryption';
import { ensureIntegrationCredentialsTable } from '@/utils/ensure-integration-credentials';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/?error=google_auth_failed`
            );
        }

        if (!code) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/?error=missing_code`
            );
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
                grant_type: 'authorization_code'
            })
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for tokens');
        }

        const tokens = await tokenResponse.json();

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });

        if (!userInfoResponse.ok) {
            throw new Error('Failed to fetch user info');
        }

        const googleUser = await userInfoResponse.json();

        // Check if user exists by email
        const existingUser = await query(
            'SELECT u.id, u.email, om.org_id FROM users u LEFT JOIN org_members om ON u.id = om.user_id WHERE u.email = $1 LIMIT 1',
            [googleUser.email]
        );

        let userId, orgId;

        if (existingUser.rows.length > 0) {
            // User exists - link Google account
            userId = existingUser.rows[0].id;
            orgId = existingUser.rows[0].org_id;

            // Insert or update Google auth account
            await query(
                `INSERT INTO auth_accounts (user_id, provider, provider_user_id, credentials)
                 VALUES ($1, 'google', $2, $3)
                 ON CONFLICT (user_id, provider) DO UPDATE SET
                   provider_user_id = $2,
                   credentials = $3`,
                [userId, googleUser.id, JSON.stringify({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    scope: tokens.scope,
                    token_type: tokens.token_type || 'Bearer'
                })]
            );
        } else {
            // New user - create account and organization
            const newOrgResult = await query(
                `INSERT INTO organizations (name) VALUES ($1) RETURNING id`,
                [`${googleUser.given_name || googleUser.email}'s Organization`]
            );
            orgId = newOrgResult.rows[0].id;

            const newUserResult = await query(
                `INSERT INTO users (email, first_name, last_name) 
                 VALUES ($1, $2, $3) 
                 RETURNING id`,
                [googleUser.email, googleUser.given_name || '', googleUser.family_name || '']
            );
            userId = newUserResult.rows[0].id;

            // Create Google auth account
            await query(
                `INSERT INTO auth_accounts (user_id, provider, provider_user_id, credentials)
                 VALUES ($1, 'google', $2, $3)`,
                [userId, googleUser.id, JSON.stringify({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    scope: tokens.scope,
                    token_type: tokens.token_type || 'Bearer'
                })]
            );

            // Add user to organization as admin
            await query(
                `INSERT INTO org_members (org_id, user_id, role, is_admin, is_active)
                 VALUES ($1, $2, 'admin', true, true)`,
                [orgId, userId]
            );

            // Log activity
            await query(
                `INSERT INTO user_activity (org_id, user_id, activity_type, description)
                 VALUES ($1, $2, 'user_signup', $3)`,
                [orgId, userId, `User ${googleUser.email} signed up via Google`]
            );
        }

        // Generate JWT token
        const token = generateToken({ userId, orgId });

        // Auto-connect Google integrations (Gmail, Drive, Docs, Sheets, Calendar)
        try {
            await ensureIntegrationCredentialsTable();

            const googleIntegrations = [
                'gmail',
                'google_drive',
                'google_docs',
                'google_sheets',
                'google_calendar'
            ];

            const integrationCredentials = {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                token_type: 'Bearer',
                scope: tokens.scope,
                expiry_date: Date.now() + 3600000 // 1 hour from now
            };

            // Encrypt credentials
            const encryptedCreds = encrypt(JSON.stringify(integrationCredentials));

            for (const integration of googleIntegrations) {
                await query(
                    `INSERT INTO integration_credentials (org_id, integration_name, credentials, created_at, updated_at)
                     VALUES ($1, $2, $3, NOW(), NOW())
                     ON CONFLICT (org_id, integration_name) DO UPDATE SET
                       credentials = $3,
                       updated_at = NOW()`,
                    [orgId, integration, encryptedCreds]
                );
            }

            console.log(`Auto-connected ${googleIntegrations.length} Google integrations for user ${userId}`);
        } catch (integrationError) {
            // Don't fail the login if integration setup fails
            console.error('Failed to auto-connect integrations:', integrationError);
        }


        // Redirect to app with token
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/?token=${token}&google_auth=success`
        );
    } catch (error) {
        console.error('Google callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/?error=google_auth_error&details=${encodeURIComponent(error.message)}`
        );
    }
}
