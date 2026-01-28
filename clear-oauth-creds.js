const { Pool } = require('pg');

async function clearCredentials() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const client = await pool.connect();
        console.log('Clearing oauth_client_credentials table...');

        await client.query('DELETE FROM oauth_client_credentials');
        console.log('✅ All stored OAuth credentials deleted.');

        client.release();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

clearCredentials();
