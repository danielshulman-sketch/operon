import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { requireAuth, hashPassword, verifyPassword } from '@/utils/auth';

export async function PUT(request) {
    try {
        const user = await requireAuth(request);
        const { currentPassword, newPassword } = await request.json();

        // Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters' },
                { status: 400 }
            );
        }

        if (currentPassword === newPassword) {
            return NextResponse.json(
                { error: 'New password must be different from current password' },
                { status: 400 }
            );
        }

        // Get current password hash
        const authResult = await query(
            `SELECT password_hash FROM auth_accounts 
             WHERE user_id = $1 AND provider = 'email'`,
            [user.id]
        );

        if (authResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Password authentication not set up for this account' },
                { status: 400 }
            );
        }

        const currentHash = authResult.rows[0].password_hash;

        // Verify current password
        const isValid = await verifyPassword(currentHash, currentPassword);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        // Hash and update new password
        const newHash = await hashPassword(newPassword);
        await query(
            `UPDATE auth_accounts 
             SET password_hash = $1, updated_at = NOW()
             WHERE user_id = $2 AND provider = 'email'`,
            [newHash, user.id]
        );

        // Log activity
        await query(
            `INSERT INTO user_activity (org_id, user_id, activity_type, description)
             VALUES ($1, $2, 'password_changed', 'User changed their password')`,
            [user.org_id, user.id]
        );

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Password change error:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
}
