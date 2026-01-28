const { Pool } = require('pg');

async function checkCredentials() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const client = await pool.connect();
        console.log('Checking oauth_client_credentials table...');

        const res = await client.query('SELECT * FROM oauth_client_credentials');

        if (res.rows.length === 0) {
            console.log('Table is empty.');
        } else {
            console.log('Found', res.rows.length, 'entries:');
            res.rows.forEach(row => {
                console.log(`- Integration: ${row.integration_name}`);
                // Verify if client_id matches the old one without decrypting (if strictly stored)
                // Note: client_id is likely encrypted, so just listing rows confirms presence.
            });
        }

        client.release();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

checkCredentials();
