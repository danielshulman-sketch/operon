/**
 * API Key Manager
 * Utilities for generating, hashing, and verifying API keys
 */

import crypto from 'crypto';
import { query } from '@/utils/db';

const API_KEY_PREFIX = 'operon';
const KEY_LENGTH = 32; // 32 bytes = 256 bits

/**
 * Generate a new API key
 * Format: operon_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * 
 * @returns {Object} { key, prefix, hash }
 */
export function generateApiKey() {
    // Generate random bytes
    const randomBytes = crypto.randomBytes(KEY_LENGTH);
    const keySecret = randomBytes.toString('base64url');

    // Create the full key with prefix
    const key = `${API_KEY_PREFIX}_live_${keySecret}`;

    // Extract prefix for display (first 12 chars after prefix)
    const prefix = `${API_KEY_PREFIX}_live_${keySecret.substring(0, 8)}...`;

    // Hash the key for storage
    const hash = hashApiKey(key);

    return {
        key,      // Full key - only show this once to user
        prefix,   // Display prefix
        hash      // Store this in database
    };
}

/**
 * Hash an API key for secure storage
 * Uses SHA-256 for one-way hashing
 * 
 * @param {string} key - The API key to hash
 * @returns {string} Hashed key
 */
export function hashApiKey(key) {
    return crypto
        .createHash('sha256')
        .update(key)
        .digest('hex');
}

/**
 * Verify an API key and return associated org
 * 
 * @param {string} key - The API key to verify
 * @returns {Promise<Object|null>} Organization info or null if invalid
 */
export async function verifyApiKey(key) {
    if (!key || !key.startsWith(`${API_KEY_PREFIX}_`)) {
        return null;
    }

    const hash = hashApiKey(key);

    try {
        const result = await query(
            `SELECT ak.id, ak.org_id, ak.name, o.name as org_name
             FROM api_keys ak
             JOIN organizations o ON o.id = ak.org_id
             WHERE ak.key_hash = $1 AND ak.is_active = true`,
            [hash]
        );

        if (result.rows.length === 0) {
            return null;
        }

        // Update last_used_at timestamp
        await query(
            `UPDATE api_keys SET last_used_at = NOW() WHERE id = $1`,
            [result.rows[0].id]
        );

        return {
            apiKeyId: result.rows[0].id,
            orgId: result.rows[0].org_id,
            orgName: result.rows[0].org_name,
            keyName: result.rows[0].name
        };
    } catch (error) {
        console.error('API key verification error:', error);
        return null;
    }
}

/**
 * Create a new API key for an organization
 * 
 * @param {string} orgId - Organization UUID
 * @param {string} name - Name/description for the key
 * @param {string} createdBy - User UUID who created the key
 * @returns {Promise<Object>} { key, id, prefix }
 */
export async function createApiKey(orgId, name, createdBy, description = null) {
    const { key, prefix, hash } = generateApiKey();

    try {
        const result = await query(
            `INSERT INTO api_keys (org_id, key_hash, key_prefix, name, description, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, created_at`,
            [orgId, hash, prefix, name, description, createdBy]
        );

        return {
            key,        // Full key - only returned once
            id: result.rows[0].id,
            prefix,
            createdAt: result.rows[0].created_at
        };
    } catch (error) {
        console.error('API key creation error:', error);
        throw new Error('Failed to create API key');
    }
}

/**
 * Revoke/delete an API key
 * 
 * @param {number} keyId - API key ID
 * @param {string} orgId - Organization UUID (for security check)
 * @returns {Promise<boolean>} Success status
 */
export async function revokeApiKey(keyId, orgId) {
    try {
        const result = await query(
            `UPDATE api_keys 
             SET is_active = false 
             WHERE id = $1 AND org_id = $2
             RETURNING id`,
            [keyId, orgId]
        );

        return result.rows.length > 0;
    } catch (error) {
        console.error('API key revocation error:', error);
        return false;
    }
}

/**
 * List all API keys for an organization
 * (Does not return actual keys, only metadata)
 * 
 * @param {string} orgId - Organization UUID
 * @returns {Promise<Array>} List of API keys
 */
export async function listApiKeys(orgId) {
    try {
        const result = await query(
            `SELECT id, key_prefix, name, description, last_used_at, created_at, is_active
             FROM api_keys
             WHERE org_id = $1
             ORDER BY created_at DESC`,
            [orgId]
        );

        return result.rows;
    } catch (error) {
        console.error('List API keys error:', error);
        return [];
    }
}

/**
 * Check rate limit for an API key
 * Returns true if request should be allowed, false if rate limited
 * 
 * @param {string} keyHash - Hashed API key
 * @param {number} limit - Requests per minute limit (default: 100)
 * @returns {Promise<Object>} { allowed, remaining, resetAt }
 */
export async function checkRateLimit(keyHash, limit = 100) {
    const windowStart = new Date();
    windowStart.setSeconds(0, 0); // Round to minute

    try {
        // Upsert rate limit record
        const result = await query(
            `INSERT INTO api_rate_limits (api_key_hash, window_start, request_count)
             VALUES ($1, $2, 1)
             ON CONFLICT (api_key_hash, window_start)
             DO UPDATE SET request_count = api_rate_limits.request_count + 1
             RETURNING request_count`,
            [keyHash, windowStart]
        );

        const count = result.rows[0].request_count;
        const resetAt = new Date(windowStart);
        resetAt.setMinutes(resetAt.getMinutes() + 1);

        return {
            allowed: count <= limit,
            remaining: Math.max(0, limit - count),
            resetAt: resetAt.toISOString(),
            limit
        };
    } catch (error) {
        console.error('Rate limit check error:', error);
        // Allow request on error to avoid blocking legitimate traffic
        return { allowed: true, remaining: limit, resetAt: null, limit };
    }
}

/**
 * Clean up old rate limit records (older than 1 hour)
 * Should be called periodically
 */
export async function cleanupRateLimits() {
    try {
        await query(
            `DELETE FROM api_rate_limits 
             WHERE created_at < NOW() - INTERVAL '1 hour'`
        );
    } catch (error) {
        console.error('Rate limit cleanup error:', error);
    }
}
