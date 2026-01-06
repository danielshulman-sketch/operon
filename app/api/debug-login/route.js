import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const results = {
        env: {
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            databaseUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
            databaseUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'none'
        },
        connection: null,
        error: null
    };

    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000
        });

        const client = await pool.connect();
        try {
            const res = await client.query('SELECT NOW()');
            results.connection = 'Success';
            results.timestamp = res.rows[0].now;

            // Check user
            const userRes = await client.query("SELECT * FROM users WHERE email = 'daniel@easy-ai.co.uk'");
            results.userFound = userRes.rows.length > 0;

            if (results.userFound) {
                const user = userRes.rows[0];
                results.userId = user.id;

                // Check auth account
                const authRes = await client.query("SELECT * FROM auth_accounts WHERE user_id = $1", [user.id]);
                results.authFound = authRes.rows.length > 0;

                if (results.authFound) {
                    results.provider = authRes.rows[0].provider;
                    results.hasPasswordHash = !!authRes.rows[0].password_hash;
                }
            }

        } finally {
            client.release();
            await pool.end();
        }

    } catch (e) {
        results.error = {
            message: e.message,
            code: e.code,
            stack: e.stack
        };
    }

    return NextResponse.json(results);
}
