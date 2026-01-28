import { query } from './app/utils/db.js';
import { verifyPassword, generateToken } from './app/utils/auth.js';

async function testSigninDebug() {
    try {
        const email = 'daniel@easy-ai.co.uk';
        const password = 'test123';

        console.log('Testing signin with email:', email);
        console.log('\\n1. Running query to get user...');

        const result = await query(
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

        console.log('Query result rows:', result.rows.length);

        if (result.rows.length === 0) {
            console.log('No user found');
            return;
        }

        const user = result.rows[0];
        console.log('User found:', user.email);
        console.log('Is active:', user.is_active);

        if (!user.is_active) {
            console.log('User is inactive');
            return;
        }

        console.log('\\n2. Verifying password...');
        const isValid = await verifyPassword(user.password_hash, password);
        console.log('Password valid:', isValid);

        console.log('\\n3. Logging activity...');
        await query(
            `INSERT INTO user_activity (org_id, user_id, activity_type, description)
       VALUES ($1, $2, 'user_signin', $3)`,
            [user.org_id, user.id, `User ${email} signed in`]
        );
        console.log('Activity logged successfully');

        console.log('\\n4. Generating token...');
        const token = generateToken({ userId: user.id, orgId: user.org_id });
        console.log('Token generated:', token.substring(0, 20) + '...');

        console.log('\\n✅ Signin flow completed successfully');

    } catch (error) {
        console.error('\\n❌ ERROR:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
    }

    process.exit(0);
}

testSigninDebug();
