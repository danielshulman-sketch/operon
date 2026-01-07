const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ywcqavarzxcgcoptwfkv:Dcdefe367e4e4%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

async function enableRLS() {
    try {
        const client = await pool.connect();
        console.log('Connected to database successfully\n');

        // Enable RLS on auth_accounts
        console.log('=== Enabling RLS on auth_accounts ===');
        await client.query('ALTER TABLE auth_accounts ENABLE ROW LEVEL SECURITY;');
        console.log('✅ Enabled RLS on auth_accounts');

        // Create policies for auth_accounts
        // Policy 1: Users can view their own auth records
        console.log('\n=== Creating RLS policies for auth_accounts ===');

        try {
            await client.query(`
                CREATE POLICY "Users can view own auth accounts"
                ON auth_accounts
                FOR SELECT
                USING (user_id = current_setting('app.current_user_id')::INTEGER);
            `);
            console.log('✅ Created SELECT policy');
        } catch (err) {
            if (err.code === '42710') {
                console.log('⚠️  SELECT policy already exists, skipping');
            } else {
                throw err;
            }
        }

        // Policy 2: System/backend can insert auth records
        try {
            await client.query(`
                CREATE POLICY "Service role can insert auth accounts"
                ON auth_accounts
                FOR INSERT
                WITH CHECK (true);
            `);
            console.log('✅ Created INSERT policy');
        } catch (err) {
            if (err.code === '42710') {
                console.log('⚠️  INSERT policy already exists, skipping');
            } else {
                throw err;
            }
        }

        // Policy 3: Users can update their own auth records
        try {
            await client.query(`
                CREATE POLICY "Users can update own auth accounts"
                ON auth_accounts
                FOR UPDATE
                USING (user_id = current_setting('app.current_user_id')::INTEGER)
                WITH CHECK (user_id = current_setting('app.current_user_id')::INTEGER);
            `);
            console.log('✅ Created UPDATE policy');
        } catch (err) {
            if (err.code === '42710') {
                console.log('⚠️  UPDATE policy already exists, skipping');
            } else {
                throw err;
            }
        }

        // Policy 4: Service role can delete auth records
        try {
            await client.query(`
                CREATE POLICY "Service role can delete auth accounts"
                ON auth_accounts
                FOR DELETE
                USING (true);
            `);
            console.log('✅ Created DELETE policy');
        } catch (err) {
            if (err.code === '42710') {
                console.log('⚠️  DELETE policy already exists, skipping');
            } else {
                throw err;
            }
        }

        // Verify the changes
        console.log('\n=== Verifying RLS configuration ===');
        const checkRLS = await client.query(`
            SELECT tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public' AND tablename = 'auth_accounts';
        `);
        console.log('auth_accounts RLS status:', checkRLS.rows[0].rowsecurity);

        const checkPolicies = await client.query(`
            SELECT policyname, cmd
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename = 'auth_accounts';
        `);
        console.log('Number of policies:', checkPolicies.rows.length);
        console.table(checkPolicies.rows);

        client.release();
        await pool.end();
        console.log('\n✅ RLS successfully configured for auth_accounts');
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.code) console.error('Code:', err.code);
        if (err.stack) console.error('Stack:', err.stack);
        process.exit(1);
    }
}

enableRLS();
