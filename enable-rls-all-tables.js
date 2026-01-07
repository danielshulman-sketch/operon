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

// All tables that need RLS enabled based on Supabase linter output
const TABLES_TO_SECURE = [
    'users',
    'org_members',
    'organisations',
    'oauth_client_credentials',
    'org_ai_settings',
    'voice_profiles',
    'detected_tasks',
    'user_activity',
    'oauth_connections',
    'bulk_draft_jobs',
    'knowledge_base',
    'org_api_keys',
    'chat_messages',
    'chat_conversations',
    'test_msgs_basic',
    'mailboxes',
    'email_messages',
    'test_msgs_uuid',
    'email_drafts',
    'user_auto_draft_settings',
    'email_replies',
    'user_email_sync_settings',
    'workflow_definitions',
    'integration_credentials',
    'workflow_run_steps',
    'workflow_runs',
    'payment_confirmations'
];

async function enableRLSOnAllTables() {
    const client = await pool.connect();

    try {
        console.log('✅ Connected to database\n');
        console.log(`=== Securing ${TABLES_TO_SECURE.length} Tables with RLS ===\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const tableName of TABLES_TO_SECURE) {
            try {
                console.log(`\n📋 Processing: ${tableName}`);

                // Check if table exists
                const tableCheck = await client.query(`
                    SELECT tablename, rowsecurity 
                    FROM pg_tables 
                    WHERE schemaname = 'public' AND tablename = $1
                `, [tableName]);

                if (tableCheck.rows.length === 0) {
                    console.log(`   ⚠️  Table not found - skipping`);
                    skipCount++;
                    continue;
                }

                const currentRLS = tableCheck.rows[0].rowsecurity;

                // Enable RLS if not already enabled
                if (!currentRLS) {
                    await client.query(`ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`);
                    console.log(`   ✅ Enabled RLS`);
                } else {
                    console.log(`   ℹ️  RLS already enabled`);
                }

                // Drop existing restrictive policy if it exists
                try {
                    await client.query(`DROP POLICY IF EXISTS "Deny all public access to ${tableName}" ON ${tableName};`);
                } catch (err) {
                    // Ignore drop errors
                }

                // Create restrictive policy to block all PostgREST access
                await client.query(`
                    CREATE POLICY "Deny all public access to ${tableName}"
                    ON ${tableName}
                    AS RESTRICTIVE
                    FOR ALL
                    USING (false);
                `);
                console.log(`   ✅ Created restrictive policy`);

                // Verify with a quick test query
                const testQuery = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
                console.log(`   ✅ Verified access (${testQuery.rows[0].count} records)`);

                successCount++;

            } catch (err) {
                console.error(`   ❌ Error: ${err.message}`);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('=== Summary ===\n');
        console.log(`✅ Successfully secured: ${successCount} tables`);
        if (skipCount > 0) console.log(`⚠️  Skipped (not found): ${skipCount} tables`);
        if (errorCount > 0) console.log(`❌ Errors: ${errorCount} tables`);
        console.log(`\n📊 Total processed: ${TABLES_TO_SECURE.length} tables`);

        // Final verification - count tables with RLS enabled
        console.log('\n=== Final Verification ===\n');
        const rlsStatus = await client.query(`
            SELECT 
                COUNT(*) FILTER (WHERE rowsecurity = true) as with_rls,
                COUNT(*) FILTER (WHERE rowsecurity = false) as without_rls,
                COUNT(*) as total
            FROM pg_tables 
            WHERE schemaname = 'public';
        `);

        const stats = rlsStatus.rows[0];
        console.log(`Tables with RLS: ${stats.with_rls}`);
        console.log(`Tables without RLS: ${stats.without_rls}`);
        console.log(`Total public tables: ${stats.total}`);

        if (parseInt(stats.without_rls) === 0) {
            console.log('\n🎉 SUCCESS! All public tables now have RLS enabled!');
        } else {
            console.log(`\n⚠️  ${stats.without_rls} tables still lack RLS`);
        }

        console.log('\n✅ Bulk RLS configuration complete!');
        console.log('\nℹ️  Note: Your application will continue to work normally.');
        console.log('   The postgres superuser role bypasses all RLS policies.\n');

    } catch (err) {
        console.error('\n❌ FATAL ERROR:', err.message);
        console.error(err.stack);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

enableRLSOnAllTables();
