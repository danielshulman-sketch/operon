-- API Keys and Webhooks Infrastructure Migration
-- This migration creates tables for API key management and webhook subscriptions

-- ============================================================
-- API Keys Table
-- ============================================================
-- Store API keys for programmatic access to Operon
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    org_id UUID NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    is_active BOOLEAN DEFAULT true
);

-- Indexes for API keys
CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- ============================================================
-- Webhooks Table
-- ============================================================
-- Store webhook subscriptions for event notifications
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    org_id UUID NOT NULL,
    url TEXT NOT NULL,
    events JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT,
    secret TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_org ON webhooks(org_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active);
CREATE INDEX IF NOT EXISTS idx_webhooks_events ON webhooks USING gin(events);

-- ============================================================
-- Webhook Deliveries Table
-- ============================================================
-- Log webhook delivery attempts for debugging and monitoring
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id SERIAL PRIMARY KEY,
    webhook_id INTEGER NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'pending', 'success', 'failed'
    response_code INTEGER,
    response_body TEXT,
    error_message TEXT,
    attempts INTEGER DEFAULT 0,
    next_retry_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Indexes for webhook deliveries
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created ON webhook_deliveries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_retry ON webhook_deliveries(next_retry_at) WHERE status = 'pending';

-- ============================================================
-- Rate Limiting Table
-- ============================================================
-- Track API usage for rate limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id SERIAL PRIMARY KEY,
    api_key_hash TEXT NOT NULL,
    window_start TIMESTAMP NOT NULL,
    request_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(api_key_hash, window_start)
);

-- Indexes for rate limits
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_window ON api_rate_limits(api_key_hash, window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created ON api_rate_limits(created_at);

-- Clean up old rate limit data (older than 1 hour)
-- Should be run periodically
COMMENT ON TABLE api_rate_limits IS 'Store API request counts for rate limiting. Clean up records older than 1 hour periodically.';
