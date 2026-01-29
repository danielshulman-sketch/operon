/**
 * API Authentication Middleware
 * Validates API keys for public API endpoints
 */

import { verifyApiKey, checkRateLimit, hashApiKey } from '@/lib/api-key-manager';
import { NextResponse } from 'next/server';

/**
 * Require valid API key authentication
 * Extracts API key from Authorization header and validates it
 * 
 * Usage in route handlers:
 * const authResult = await requireApiKey(request);
 * if (authResult.error) return authResult.response;
 * const { orgId } = authResult;
 * 
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object>} { orgId, apiKeyId, error, response }
 */
export async function requireApiKey(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return {
                error: true,
                response: NextResponse.json(
                    {
                        error: 'Missing authorization header',
                        message: 'Please provide an API key in the Authorization header as "Bearer YOUR_API_KEY"'
                    },
                    { status: 401 }
                )
            };
        }

        // Extract token from "Bearer TOKEN" format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return {
                error: true,
                response: NextResponse.json(
                    {
                        error: 'Invalid authorization header format',
                        message: 'Authorization header must be in format: Bearer YOUR_API_KEY'
                    },
                    { status: 401 }
                )
            };
        }

        const apiKey = parts[1];

        // Verify the API key
        const keyInfo = await verifyApiKey(apiKey);

        if (!keyInfo) {
            return {
                error: true,
                response: NextResponse.json(
                    {
                        error: 'Invalid API key',
                        message: 'The provided API key is invalid or has been revoked'
                    },
                    { status: 401 }
                )
            };
        }

        // Check rate limit
        const keyHash = hashApiKey(apiKey);
        const rateLimit = await checkRateLimit(keyHash);

        if (!rateLimit.allowed) {
            return {
                error: true,
                response: NextResponse.json(
                    {
                        error: 'Rate limit exceeded',
                        message: `You have exceeded the rate limit of ${rateLimit.limit} requests per minute`,
                        limit: rateLimit.limit,
                        remaining: 0,
                        resetAt: rateLimit.resetAt
                    },
                    {
                        status: 429,
                        headers: {
                            'X-RateLimit-Limit': rateLimit.limit.toString(),
                            'X-RateLimit-Remaining': '0',
                            'X-RateLimit-Reset': rateLimit.resetAt
                        }
                    }
                )
            };
        }

        // Success - return org context and rate limit info
        return {
            orgId: keyInfo.orgId,
            orgName: keyInfo.orgName,
            apiKeyId: keyInfo.apiKeyId,
            keyName: keyInfo.keyName,
            rateLimit: {
                limit: rateLimit.limit,
                remaining: rateLimit.remaining,
                resetAt: rateLimit.resetAt
            }
        };

    } catch (error) {
        console.error('API authentication error:', error);
        return {
            error: true,
            response: NextResponse.json(
                {
                    error: 'Authentication failed',
                    message: 'An error occurred while authenticating your request'
                },
                { status: 500 }
            )
        };
    }
}

/**
 * Add rate limit headers to a response
 * 
 * @param {NextResponse} response - Response object
 * @param {Object} rateLimit - Rate limit info from requireApiKey
 * @returns {NextResponse} Response with headers
 */
export function addRateLimitHeaders(response, rateLimit) {
    if (!rateLimit) return response;

    response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    if (rateLimit.resetAt) {
        response.headers.set('X-RateLimit-Reset', rateLimit.resetAt);
    }

    return response;
}

/**
 * Create a standardized API error response
 * 
 * @param {string} error - Error code
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} extra - Additional fields
 * @returns {NextResponse} Error response
 */
export function apiError(error, message, status = 400, extra = {}) {
    return NextResponse.json(
        {
            error,
            message,
            ...extra
        },
        { status }
    );
}

/**
 * Create a standardized API success response
 * 
 * @param {Object} data - Response data
 * @param {Object} rateLimit - Rate limit info
 * @returns {NextResponse} Success response
 */
export function apiSuccess(data, rateLimit = null) {
    const response = NextResponse.json(data);

    if (rateLimit) {
        addRateLimitHeaders(response, rateLimit);
    }

    return response;
}
