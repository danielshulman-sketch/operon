import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testSigninFlow() {
    try {
        const email = 'daniel@easy-ai.co.uk';
        const password = 'test123'; // Replace with actual test password

        console.log('=== Testing Complete Signin Flow ===\n');
        console.log('Step 1: Query user with auth and org info');

        const result = await pool.query(
            `SELECT u.id, u.email, u.first_name, u.last_name, 
              COALESCE(u.is_superadmin, false) as is_superadmin,
              a.password_hash, om.org_id, om.role, om.is_admin, om.is_active
       FROM users u
       JOIN auth_accounts a ON u.id = a.user_id
       JOIN org_members om ON u.id = om.user_id
       WHERE u.email = $1 AND a.provider = 'email'
       LIMIT 1`,
            [email]
        );

        if (result.rows.length === 0) {
            console.log('❌ User not found');
            return;
        }

        const user = result.rows[0];
        console.log('✅ User found:', user.email);
        console.log('   Is Active:', user.is_active);
        console.log('   Has password hash:', !!user.password_hash);
        console.log('');

        // Check if user is active
        if (!user.is_active) {
            console.log('❌ Account is inactive - signin would fail with 403');
            return;
        }

        console.log('Step 2: Testing activity log insert');
        try {
            await pool.query(
                `INSERT INTO user_activity (org_id, user_id, activity_type, description)
           VALUES ($1, $2, 'user_signin', $3)`,
                [user.org_id, user.id, `User ${email} signed in`]
            );
            console.log('✅ Activity log insert successful');
        } catch (err) {
            console.log('❌ Activity log insert FAILED:', err.message);
            console.log('   Error code:', err.code);
            console.log('   This is likely the cause of the 500 error!');

            // Check if RLS is enabled
            console.log('\nStep 3: Checking RLS status on user_activity table');
            const rlsCheck = await pool.query(`
                SELECT relname, relrowsecurity 
                FROM pg_class 
                WHERE relname = 'user_activity'
            `);
            if (rlsCheck.rows[0]) {
                console.log('   RLS enabled:', rlsCheck.rows[0].relrowsecurity);
                if (rlsCheck.rows[0].relrowsecurity) {
                    console.log('   ⚠️  RLS is enabled - this blocks inserts without proper context!');
                }
            }
        }

        console.log('\n=== DIAGNOSIS ===');
        console.log('If the activity log insert failed, the signin endpoint crashes with 500.');
        console.log('Solution: Either disable RLS on user_activity OR create proper RLS policies.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Code:', error.code);
    } finally {
        await pool.end();
    }
}

testSigninFlow();
