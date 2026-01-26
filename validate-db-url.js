const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const url = process.env.DATABASE_URL;

if (!url) {
    console.log('DATABASE_URL is missing');
} else {
    try {
        // Handle postgres:// or postgresql://
        const parsed = new URL(url);
        console.log('Protocol:', parsed.protocol);
        console.log('Hostname:', parsed.hostname);
        console.log('Port:', parsed.port);
        console.log('Database:', parsed.pathname);
    } catch (e) {
        console.log('Error parsing URL:', e.message);
        console.log('Raw start:', url.substring(0, 15) + '...');
    }
}
