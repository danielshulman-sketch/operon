#!/usr/bin/env node

/**
 * Interactive Google OAuth Setup Script
 * 
 * This script helps you easily configure Google OAuth credentials
 * for Google Sign-In and Google Workspace integrations.
 * 
 * Usage: node setup-google-oauth.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function printHeader() {
    console.clear();
    log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
    log('║         Google OAuth Setup for Operon                        ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');
}

function printInstructions() {
    log('📋 Before you begin, make sure you have:', 'blue');
    log('   1. A Google Cloud Console account', 'blue');
    log('   2. Created an OAuth 2.0 Client ID (Web application)', 'blue');
    log('   3. Added redirect URI: http://localhost:3000/api/auth/google/callback', 'blue');
    log('\n💡 Need help? Follow the guide:', 'yellow');
    log('   https://console.cloud.google.com/ → APIs & Services → Credentials\n', 'yellow');
}

async function getCurrentEnvValues() {
    const envPath = path.join(__dirname, '.env.local');

    if (!fs.existsSync(envPath)) {
        return { clientId: '', clientSecret: '', appUrl: 'http://localhost:3000' };
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    let clientId = '';
    let clientSecret = '';
    let appUrl = 'http://localhost:3000';

    lines.forEach(line => {
        if (line.startsWith('GOOGLE_OAUTH_CLIENT_ID=')) {
            clientId = line.split('=')[1]?.trim() || '';
        }
        if (line.startsWith('GOOGLE_OAUTH_CLIENT_SECRET=')) {
            clientSecret = line.split('=')[1]?.trim() || '';
        }
        if (line.startsWith('NEXT_PUBLIC_APP_URL=')) {
            appUrl = line.split('=')[1]?.trim() || 'http://localhost:3000';
        }
    });

    return { clientId, clientSecret, appUrl };
}

async function updateEnvFile(clientId, clientSecret, appUrl) {
    const envPath = path.join(__dirname, '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Check if Google OAuth section exists
    if (envContent.includes('GOOGLE_OAUTH_CLIENT_ID=')) {
        // Update existing values
        envContent = envContent
            .replace(/GOOGLE_OAUTH_CLIENT_ID=.*/g, `GOOGLE_OAUTH_CLIENT_ID=${clientId}`)
            .replace(/GOOGLE_OAUTH_CLIENT_SECRET=.*/g, `GOOGLE_OAUTH_CLIENT_SECRET=${clientSecret}`)
            .replace(/NEXT_PUBLIC_APP_URL=.*/g, `NEXT_PUBLIC_APP_URL=${appUrl}`);
    } else {
        // Add new section
        envContent += `\n# Google OAuth Configuration\nGOOGLE_OAUTH_CLIENT_ID=${clientId}\nGOOGLE_OAUTH_CLIENT_SECRET=${clientSecret}\nNEXT_PUBLIC_APP_URL=${appUrl}\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
}

async function validateCredentials(clientId, clientSecret) {
    const errors = [];

    if (!clientId) {
        errors.push('Client ID is required');
    } else if (!clientId.endsWith('.apps.googleusercontent.com')) {
        errors.push('Client ID should end with .apps.googleusercontent.com');
    }

    if (!clientSecret) {
        errors.push('Client Secret is required');
    } else if (clientSecret.length < 20) {
        errors.push('Client Secret seems too short (should be 24+ characters)');
    }

    return errors;
}

async function main() {
    printHeader();
    printInstructions();

    log('─'.repeat(50), 'cyan');
    log('Press Enter to continue or Ctrl+C to cancel...\n', 'yellow');
    await question('');

    const current = await getCurrentEnvValues();

    // Show current values if they exist
    if (current.clientId && !current.clientId.includes('your_client_id_here')) {
        log('📌 Current configuration found:', 'green');
        log(`   Client ID: ${current.clientId.substring(0, 20)}...`, 'green');
        log(`   Client Secret: ${current.clientSecret.substring(0, 10)}...`, 'green');
        log(`   App URL: ${current.appUrl}\n`, 'green');

        const update = await question('Do you want to update these values? (y/n): ');
        if (update.toLowerCase() !== 'y') {
            log('\n✅ Setup cancelled. Using existing configuration.', 'green');
            rl.close();
            return;
        }
        console.log('');
    }

    // Get Google OAuth Client ID
    log('🔑 Enter your Google OAuth credentials:\n', 'bright');
    const defaultClientId = current.clientId.includes('your_client_id_here') ? '' : current.clientId;
    const clientIdPrompt = defaultClientId
        ? `Google OAuth Client ID (current: ${defaultClientId.substring(0, 20)}...): `
        : 'Google OAuth Client ID (e.g., 123456-abc.apps.googleusercontent.com): ';

    let clientId = await question(clientIdPrompt);
    clientId = clientId.trim() || defaultClientId;

    // Get Google OAuth Client Secret
    const defaultSecret = current.clientSecret.includes('your_client_secret_here') ? '' : current.clientSecret;
    const secretPrompt = defaultSecret
        ? `Google OAuth Client Secret (current: ${defaultSecret.substring(0, 10)}...): `
        : 'Google OAuth Client Secret (e.g., GOCSPX-abc123xyz...): ';

    let clientSecret = await question(secretPrompt);
    clientSecret = clientSecret.trim() || defaultSecret;

    // Get App URL
    const appUrlPrompt = `App URL (default: ${current.appUrl}): `;
    let appUrl = await question(appUrlPrompt);
    appUrl = appUrl.trim() || current.appUrl;

    // Validate
    console.log('');
    log('🔍 Validating credentials...', 'yellow');
    const errors = await validateCredentials(clientId, clientSecret);

    if (errors.length > 0) {
        log('\n❌ Validation errors:', 'red');
        errors.forEach(err => log(`   • ${err}`, 'red'));
        log('\nPlease run the script again with correct credentials.', 'yellow');
        rl.close();
        process.exit(1);
    }

    log('✅ Credentials validated!\n', 'green');

    // Show summary
    log('📋 Summary:', 'cyan');
    log(`   Client ID: ${clientId.substring(0, 30)}...`, 'cyan');
    log(`   Client Secret: ${clientSecret.substring(0, 15)}...`, 'cyan');
    log(`   App URL: ${appUrl}`, 'cyan');
    log(`   Redirect URI: ${appUrl}/api/auth/google/callback\n`, 'cyan');

    const confirm = await question('Save these credentials to .env.local? (y/n): ');

    if (confirm.toLowerCase() === 'y') {
        try {
            await updateEnvFile(clientId, clientSecret, appUrl);
            log('\n✅ Configuration saved successfully!', 'green');
            log('\n📝 Next steps:', 'blue');
            log('   1. Restart your development server (npm run dev)', 'blue');
            log('   2. Go to your login page', 'blue');
            log('   3. Click "Sign in with Google"', 'blue');
            log('   4. Authorize with your Google account\n', 'blue');
            log('🎉 Google OAuth is now configured!', 'green');
        } catch (error) {
            log(`\n❌ Error saving configuration: ${error.message}`, 'red');
            process.exit(1);
        }
    } else {
        log('\n❌ Setup cancelled.', 'yellow');
    }

    rl.close();
}

main().catch(error => {
    log(`\n❌ Error: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
});
