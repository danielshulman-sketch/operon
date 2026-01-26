import { NextResponse } from 'next/server';
import { query } from '@/utils/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const checks = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        checks: {}
    };

    // Check DATABASE_URL
    checks.checks.database_url = {
        configured: !!process.env.DATABASE_URL,
        value: process.env.DATABASE_URL ?
            `${process.env.DATABASE_URL.substring(0, 20)}...` :
            'NOT SET'
    };

    // Check JWT_SECRET
    checks.checks.jwt_secret = {
        configured: !!process.env.JWT_SECRET,
        length: process.env.JWT_SECRET?.length || 0
    };

    // Check NEXT_PUBLIC_APP_URL
    checks.checks.app_url = {
        configured: !!process.env.NEXT_PUBLIC_APP_URL,
        value: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'
    };

    // Try database connection
    try {
        const result = await query('SELECT NOW() as current_time');
        checks.checks.database_connection = {
            status: 'success',
            current_time: result.rows[0]?.current_time
        };
    } catch (error) {
        checks.checks.database_connection = {
            status: 'failed',
            error: error.message
        };
    }

    // Check if users table exists
    try {
        const result = await query('SELECT COUNT(*) as user_count FROM users');
        checks.checks.users_table = {
            status: 'exists',
            count: parseInt(result.rows[0]?.user_count || 0)
        };
    } catch (error) {
        checks.checks.users_table = {
            status: 'failed',
            error: error.message
        };
    }

    return NextResponse.json(checks);
}
