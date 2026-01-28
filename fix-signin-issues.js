import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixSigninIssues() {
    const client = await pool.connect();

    try {
        console.log('=== Fixing Signin Issues ===\n');

        // Issue 1: Check and fix RLS on user_activity
        console.log('1. Checking RLS on user_activity table...');
        const rlsCheck = await client.query(`
            SELECT relname, relrowsecurity 
            FROM pg_class 
            WHERE relname = 'user_activity'
        `);

        if (rlsCheck.rows[0]?.relrowsecurity) {
            console.log('   ⚠️  RLS is enabled on user_activity - disabling it...');
            await client.query('ALTER TABLE user_activity DISABLE ROW LEVEL SECURITY');
            console.log('   ✅ RLS disabled on user_activity');
        } else {
            console.log('   ✅ RLS is already disabled');
        }

        console.log('');

        // Issue 2: Activate all inactive users
        console.log('2. Checking for inactive users...');
        const inactiveUsers = await client.query(`
            SELECT u.email, om.is_active
            FROM users u
            JOIN org_members om ON u.id = om.user_id
            WHERE om.is_active = false
        `);

        if (inactiveUsers.rows.length > 0) {
            console.log(`   Found ${inactiveUsers.rows.length} inactive users:`);
            inactiveUsers.rows.forEach(user => {
                console.log(`     - ${user.email}`);
            });

            console.log('   Activating all users...');
            const result = await client.query(`
                UPDATE org_members
                SET is_active = true
                WHERE is_active = false
            `);
            console.log(`   ✅ Activated ${result.rowCount} users`);
        } else {
            console.log('   ✅ All users are already active');
        }

        console.log('');
        console.log('=== FIX COMPLETE ===');
        console.log('Users should now be able to sign in successfully!');
        console.log('Try signing in again.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

fixSigninIssues();
