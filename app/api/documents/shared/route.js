import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { requireAuth } from '@/utils/auth';

// Get documents shared with current user
export async function GET(request) {
    try {
        const user = await requireAuth(request);

        const result = await query(
            `SELECT DISTINCT
                kb.id, kb.title, kb.content, kb.category, kb.tags,
                kb.created_at, kb.updated_at, kb.is_active,
                u.email as shared_by_email,
                u.first_name as shared_by_first_name,
                u.last_name as shared_by_last_name,
                ds.permission, ds.created_at as shared_at
             FROM document_shares ds
             JOIN knowledge_base kb ON ds.document_id = kb.id
             JOIN users u ON ds.shared_by = u.id
             WHERE ds.shared_with = $1 
               AND ds.org_id = $2
               AND kb.is_active = true
             ORDER BY ds.created_at DESC`,
            [user.id, user.org_id]
        );

        return NextResponse.json({
            documents: result.rows
        });
    } catch (error) {
        console.error('Get shared documents error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch shared documents' },
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}
