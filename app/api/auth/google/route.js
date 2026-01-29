import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!clientId) {
            return NextResponse.json(
                { error: 'Google OAuth not configured' },
                { status: 500 }
            );
        }

        // Generate state for CSRF protection
        const state = crypto.randomBytes(32).toString('hex');

        // Build redirect URI
        const redirectUri = `${appUrl}/api/auth/google/callback`;

        // Google OAuth authorization URL
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'consent',
            state: state,
        });

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

        // Set state cookie for verification in callback
        const response = NextResponse.redirect(authUrl);
        response.cookies.set('google_oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600, // 10 minutes
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Google OAuth initiation error:', error);
        return NextResponse.json(
            { error: 'Failed to initiate Google sign-in' },
            { status: 500 }
        );
    }
}
