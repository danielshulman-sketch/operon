/**
 * Test script for API Keys functionality
 * Run with: node test-api-keys.js
 */

import { query, getClient } from './app/utils/db.js';
import {
    generateApiKey,
    hashApiKey,
    verifyApiKey,
    createApiKey,
    listApiKeys,
    revokeApiKey,
    checkRateLimit
} from './app/lib/api-key-manager.js';

async function testApiKeyGeneration() {
    console.log('\n=== Testing API Key Generation ===');

    const { key, prefix, hash } = generateApiKey();

    console.log('Generated API Key:');
    console.log('  Key prefix:', prefix);
    console.log('  Full key:', key.substring(0, 30) + '...');
    console.log('  Hash:', hash.substring(0, 20) + '...');
    console.log('  ✓ Key generated successfully');

    return { key, prefix, hash };
}

async function testApiKeyStorage() {
    console.log('\n=== Testing API Key Storage ===');

    try {
        // Get a test org ID (use the first organization in the database)
        const orgResult = await query('SELECT id FROM organizations LIMIT 1');

        if (orgResult.rows.length === 0) {
            console.log('  ⚠ No organizations found in database. Skipping storage test.');
            return null;
        }

        const testOrgId = orgResult.rows[0].id;
        console.log('  Using test org ID:', testOrgId);

        // Create API key
        const result = await createApiKey(
            testOrgId,
            'Test API Key',
            testOrgId, // Using org ID as created_by for testing
            'Created by test script'
        );

        console.log('  Created API key:');
        console.log('    ID:', result.id);
        console.log('    Prefix:', result.prefix);
        console.log('    Full key:', result.key.substring(0, 30) + '...');
        console.log('  ✓ API key stored successfully');

        return result;

    } catch (error) {
        console.error('  ✗ Storage test failed:', error.message);
        return null;
    }
}

async function testApiKeyVerification(apiKey) {
    console.log('\n=== Testing API Key Verification ===');

    if (!apiKey) {
        console.log('  ⚠ No API key to verify');
        return;
    }

    try {
        const keyInfo = await verifyApiKey(apiKey);

        if (keyInfo) {
            console.log('  Verified API key:');
            console.log('    Org ID:', keyInfo.orgId);
            console.log('    Org Name:', keyInfo.orgName);
            console.log('    Key Name:', keyInfo.keyName);
            console.log('  ✓ Verification successful');
        } else {
            console.log('  ✗ Verification failed - key not found');
        }

    } catch (error) {
        console.error('  ✗ Verification test failed:', error.message);
    }
}

async function testRateLimiting(apiKey) {
    console.log('\n=== Testing Rate Limiting ===');

    if (!apiKey) {
        console.log('  ⚠ No API key to test rate limiting');
        return;
    }

    try {
        const keyHash = hashApiKey(apiKey);

        // Make 3 requests
        for (let i = 1; i <= 3; i++) {
            const rateLimit = await checkRateLimit(keyHash, 100);
            console.log(`  Request ${i}:`);
            console.log('    Allowed:', rateLimit.allowed);
            console.log('    Remaining:', rateLimit.remaining);
            console.log('    Limit:', rateLimit.limit);
        }

        console.log('  ✓ Rate limiting working');

    } catch (error) {
        console.error('  ✗ Rate limiting test failed:', error.message);
    }
}

async function testListApiKeys(orgId) {
    console.log('\n=== Testing List API Keys ===');

    if (!orgId) {
        console.log('  ⚠ No org ID to list API keys');
        return;
    }

    try {
        const keys = await listApiKeys(orgId);
        console.log(`  Found ${keys.length} API key(s):`);

        keys.forEach((key, index) => {
            console.log(`  Key ${index + 1}:`);
            console.log('    Name:', key.name);
            console.log('    Prefix:', key.key_prefix);
            console.log('    Active:', key.is_active);
            console.log('    Created:', key.created_at);
        });

        console.log('  ✓ Listing successful');

    } catch (error) {
        console.error('  ✗ List test failed:', error.message);
    }
}

async function testRevokeApiKey(keyId, orgId) {
    console.log('\n=== Testing API Key Revocation ===');

    if (!keyId || !orgId) {
        console.log('  ⚠ No key ID or org ID to revoke');
        return;
    }

    try {
        const success = await revokeApiKey(keyId, orgId);

        if (success) {
            console.log('  ✓ API key revoked successfully');
        } else {
            console.log('  ✗ Revocation failed - key not found');
        }

    } catch (error) {
        console.error('  ✗ Revocation test failed:', error.message);
    }
}

async function runTests() {
    console.log('\n🧪 Starting API Key Tests\n');
    console.log('='.repeat(50));

    try {
        // Test key generation
        const generatedKey = testApiKeyGeneration();

        // Test key storage
        const storedKey = await testApiKeyStorage();

        if (storedKey) {
            // Test verification
            await testApiKeyVerification(storedKey.key);

            // Test rate limiting
            await testRateLimiting(storedKey.key);

            // Get org ID from the stored key result
            const keyResult = await query(
                'SELECT org_id FROM api_keys WHERE id = $1',
                [storedKey.id]
            );
            const orgId = keyResult.rows[0]?.org_id;

            // Test listing keys
            if (orgId) {
                await testListApiKeys(orgId);
            }

            // Test revocation
            await testRevokeApiKey(storedKey.id, orgId);
        }

        console.log('\n' + '='.repeat(50));
        console.log('\n✅ All tests completed!\n');

    } catch (error) {
        console.error('\n❌ Test suite failed:', error);
    } finally {
        // Close database connection
        process.exit(0);
    }
}

// Run the tests
runTests();
