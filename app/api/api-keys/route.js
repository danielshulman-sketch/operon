/**
 * API Keys Management (Dashboard)
 * GET    /api/api-keys - List organization's API keys
 * POST   /api/api-keys - Create new API key
 * DELETE /api/api-keys - Revoke API key
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/utils/auth';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/api-key-manager';

/**
 * GET /api/api-keys
 * List all API keys for the organization
 */
export async function GET(request) {
    try {
        const user = await requireAuth(request);

        const keys = await listApiKeys(user.org_id);

        return NextResponse.json({ apiKeys: keys });

    } catch (error) {
        console.error('List API keys error:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Failed to fetch API keys' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/api-keys
 * Create a new API key
 */
export async function POST(request) {
    try {
        const user = await requireAuth(request);
        const body = await request.json();
        const { name, description } = body;

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'API key name is required' },
                { status: 400 }
            );
        }

        if (name.length > 255) {
            return NextResponse.json(
                { error: 'API key name must be less than 255 characters' },
                { status: 400 }
            );
        }

        const result = await createApiKey(
            user.org_id,
            name.trim(),
            user.id,
            description || null
        );

        return NextResponse.json({
            success: true,
            apiKey: result,
            message: 'API key created successfully. Save this key - it will not be shown again!'
        });

    } catch (error) {
        console.error('Create API key error:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json(
            { error: error.message || 'Failed to create API key' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/api-keys
 * Revoke an API key
 */
export async function DELETE(request) {
    try {
        const user = await requireAuth(request);
        const { searchParams } = new URL(request.url);
        const keyId = searchParams.get('keyId');

        if (!keyId) {
            return NextResponse.json(
                { error: 'API key ID is required' },
                { status: 400 }
            );
        }

        const success = await revokeApiKey(parseInt(keyId), user.org_id);

        if (!success) {
            return NextResponse.json(
                { error: 'API key not found or already revoked' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'API key revoked successfully'
        });

    } catch (error) {
        console.error('Revoke API key error:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Failed to revoke API key' },
            { status: 500 }
        );
    }
}
