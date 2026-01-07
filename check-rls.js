const { Pool } = require('pg');

// SECURITY: Database credentials must be provided via environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ ERROR: DATABASE_URL environment variable is required');
    console.error('Please set DATABASE_URL in your environment or .env.local file');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

async function checkAndFixRLS() {
    try {
        const client = await pool.connect();
        console.log('Connected to database successfully\n');

        // 1. Check all tables in public schema
        console.log('=== Checking all tables in public schema ===');
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
        console.log('\nCurrent table security status:');
        console.table(tables.rows);

        // 2. Check specifically for auth_accounts
        console.log('\n=== Checking auth_accounts table ===');
        const authAccountsCheck = tables.rows.find(t => t.tablename === 'auth_accounts');
        if (!authAccountsCheck) {
            console.log('❌ auth_accounts table not found!');
        } else {
            console.log(`auth_accounts RLS enabled: ${authAccountsCheck.rowsecurity}`);
        }

        // 3. List all tables without RLS
        const noRLS = tables.rows.filter(t => !t.rowsecurity);
        if (noRLS.length > 0) {
            console.log('\n⚠️  Tables without RLS enabled:');
            noRLS.forEach(t => console.log(`  - ${t.tablename}`));
        } else {
            console.log('\n✅ All tables have RLS enabled');
        }

        // 4. Check existing policies on auth_accounts
        console.log('\n=== Checking existing policies on auth_accounts ===');
        const policiesQuery = `
            SELECT 
                schemaname,
                tablename,
                policyname,
                permissive,
                roles,
                cmd,
                qual,
                with_check
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename = 'auth_accounts';
        `;
        const policies = await client.query(policiesQuery);
        if (policies.rows.length === 0) {
            console.log('No policies found for auth_accounts');
        } else {
            console.log('Existing policies:');
            console.table(policies.rows);
        }

        client.release();
        await pool.end();
        console.log('\n✅ Analysis complete');
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.code) console.error('Code:', err.code);
        process.exit(1);
    }
}

checkAndFixRLS();
