import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/utils/db';
import { generateToken } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const stateParam = searchParams.get('state');
        const error = searchParams.get('error');

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        // Handle OAuth errors (user denied access, etc.)
        if (error) {
            return NextResponse.redirect(
                `${appUrl}/account/signin?error=${encodeURIComponent('Google sign-in was cancelled')}`
            );
        }

        if (!code || !stateParam) {
            return NextResponse.redirect(
                `${appUrl}/account/signin?error=${encodeURIComponent('Invalid OAuth response')}`
            );
        }

        // Verify state to prevent CSRF
        const cookieStore = cookies();
        const stateCookie = cookieStore.get('google_oauth_state')?.value;

        if (!stateCookie || stateCookie !== stateParam) {
            return NextResponse.redirect(
                `${appUrl}/account/signin?error=${encodeURIComponent('Invalid state - please try again')}`
            );
        }

        // Clear state cookie
        cookieStore.set('google_oauth_state', '', { maxAge: 0, path: '/' });

        // Exchange code for tokens
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
        const redirectUri = `${appUrl}/api/auth/google/callback`;

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('Token exchange error:', tokenData);
            return NextResponse.redirect(
                `${appUrl}/account/signin?error=${encodeURIComponent('Failed to exchange OAuth code')}`
            );
        }

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userInfo = await userInfoResponse.json();

        if (!userInfo.email) {
            return NextResponse.redirect(
                `${appUrl}/account/signin?error=${encodeURIComponent('Could not retrieve email from Google')}`
            );
        }

        // Check if user exists
        let userResult = await query(
            `SELECT u.*, om.org_id, om.role, om.is_admin, om.is_active,
                    COALESCE(u.is_superadmin, false) as is_superadmin
             FROM users u
             JOIN org_members om ON u.id = om.user_id
             WHERE u.email = $1 AND om.is_active = true
             LIMIT 1`,
            [userInfo.email]
        );

        let user;
        let orgId;

        if (userResult.rows.length > 0) {
            // Existing user
            user = userResult.rows[0];
            orgId = user.org_id;

            // Update user info if changed
            await query(
                `UPDATE users 
                 SET first_name = COALESCE($2, first_name),
                     last_name = COALESCE($3, last_name),
                     updated_at = NOW()
                 WHERE id = $1`,
                [user.id, userInfo.given_name, userInfo.family_name]
            );

            // Ensure auth_account exists for Google
            await query(
                `INSERT INTO auth_accounts (user_id, provider, provider_user_id, created_at)
                 VALUES ($1, 'google', $2, NOW())
                 ON CONFLICT (user_id, provider) DO NOTHING`,
                [user.id, userInfo.id]
            );
        } else {
            // New user - need to create user and assign to an org
            // First, get the first available org or handle appropriately
            const orgsResult = await query(
                `SELECT id FROM organizations ORDER BY created_at LIMIT 1`
            );

            if (orgsResult.rows.length === 0) {
                // No organizations exist - create one
                const newOrgResult = await query(
                    `INSERT INTO organizations (name, created_at, updated_at)
                     VALUES ($1, NOW(), NOW())
                     RETURNING id`,
                    [userInfo.email.split('@')[1] || 'Default Organization']
                );
                orgId = newOrgResult.rows[0].id;
            } else {
                orgId = orgsResult.rows[0].id;
            }

            // Create user
            const newUserResult = await query(
                `INSERT INTO users (email, first_name, last_name, created_at, updated_at)
                 VALUES ($1, $2, $3, NOW(), NOW())
                 RETURNING id`,
                [userInfo.email, userInfo.given_name || '', userInfo.family_name || '']
            );

            const userId = newUserResult.rows[0].id;

            // Create auth_account
            await query(
                `INSERT INTO auth_accounts (user_id, provider, provider_user_id, created_at)
                 VALUES ($1, 'google', $2, NOW())`,
                [userId, userInfo.id]
            );

            // Add user to organization
            await query(
                `INSERT INTO org_members (org_id, user_id, role, is_admin, is_active, created_at, updated_at)
                 VALUES ($1, $2, 'member', false, true, NOW(), NOW())`,
                [orgId, userId]
            );

            // Fetch the complete user record
            userResult = await query(
                `SELECT u.*, om.org_id, om.role, om.is_admin, om.is_active,
                        COALESCE(u.is_superadmin, false) as is_superadmin
                 FROM users u
                 JOIN org_members om ON u.id = om.user_id
                 WHERE u.id = $1
                 LIMIT 1`,
                [userId]
            );

            user = userResult.rows[0];
        }

        // Log activity
        await query(
            `INSERT INTO user_activity (org_id, user_id, activity_type, description)
             VALUES ($1, $2, 'user_signin', $3)`,
            [orgId, user.id, `User ${userInfo.email} signed in via Google`]
        );

        // Generate JWT token
        const token = generateToken({ userId: user.id, orgId: orgId });

        // Redirect to dashboard with token in URL (will be stored in localStorage by client)
        // Also set as httpOnly cookie for API requests
        const response = NextResponse.redirect(`${appUrl}/dashboard?auth_token=${token}`);

        // Set auth token as cookie for API requests
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 604800, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        return NextResponse.redirect(
            `${appUrl}/account/signin?error=${encodeURIComponent('Sign-in failed. Please try again.')}`
        );
    }
}
