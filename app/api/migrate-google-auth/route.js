import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { requireSuperAdmin } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        // Require superadmin authentication
        await requireSuperAdmin(request);

        // Check if columns already exist
        const checkColumns = await query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'auth_accounts' 
            AND column_name IN ('provider_user_id', 'access_token', 'refresh_token', 'token_expiry')
        `);

        if (checkColumns.rows.length === 4) {
            return NextResponse.json({
                success: true,
                message: 'Migration already completed',
                alreadyExists: true
            });
        }

        // Add new columns to auth_accounts table
        await query(`
            ALTER TABLE auth_accounts 
            ADD COLUMN IF NOT EXISTS provider_user_id VARCHAR(255),
            ADD COLUMN IF NOT EXISTS access_token TEXT,
            ADD COLUMN IF NOT EXISTS refresh_token TEXT,
            ADD COLUMN IF NOT EXISTS token_expiry TIMESTAMP
        `);

        // Create index for efficient provider lookups
        await query(`
            CREATE INDEX IF NOT EXISTS idx_auth_accounts_provider_user 
            ON auth_accounts(provider, provider_user_id)
        `);

        // Make password_hash nullable (not required for OAuth providers)
        await query(`
            ALTER TABLE auth_accounts 
            ALTER COLUMN password_hash DROP NOT NULL
        `);

        return NextResponse.json({
            success: true,
            message: 'Google auth migration completed successfully',
            changes: [
                'Added provider_user_id column',
                'Added access_token column',
                'Added refresh_token column',
                'Added token_expiry column',
                'Created provider index',
                'Made password_hash nullable'
            ]
        });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json(
            {
                error: 'Migration failed',
                details: error.message
            },
            { status: 500 }
        );
    }
}
