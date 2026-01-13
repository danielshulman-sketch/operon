import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

        if (!clientId) {
            return NextResponse.json(
                { error: 'Google OAuth not configured' },
                { status: 500 }
            );
        }

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'email profile',
            access_type: 'offline',
            prompt: 'consent'
        });

        const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Google auth URL error:', error);
        return NextResponse.json(
            { error: 'Failed to generate auth URL' },
            { status: 500 }
        );
    }
}
