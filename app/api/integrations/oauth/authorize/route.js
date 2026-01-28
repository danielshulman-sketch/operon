import { NextResponse } from 'next/server';
import { getIntegration, supportsOAuth } from '@/lib/integrations';
import { requireAuth } from '@/utils/auth';
import { query } from '@/utils/db';
import { ensureOAuthClientCredentialsTable } from '@/utils/ensure-oauth-client-credentials';
import { decryptValue } from '@/lib/automation/encryption';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function createOAuthState(integrationName) {
    return `${integrationName}:${crypto.randomUUID()}`;
}

function isGoogleOAuthIntegration(integration, integrationName) {
    if (!integration?.oauth?.authUrl) return false;
    const authUrl = integration.oauth.authUrl.toLowerCase();
    return authUrl.includes('accounts.google.com') || integrationName.startsWith('google_') || integrationName === 'gmail';
}

async function buildAuthUrl(request, integrationName, clientId, state) {
    const integration = getIntegration(integrationName);
    if (!integration || !supportsOAuth(integration)) {
        const url = new URL('/dashboard/automations/integrations?error=invalid_integration', request.url);
        return { redirect: url };
    }

    let appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        appUrl = `${protocol}://${host}`;
        console.log(`NEXT_PUBLIC_APP_URL not set. Using host: ${appUrl}`);
    }

    // Remove trailing slash if present
    appUrl = appUrl.trim().replace(/\/$/, '');

    const redirectUri = `${appUrl}/api/integrations/oauth/callback`;
    console.log('OAuth Redirect URI:', redirectUri);

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        state: state,
    });

    if (integration.oauth.scopes?.length) {
        params.set('scope', integration.oauth.scopes.join(' '));
    }

    if (isGoogleOAuthIntegration(integration, integrationName)) {
        params.set('access_type', 'offline');
        params.set('prompt', 'consent');
    }

    if (integrationName === 'slack') {
        params.set('user_scope', '');
    }

    if (integrationName === 'notion') {
        params.set('owner', 'workspace');
    }

    const url = `${integration.oauth.authUrl}?${params.toString()}`;
    return { url };
}

async function getStoredClientId(orgId, integrationName) {
    await ensureOAuthClientCredentialsTable();
    const result = await query(
        `SELECT client_id FROM oauth_client_credentials
         WHERE org_id = $1 AND integration_name = $2`,
        [orgId, integrationName]
    );
    if (result.rows.length === 0) return null;
    try {
        return decryptValue(result.rows[0].client_id);
    } catch (error) {
        return null;
    }
}

export async function POST(request) {
    try {
        const user = await requireAuth(request);
        const body = await request.json();
        const integrationName = body?.integration;

        if (!integrationName) {
            return NextResponse.json({ error: 'integration is required' }, { status: 400 });
        }

        const storedClientId = await getStoredClientId(user.org_id, integrationName);
        let envClientId = process.env[`${integrationName.toUpperCase()}_CLIENT_ID`];

        // Fallback for Google integrations
        const integration = getIntegration(integrationName);
        if (!envClientId && isGoogleOAuthIntegration(integration, integrationName)) {
            envClientId = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
        }
        const clientId = storedClientId || envClientId;

        if (!clientId) {
            return NextResponse.json({ error: 'Configuration missing (Client ID)' }, { status: 400 });
        }

        const state = createOAuthState(integrationName);
        const { url, redirect } = await buildAuthUrl(request, integrationName, clientId, state);
        if (redirect) {
            return NextResponse.json({ error: 'Invalid integration' }, { status: 400 });
        }

        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        const response = NextResponse.json({ url });
        if (token) {
            response.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
        }
        response.cookies.set('oauth_state', state, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 10 * 60,
        });
        return response;
    } catch (error) {
        console.error('OAuth authorize error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const integrationName = searchParams.get('integration');

        if (!integrationName) {
            const url = new URL('/dashboard/automations/integrations?error=integration_required', request.url);
            return NextResponse.redirect(url);
        }

        let envClientId = process.env[`${integrationName.toUpperCase()}_CLIENT_ID`];

        // Fallback for Google integrations
        const integration = getIntegration(integrationName);
        if (!envClientId && isGoogleOAuthIntegration(integration, integrationName)) {
            envClientId = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
        }
        if (!envClientId) {
            const url = new URL(
                `/dashboard/automations/integrations?error=${encodeURIComponent('Configuration missing (Client ID)')}`,
                request.url
            );
            return NextResponse.redirect(url);
        }

        const state = createOAuthState(integrationName);
        const { url, redirect } = await buildAuthUrl(request, integrationName, envClientId, state);
        if (redirect) {
            return NextResponse.redirect(redirect);
        }

        const response = NextResponse.redirect(url);
        response.cookies.set('oauth_state', state, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 10 * 60,
        });
        return response;
    } catch (error) {
        console.error('OAuth authorize error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
