import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function activateAllUsers() {
    try {
        console.log('=== Activating all users with inactive org membership ===\n');

        // First, show which users will be affected
        const inactiveUsers = await pool.query(`
            SELECT 
                u.email,
                om.org_id,
                om.role
            FROM users u
            JOIN org_members om ON u.id = om.user_id
            WHERE om.is_active = false
        `);

        console.log(`Found ${inactiveUsers.rows.length} inactive users:\n`);
        inactiveUsers.rows.forEach(user => {
            console.log(`  - ${user.email} (Role: ${user.role})`);
        });
        console.log('');

        if (inactiveUsers.rows.length === 0) {
            console.log('No inactive users found. All users are already active.');
            return;
        }

        // Activate all users
        const result = await pool.query(`
            UPDATE org_members
            SET is_active = true
            WHERE is_active = false
            RETURNING user_id
        `);

        console.log(`✅ Successfully activated ${result.rowCount} users`);
        console.log('\nAll users can now sign in.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

activateAllUsers();
