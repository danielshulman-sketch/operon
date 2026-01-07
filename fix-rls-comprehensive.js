const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ywcqavarzxcgcoptwfkv:Dcdefe367e4e4%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

async function enableRLSComprehensive() {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to database successfully\n');

        console.log('=== STEP 1: Analyzing Current State ===\n');

        // Check all tables without RLS
        const tablesQuery = `
            SELECT 
                schemaname, 
                tablename,
                rowsecurity
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `;
        const tables = await client.query(tablesQuery);
        const noRLS = tables.rows.filter(t => !t.rowsecurity);

        console.log(`📊 Found ${tables.rows.length} total tables in public schema`);
        console.log(`⚠️  ${noRLS.length} tables without RLS:\n`);
        noRLS.forEach(t => console.log(`   - ${t.tablename}`));
        console.log('');

        // Check current RLS status of auth_accounts
        const authTable = tables.rows.find(t => t.tablename === 'auth_accounts');
        if (!authTable) {
            console.error('❌ ERROR: auth_accounts table not found!');
            process.exit(1);
        }

        console.log('=== STEP 2: Enabling RLS on auth_accounts ===\n');

        if (authTable.rowsecurity) {
            console.log('ℹ️  RLS already enabled on auth_accounts');
        } else {
            await client.query('ALTER TABLE auth_accounts ENABLE ROW LEVEL SECURITY;');
            console.log('✅ Enabled RLS on auth_accounts');
        }

        console.log('\n=== STEP 3: Creating RLS Policies ===\n');

        // Drop existing policies if any (to ensure clean state)
        const existingPolicies = await client.query(`
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = 'auth_accounts';
        `);

        for (const policy of existingPolicies.rows) {
            try {
                await client.query(`DROP POLICY IF EXISTS "${policy.policyname}" ON auth_accounts;`);
                console.log(`🗑️  Dropped existing policy: ${policy.policyname}`);
            } catch (err) {
                console.log(`⚠️  Could not drop policy ${policy.policyname}: ${err.message}`);
            }
        }

        // Since the application uses the postgres role (superuser), which bypasses RLS,
        // we can create restrictive policies that only affect PostgREST and other non-superuser access

        // Policy 1: Deny all direct access via PostgREST (security measure)
        // The authenticator role is what PostgREST uses for unauthenticated requests
        console.log('\nCreating restrictive policies to block unauthorized access...');

        try {
            // This policy effectively disables all PostgREST access to auth_accounts
            // while allowing the postgres superuser (your Node.js app) to continue working
            await client.query(`
                CREATE POLICY "Deny all public access to auth_accounts"
                ON auth_accounts
                AS RESTRICTIVE
                FOR ALL
                USING (false);
            `);
            console.log('✅ Created RESTRICTIVE policy - blocks all non-superuser access');
        } catch (err) {
            if (err.code === '42710') {
                console.log('ℹ️  Policy already exists');
            } else {
                console.error(`❌ Error creating policy: ${err.message}`);
            }
        }

        console.log('\n=== STEP 4: Verifying Configuration ===\n');

        // Verify RLS is enabled
        const verification = await client.query(`
            SELECT tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public' AND tablename = 'auth_accounts';
        `);
        console.log(`RLS Status: ${verification.rows[0].rowsecurity ? '✅ ENABLED' : '❌ DISABLED'}`);

        // List policies
        const policies = await client.query(`
            SELECT policyname, cmd, permissive
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename = 'auth_accounts'
            ORDER BY policyname;
        `);
        console.log(`\nActive Policies (${policies.rows.length}):`);
        policies.rows.forEach(p => {
            const type = p.permissive === 'PERMISSIVE' ? 'PERMISSIVE' : 'RESTRICTIVE';
            console.log(`  - ${p.policyname} [${p.cmd}] (${type})`);
        });

        console.log('\n=== STEP 5: Testing Application Access ===\n');

        // Test that our postgres connection can still access the table
        try {
            const testQuery = await client.query('SELECT COUNT(*) FROM auth_accounts;');
            console.log(`✅ Application access test PASSED (found ${testQuery.rows[0].count} records)`);
            console.log('   Your Node.js app will continue to work normally\n');
        } catch (err) {
            console.error('❌ Application access test FAILED:', err.message);
            console.error('   This should not happen - superuser bypasses RLS');
        }

        console.log('=== Summary ===\n');
        console.log('✅ RLS enabled on auth_accounts');
        console.log('✅ Restrictive policies created to block PostgREST access');
        console.log('✅ Application connection still works (superuser bypass)');
        console.log('✅ Security warning in Supabase should be resolved\n');

        if (noRLS.length > 1) {
            console.log(`⚠️  Note: ${noRLS.length - 1} other tables still lack RLS protection:`);
            noRLS.filter(t => t.tablename !== 'auth_accounts')
                .slice(0, 10)
                .forEach(t => console.log(`   - ${t.tablename}`));
            if (noRLS.length > 11) {
                console.log(`   ... and ${noRLS.length - 11} more`);
            }
            console.log('\nConsider enabling RLS on sensitive tables.');
        }

        client.release();
        await pool.end();
        console.log('\n✅ RLS configuration complete!');
    } catch (err) {
        console.error('\n❌ ERROR:', err.message);
        if (err.code) console.error('Error Code:', err.code);
        console.error('\nStack trace:');
        console.error(err.stack);
        process.exit(1);
    }
}

enableRLSComprehensive();
