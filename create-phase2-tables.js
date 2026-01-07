/**
 * Phase 2 Compliance: Marketing Consent & Unsubscribe Tables
 * 
 * This script creates the necessary database tables for PECR compliance:
 * - marketing_consents: Tracks user consent for marketing communications
 * - unsubscribe_tokens: Manages one-click unsubscribe tokens
 * 
 * Run with: node create-phase2-tables.js
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createPhase2Tables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Create marketing_consents table
        console.log('\n📧 Creating marketing_consents table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS marketing_consents (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                consent_type VARCHAR(50) NOT NULL,
                consented BOOLEAN NOT NULL,
                consented_at TIMESTAMP NOT NULL,
                consent_source VARCHAR(100) NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_user_consent UNIQUE(user_id, consent_type)
            );
        `);
        console.log('✅ marketing_consents table created');

        // Create index for faster lookups
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_marketing_consents_user 
            ON marketing_consents(user_id);
        `);
        console.log('✅ Index created on user_id');

        // Enable RLS
        console.log('\n🔒 Enabling Row Level Security...');
        await client.query(`
            ALTER TABLE marketing_consents ENABLE ROW LEVEL SECURITY;
        `);

        // Create RLS policy
        await client.query(`
            DROP POLICY IF EXISTS block_non_superuser_access ON marketing_consents;
            CREATE POLICY block_non_superuser_access ON marketing_consents
                FOR ALL USING (current_user = 'postgres');
        `);
        console.log('✅ RLS enabled with restrictive policy');

        // Create unsubscribe_tokens table
        console.log('\n🔗 Creating unsubscribe_tokens table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS unsubscribe_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                token VARCHAR(64) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                used_at TIMESTAMP
            );
        `);
        console.log('✅ unsubscribe_tokens table created');

        // Create indexes
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_user 
            ON unsubscribe_tokens(user_id);
            
            CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_token 
            ON unsubscribe_tokens(token);
        `);
        console.log('✅ Indexes created');

        // Enable RLS
        await client.query(`
            ALTER TABLE unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
        `);

        await client.query(`
            DROP POLICY IF EXISTS block_non_superuser_access ON unsubscribe_tokens;
            CREATE POLICY block_non_superuser_access ON unsubscribe_tokens
                FOR ALL USING (current_user = 'postgres');
        `);
        console.log('✅ RLS enabled on unsubscribe_tokens');

        // Verify tables
        console.log('\n✨ Verifying tables...');
        const result = await client.query(`
            SELECT table_name, 
                   pg_catalog.obj_description(c.oid, 'pg_class') as description
            FROM information_schema.tables t
            LEFT JOIN pg_catalog.pg_class c ON c.relname = t.table_name
            WHERE table_schema = 'public' 
            AND table_name IN ('marketing_consents', 'unsubscribe_tokens')
            ORDER BY table_name;
        `);

        console.log('\nTables created:');
        result.rows.forEach(row => {
            console.log(`  ✓ ${row.table_name}`);
        });

        // Check RLS status
        const rlsResult = await client.query(`
            SELECT tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename IN ('marketing_consents', 'unsubscribe_tokens');
        `);

        console.log('\nRLS Status:');
        rlsResult.rows.forEach(row => {
            console.log(`  ${row.tablename}: ${row.rowsecurity ? '🔒 Enabled' : '⚠️ Disabled'}`);
        });

        console.log('\n✅ Phase 2 database tables created successfully!');
        console.log('\nNext steps:');
        console.log('1. Implement marketing consent API endpoints');
        console.log('2. Add consent checkbox to signup form');
        console.log('3. Create unsubscribe page and token generation');

    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
        throw error;
    } finally {
        await client.end();
        console.log('\nDatabase connection closed');
    }
}

// Run the script
if (require.main === module) {
    createPhase2Tables()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { createPhase2Tables };
