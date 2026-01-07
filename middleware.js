import { NextResponse } from 'next/server';

// Simple in-memory rate limiting
// In production, use Redis or a proper rate limiting service
const requestCounts = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    for (const [key, data] of requestCounts.entries()) {
        if (data.timestamp < fiveMinutesAgo) {
            requestCounts.delete(key);
        }
    }
}, 5 * 60 * 1000);

export function middleware(request) {
    // Skip rate limiting for health checks and static assets
    if (request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api/health')) {
        return NextResponse.next();
    }

    // Only apply rate limiting to API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Get client identifier (IP address)
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Create a time window key (1 minute windows)
    const now = Date.now();
    const windowStart = Math.floor(now / 60000) * 60000; // Round to minute
    const key = `${ip}-${windowStart}`;

    // Get current count for this window
    const currentData = requestCounts.get(key) || { count: 0, timestamp: now };
    currentData.count += 1;
    currentData.timestamp = now;
    requestCounts.set(key, currentData);

    // Rate limit: 100 requests per minute per IP
    const limit = 100;

    if (currentData.count > limit) {
        return NextResponse.json(
            {
                error: 'Rate limit exceeded',
                message: 'Too many requests. Please try again later.',
                retryAfter: 60
            },
            {
                status: 429,
                headers: {
                    'Retry-After': '60',
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(windowStart + 60000)
                }
            }
        );
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(limit - currentData.count));
    response.headers.set('X-RateLimit-Reset', String(windowStart + 60000));

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
