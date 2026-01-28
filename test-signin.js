import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testSignin() {
    try {
        const email = 'daniel@easy-ai.co.uk';

        console.log('Testing signin query for:', email);
        console.log('');

        // This is the exact query from the signin route
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

        console.log('Query executed successfully');
        console.log('Rows returned:', result.rows.length);
        console.log('');

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('User found:');
            console.log('  ID:', user.id);
            console.log('  Email:', user.email);
            console.log('  Name:', user.first_name, user.last_name);
            console.log('  Org ID:', user.org_id);
            console.log('  Role:', user.role);
            console.log('  Is Admin:', user.is_admin);
            console.log('  Is Active:', user.is_active);
            console.log('  Is Superadmin:', user.is_superadmin);
            console.log('  Has password hash:', !!user.password_hash);
            console.log('');

            if (!user.is_active) {
                console.log('*** PROBLEM IDENTIFIED ***');
                console.log('User account is INACTIVE (is_active = false)');
                console.log('This is why signin is failing!');
            }
        } else {
            console.log('No user found');
        }

    } catch (error) {
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        console.error('Detail:', error.detail);
    } finally {
        await pool.end();
    }
}

testSignin();
