const { Pool } = require('pg');

// SECURITY: Database credentials must be provided via environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ ERROR: DATABASE_URL environment variable is required');
    console.error('Please set DATABASE_URL in your environment or .env.local file');
    process.exit(1);
}

console.log('Testing connection to:', connectionString.replace(/:[^:@]+@/, ':****@'));

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Time:', res.rows[0].now);
        client.release();
        await pool.end();
        console.log('Test PASSED.');
    } catch (err) {
        console.error('Connection FAILED:', err.message);
        if (err.code) console.error('Code:', err.code);
        process.exit(1);
    }
})();
