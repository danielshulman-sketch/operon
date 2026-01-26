import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { requireAuth } from '@/utils/auth';

// Only initialize OAuth if credentials are configured
const isOAuthConfigured = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    // Check if credentials are placeholders
    if (!clientId || !clientSecret ||
        clientId.includes('your_client_id_here') ||
        clientSecret.includes('your_client_secret_here')) {
        return false;
    }
    return true;
};

const oauth2Client = isOAuthConfigured() ? new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/email/oauth/google/callback`
) : null;

export async function GET(request) {
    try {
        await requireAuth(request);

        // Check if OAuth is configured
        if (!isOAuthConfigured() || !oauth2Client) {
            return NextResponse.json(
                { error: 'Google OAuth is not configured. Please contact your administrator.' },
                { status: 503 }
            );
        }

        const scopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.send',
        ];

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
        });

        return NextResponse.json({ authUrl });
    } catch (error) {
        console.error('OAuth init error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize OAuth' },
            { status: 500 }
        );
    }
}
