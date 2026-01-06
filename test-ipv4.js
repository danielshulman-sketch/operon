const { Pool } = require('pg');

// Use the IPv4 URL provided by user
const connectionString = 'postgresql://postgres.ywcqavarzxcgcoptwfkv:Dcdefe367e4e4%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

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
