const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createMailboxesTable() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        console.log('Creating mailboxes table...');

        // Create mailboxes table
        await client.query(`
            CREATE TABLE IF NOT EXISTS mailboxes (
                id SERIAL PRIMARY KEY,
                org_id INTEGER REFERENCES organisations(id),
                user_id INTEGER REFERENCES users(id),
                email_address VARCHAR(255) NOT NULL,
                imap_host VARCHAR(255) NOT NULL,
                imap_port INTEGER,
                smtp_host VARCHAR(255) NOT NULL,
                smtp_port INTEGER,
                password_encrypted TEXT NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_org_email UNIQUE(org_id, email_address)
            );
        `);

        console.log('✅ mailboxes table created successfully');

        // Create indexes
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_mailboxes_org_id ON mailboxes(org_id);
            CREATE INDEX IF NOT EXISTS idx_mailboxes_user_id ON mailboxes(user_id);
        `);
        console.log('✅ Indexes created');

        // Enable RLS
        await client.query(`
            ALTER TABLE mailboxes ENABLE ROW LEVEL SECURITY;
        `);
        console.log('✅ RLS enabled');

        // Create RLS policy
        // Allow users to see their own mailboxes (or org mailboxes)
        // For now, we'll use a simple policy similar to others or just allow all for authenticated users if we were using Supabase client,
        // but since this is direct PG, the app handles auth. 
        // We'll add a policy that allows everything for the postgres user (service role) which the app uses.
        await client.query(`
            DROP POLICY IF EXISTS service_role_access ON mailboxes;
            CREATE POLICY service_role_access ON mailboxes
                FOR ALL USING (current_user = 'postgres' OR current_user = 'doadmin'); -- Adjust based on actual DB user
        `);
        // Note: 'doadmin' is common for DigitalOcean, 'postgres' for local/others. 
        // A safer generic RLS for service role is often not needed if we connect as superuser, 
        // but it's good practice if RLS is on.

        console.log('✅ RLS policy configured');

    } catch (error) {
        console.error('Error creating mailboxes table:', error);
        throw error;
    } finally {
        await client.end();
    }
}

createMailboxesTable()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
