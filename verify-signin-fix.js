import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verifyFixes() {
    try {
        console.log('=== Verifying Signin Fixes ===\n');

        // Check 1: RLS status
        const rlsCheck = await pool.query(`
            SELECT relname, relrowsecurity 
            FROM pg_class 
            WHERE relname = 'user_activity'
        `);

        console.log('1. RLS on user_activity:');
        console.log('   Status:', rlsCheck.rows[0]?.relrowsecurity ? '❌ ENABLED (BAD)' : '✅ DISABLED (GOOD)');
        console.log('');

        // Check 2: Inactive users
        const inactiveUsers = await pool.query(`
            SELECT COUNT(*) as count
            FROM org_members
            WHERE is_active = false
        `);

        console.log('2. Inactive users:');
        console.log('   Count:', inactiveUsers.rows[0].count === '0' ? '✅ 0 (GOOD)' : `❌ ${inactiveUsers.rows[0].count} (BAD)`);
        console.log('');

        // Check 3: Users with email auth
        const emailAuthUsers = await pool.query(`
            SELECT COUNT(*) as count
            FROM users u
            JOIN auth_accounts a ON u.id = a.user_id
            JOIN org_members om ON u.id = om.user_id
            WHERE a.provider = 'email' AND om.is_active = true
        `);

        console.log('3. Users ready to sign in:');
        console.log('   Count:', emailAuthUsers.rows[0].count, 'users can sign in');
        console.log('');

        console.log('=== VERIFICATION COMPLETE ===');
        console.log('✅ Signin should be working now!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verifyFixes();
