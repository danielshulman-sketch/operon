// Script to create superadmin account for daniel@easy-ai.co.uk
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function createSuperadmin() {
    // DATABASE_URL should be passed as environment variable
    if (!process.env.DATABASE_URL) {
        console.error('ERROR: DATABASE_URL environment variable is not set');
        console.log('Please run this script with: $env:DATABASE_URL="your-connection-string"; node create-superadmin.js');
        process.exit(1);
    }


    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();

    try {
        console.log('Starting superadmin account creation...');

        const email = 'daniel@easy-ai.co.uk';
        const password = 'Admin123!'; // You should change this after first login
        const firstName = 'Daniel';
        const lastName = 'Admin';

        // Check if user already exists
        const existingUser = await client.query(
            'SELECT id, email FROM users WHERE email = $1',
            [email]
        );

        let userId;
        let orgId;

        if (existingUser.rows.length > 0) {
            console.log('User already exists:', existingUser.rows[0]);
            userId = existingUser.rows[0].id;

            // Reset password for existing user with new hash algorithm
            console.log('Resetting password with new bcrypt hash...');
            const passwordHash = await bcrypt.hash(password, 12);
            await client.query(
                `UPDATE auth_accounts SET password_hash = $1 WHERE user_id = $2 AND provider = 'email'`,
                [passwordHash, userId]
            );

            // Get user's org
            const orgMember = await client.query(
                'SELECT org_id FROM org_members WHERE user_id = $1 LIMIT 1',
                [userId]
            );
            orgId = orgMember.rows[0]?.org_id;
        } else {
            console.log('Creating new user account...');

            await client.query('BEGIN');

            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);

            // Create user
            const userResult = await client.query(
                `INSERT INTO users (email, first_name, last_name)
                 VALUES ($1, $2, $3)
                 RETURNING id, email, first_name, last_name`,
                [email, firstName, lastName]
            );

            userId = userResult.rows[0].id;
            console.log('User created:', userResult.rows[0]);

            // Create auth account
            await client.query(
                `INSERT INTO auth_accounts (user_id, provider, password_hash)
                 VALUES ($1, 'email', $2)`,
                [userId, passwordHash]
            );
            console.log('Auth account created');

            // Check if organization exists
            const existingOrg = await client.query(
                'SELECT id FROM organisations ORDER BY created_at ASC LIMIT 1'
            );

            if (existingOrg.rows.length > 0) {
                orgId = existingOrg.rows[0].id;
                console.log('Using existing organization:', orgId);
            } else {
                // Create organization
                const orgResult = await client.query(
                    `INSERT INTO organisations (name)
                     VALUES ($1)
                     RETURNING id`,
                    ['Superadmin Organization']
                );
                orgId = orgResult.rows[0].id;
                console.log('Organization created:', orgId);
            }

            // Add user to organization as admin
            await client.query(
                `INSERT INTO org_members (org_id, user_id, role, is_admin, is_active)
                 VALUES ($1, $2, 'admin', true, true)`,
                [orgId, userId]
            );
            console.log('User added to organization as admin');

            // Log activity
            await client.query(
                `INSERT INTO user_activity (org_id, user_id, activity_type, description)
                 VALUES ($1, $2, 'user_created', $3)`,
                [orgId, userId, `Superadmin user ${email} created`]
            );

            await client.query('COMMIT');
        }

        // Ensure is_superadmin column exists
        console.log('Ensuring is_superadmin column exists...');
        try {
            await client.query(
                `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT false`
            );
            console.log('is_superadmin column ensured');
        } catch (e) {
            console.log('Column might already exist:', e.message);
        }

        // Grant superadmin access
        console.log('Granting superadmin access...');
        const updateResult = await client.query(
            `UPDATE users SET is_superadmin = TRUE WHERE email = $1 RETURNING id, email, is_superadmin`,
            [email]
        );

        console.log('\n✅ SUCCESS! Superadmin account created/updated:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('User ID:', userId);
        console.log('Org ID:', orgId);
        console.log('Is Superadmin:', updateResult.rows[0]?.is_superadmin);
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating superadmin:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

createSuperadmin()
    .then(() => {
        console.log('\nScript completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nScript failed:', error);
        process.exit(1);
    });
