import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    let appUrl = process.env.NEXT_PUBLIC_APP_URL;
    let strategy = 'env_var';

    if (!appUrl) {
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        appUrl = `${protocol}://${host}`;
        strategy = 'host_header';
    }

    // Remove trailing slash if present
    appUrl = appUrl.trim().replace(/\/$/, '');

    const redirectUri = `${appUrl}/api/integrations/oauth/callback`;

    return NextResponse.json({
        appUrl,
        redirectUri,
        strategy,
        headers: {
            host: request.headers.get('host'),
            x_forwarded_host: request.headers.get('x-forwarded-host'),
            x_forwarded_proto: request.headers.get('x-forwarded-proto'),
        }
    });
}
