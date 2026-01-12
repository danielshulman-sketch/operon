import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { requireAuth } from '@/utils/auth';

// Share document with users
export async function POST(request) {
    try {
        const user = await requireAuth(request);
        const { documentId, userIds } = await request.json();

        if (!documentId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json(
                { error: 'Document ID and array of user IDs are required' },
                { status: 400 }
            );
        }

        // Verify document exists and belongs to user's organization
        const docResult = await query(
            `SELECT id, org_id, title, created_by 
             FROM knowledge_base 
             WHERE id = $1`,
            [documentId]
        );

        if (docResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        const document = docResult.rows[0];

        if (document.org_id !== user.org_id) {
            return NextResponse.json(
                { error: 'Document not found in your organization' },
                { status: 403 }
            );
        }

        // Verify all target users are in the same organization
        const usersResult = await query(
            `SELECT u.id, u.email, om.org_id
             FROM users u
             JOIN org_members om ON u.id = om.user_id
             WHERE u.id = ANY($1) AND om.org_id = $2 AND om.is_active = true`,
            [userIds, user.org_id]
        );

        if (usersResult.rows.length !== userIds.length) {
            return NextResponse.json(
                { error: 'Some users are not in your organization or are inactive' },
                { status: 400 }
            );
        }

        // Prevent sharing with self
        const filteredUserIds = userIds.filter(id => id !== user.id);
        if (filteredUserIds.length === 0) {
            return NextResponse.json(
                { error: 'Cannot share document with yourself' },
                { status: 400 }
            );
        }

        // Create shares (ON CONFLICT DO NOTHING to handle duplicates)
        const sharePromises = filteredUserIds.map(userId =>
            query(
                `INSERT INTO document_shares (document_id, shared_by, shared_with, org_id, permission)
                 VALUES ($1, $2, $3, $4, 'view')
                 ON CONFLICT (document_id, shared_with) DO NOTHING
                 RETURNING id`,
                [documentId, user.id, userId, user.org_id]
            )
        );

        const shareResults = await Promise.all(sharePromises);
        const newSharesCount = shareResults.filter(r => r.rows.length > 0).length;

        // Log activity
        await query(
            `INSERT INTO user_activity (org_id, user_id, activity_type, description)
             VALUES ($1, $2, 'document_shared', $3)`,
            [user.org_id, user.id, `Shared document "${document.title}" with ${newSharesCount} user(s)`]
        );

        return NextResponse.json({
            success: true,
            sharesCreated: newSharesCount,
            message: `Document shared with ${newSharesCount} user(s)`
        });
    } catch (error) {
        console.error('Share document error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to share document' },
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

// Get who document is shared with
export async function GET(request) {
    try {
        const user = await requireAuth(request);
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');

        if (!documentId) {
            return NextResponse.json(
                { error: 'Document ID is required' },
                { status: 400 }
            );
        }

        // Verify user has access to this document
        const docCheck = await query(
            `SELECT created_by, org_id FROM knowledge_base WHERE id = $1`,
            [documentId]
        );

        if (docCheck.rows.length === 0) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        const doc = docCheck.rows[0];

        // Only document owner or admin can see who it's shared with
        if (doc.created_by !== user.id && !user.isAdmin) {
            return NextResponse.json(
                { error: 'Permission denied' },
                { status: 403 }
            );
        }

        // Get list of users document is shared with
        const sharesResult = await query(
            `SELECT 
                ds.id, ds.shared_with, ds.permission, ds.created_at,
                u.email, u.first_name, u.last_name
             FROM document_shares ds
             JOIN users u ON ds.shared_with = u.id
             WHERE ds.document_id = $1
             ORDER BY ds.created_at DESC`,
            [documentId]
        );

        return NextResponse.json({
            shares: sharesResult.rows
        });
    } catch (error) {
        console.error('Get shares error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get shares' },
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

// Revoke share
export async function DELETE(request) {
    try {
        const user = await requireAuth(request);
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');
        const userId = searchParams.get('userId');

        if (!documentId || !userId) {
            return NextResponse.json(
                { error: 'Document ID and user ID are required' },
                { status: 400 }
            );
        }

        // Verify document belongs to user or user is admin
        const docCheck = await query(
            `SELECT created_by, org_id, title FROM knowledge_base WHERE id = $1`,
            [documentId]
        );

        if (docCheck.rows.length === 0) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        const doc = docCheck.rows[0];

        if (doc.created_by !== user.id && !user.isAdmin) {
            return NextResponse.json(
                { error: 'Only document owner or admin can revoke shares' },
                { status: 403 }
            );
        }

        // Delete share
        await query(
            `DELETE FROM document_shares 
             WHERE document_id = $1 AND shared_with = $2 AND org_id = $3`,
            [documentId, userId, user.org_id]
        );

        // Log activity
        await query(
            `INSERT INTO user_activity (org_id, user_id, activity_type, description)
             VALUES ($1, $2, 'document_unshared', $3)`,
            [user.org_id, user.id, `Revoked share for document "${doc.title}"`]
        );

        return NextResponse.json({
            success: true,
            message: 'Share revoked successfully'
        });
    } catch (error) {
        console.error('Revoke share error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to revoke share' },
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}
