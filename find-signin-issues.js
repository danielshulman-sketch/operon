import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function findInactiveUsers() {
    try {
        console.log('=== Finding users who cannot sign in ===\n');

        // Find users with inactive org membership
        const inactiveOrgUsers = await pool.query(`
            SELECT 
                u.email,
                om.is_active
            FROM users u
            JOIN org_members om ON u.id = om.user_id
            WHERE om.is_active = false
        `);

        console.log(`Users with INACTIVE org membership: ${inactiveOrgUsers.rows.length}`);
        inactiveOrgUsers.rows.forEach(user => {
            console.log(`  - ${user.email}`);
        });
        console.log('');

        // Find users without email auth
        const noEmailAuth = await pool.query(`
            SELECT u.email
            FROM users u
            WHERE NOT EXISTS (
                SELECT 1 FROM auth_accounts a 
                WHERE a.user_id = u.id AND a.provider = 'email'
            )
        `);

        console.log(`Users without email auth provider: ${noEmailAuth.rows.length}`);
        noEmailAuth.rows.forEach(user => {
            console.log(`  - ${user.email}`);
        });
        console.log('');

        // Find users without org membership
        const noOrg = await pool.query(`
            SELECT u.email
            FROM users u
            WHERE NOT EXISTS (
                SELECT 1 FROM org_members om
                WHERE om.user_id = u.id
            )
        `);

        console.log(`Users without org membership: ${noOrg.rows.length}`);
        noOrg.rows.forEach(user => {
            console.log(`  - ${user.email}`);
        });
        console.log('');

        // Summary
        console.log('=== ACTION REQUIRED ===');
        const totalProblems = inactiveOrgUsers.rows.length + noEmailAuth.rows.length + noOrg.rows.length;
        if (totalProblems > 0) {
            console.log(`Found ${totalProblems} user issues that prevent signin`);
        } else {
            console.log('No user issues found - all users should be able to sign in');
            console.log('The problem might be elsewhere (wrong password, frontend issue, etc.)');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

findInactiveUsers();
