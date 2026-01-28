// Test database connection
require('dotenv').config({ path: '.env.local' });
const { query } = require('./app/utils/db');

async function testConnection() {
    console.log('Testing database connection...\n');

    try {
        // Test basic connection
        const timeResult = await query('SELECT NOW() as current_time');
        console.log('✅ Database connected successfully!');
        console.log('   Current time:', timeResult.rows[0].current_time);

        // Check users table
        const userCount = await query('SELECT COUNT(*) as count FROM users');
        console.log('✅ Users table exists');
        console.log('   User count:', userCount.rows[0].count);

        console.log('\n✅ All checks passed! Database is ready.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
