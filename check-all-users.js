import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkAllUsers() {
    try {
        console.log('=== Checking all users and their auth status ===\n');

        // Get all users with their org_members status
        const result = await pool.query(`
            SELECT 
                u.id, 
                u.email, 
                u.first_name, 
                u.last_name,
                COALESCE(u.is_superadmin, false) as is_superadmin,
                om.org_id,
                om.role,
                om.is_admin,
                om.is_active as org_active,
                a.provider,
                a.password_hash IS NOT NULL as has_password
            FROM users u
            LEFT JOIN org_members om ON u.id = om.user_id
            LEFT JOIN auth_accounts a ON u.id = a.user_id AND a.provider = 'email'
            ORDER BY u.created_at DESC
        `);

        console.log(`Found ${result.rows.length} user records\n`);

        result.rows.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Name: ${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`);
            console.log(`  Org ID: ${user.org_id || 'NONE'}`);
            console.log(`  Role: ${user.role || 'NONE'}`);
            console.log(`  Is Admin: ${user.is_admin}`);
            console.log(`  Org Active: ${user.org_active}`);
            console.log(`  Provider: ${user.provider || 'NONE'}`);
            console.log(`  Has Password: ${user.has_password}`);
            console.log(`  Is Superadmin: ${user.is_superadmin}`);

            // Check if can sign in
            const canSignin = user.org_active && user.has_password && user.provider === 'email';
            console.log(`  ✓ Can Sign In: ${canSignin ? 'YES' : 'NO'}`);

            if (!canSignin) {
                const reasons = [];
                if (!user.org_active) reasons.push('org_members.is_active = false');
                if (!user.has_password) reasons.push('no password hash');
                if (user.provider !== 'email') reasons.push('no email auth provider');
                if (!user.org_id) reasons.push('not member of any org');
                console.log(`  ✗ Reasons: ${reasons.join(', ')}`);
            }
            console.log('');
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkAllUsers();
