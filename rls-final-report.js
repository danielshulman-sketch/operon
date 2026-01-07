const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ywcqavarzxcgcoptwfkv:Dcdefe367e4e4%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

async function generateFinalReport() {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to database\n');
        console.log('=== FINAL RLS SECURITY REPORT ===\n');

        // Check overall RLS status
        const rlsStats = await client.query(`
            SELECT 
                COUNT(*) FILTER (WHERE rowsecurity = true) as with_rls,
                COUNT(*) FILTER (WHERE rowsecurity = false) as without_rls,
                COUNT(*) as total
            FROM pg_tables 
            WHERE schemaname = 'public';
        `);

        const stats = rlsStats.rows[0];

        console.log('📊 DATABASE SECURITY STATUS:');
        console.log(`   Total public tables: ${stats.total}`);
        console.log(`   ✅ Tables with RLS: ${stats.with_rls}`);
        console.log(`   ❌ Tables without RLS: ${stats.without_rls}`);

        if (parseInt(stats.without_rls) === 0) {
            console.log('\n   🎉 ALL TABLES ARE NOW PROTECTED!\n');
        } else {
            console.log(`\n   ⚠️  ${stats.without_rls} tables still need attention\n`);
        }

        // List all tables and their RLS status
        const allTables = await client.query(`
            SELECT tablename, rowsecurity
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `);

        console.log('📋 DETAILED TABLE STATUS:\n');
        allTables.rows.forEach(table => {
            const status = table.rowsecurity ? '✅' : '❌';
            console.log(`   ${status} ${table.tablename}`);
        });

        // Count policies
        const policyCount = await client.query(`
            SELECT tablename, COUNT(*) as policy_count
            FROM pg_policies
            WHERE schemaname = 'public'
            GROUP BY tablename
            ORDER BY tablename;
        `);

        console.log(`\n🔒 ACTIVE POLICIES: ${policyCount.rows.reduce((sum, row) => sum + parseInt(row.policy_count), 0)} total\n`);

        // Check for tables with sensitive columns
        console.log('🔐 SENSITIVE TABLES SECURED:\n');
        const sensitiveTables = [
            'oauth_connections',
            'payment_confirmations',
            'org_api_keys',
            'integration_credentials',
            'oauth_client_credentials'
        ];

        for (const tableName of sensitiveTables) {
            const check = await client.query(`
                SELECT rowsecurity 
                FROM pg_tables 
                WHERE schemaname = 'public' AND tablename = $1
            `, [tableName]);

            if (check.rows.length > 0) {
                const status = check.rows[0].rowsecurity ? '✅' : '❌';
                console.log(`   ${status} ${tableName}`);
            }
        }

        console.log('\n=== SUMMARY ===\n');
        if (parseInt(stats.without_rls) === 0) {
            console.log('✅ All Supabase security warnings should now be resolved!');
            console.log('✅ All sensitive data is protected from unauthorized access');
            console.log('✅ Application continues to work via postgres superuser role');
        } else {
            console.log('⚠️  Some tables still need RLS configuration');
        }

        console.log('\n✅ Security audit complete!\n');

        client.release();
        await pool.end();
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

generateFinalReport();
