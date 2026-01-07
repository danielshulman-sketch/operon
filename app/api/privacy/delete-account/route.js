import { NextResponse } from 'next/server';
import { requireAuth } from '@/utils/auth';
import { query, getClient } from '@/utils/db';

export async function POST(request) {
    try {
        const user = await requireAuth(request);

        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Mark account for deletion with 30-day grace period
            const deletionDate = new Date();
            deletionDate.setDate(deletionDate.getDate() + 30);

            await client.query(
                `UPDATE users SET 
                    deletion_requested_at = CURRENT_TIMESTAMP,
                    deletion_scheduled_for = $1,
                    is_active = false
                WHERE id = $2`,
                [deletionDate, user.id]
            );

            // Log the deletion request
            await client.query(
                `INSERT INTO user_activity (org_id, user_id, activity_type, description)
                VALUES ($1, $2, 'account_deletion_requested', $3)`,
                [
                    user.org_id,
                    user.id,
                    `Account deletion requested. Scheduled for ${deletionDate.toISOString()}`
                ]
            );

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                message: 'Account deletion scheduled',
                grace_period_ends: deletionDate.toISOString(),
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Account deletion error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete account' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
