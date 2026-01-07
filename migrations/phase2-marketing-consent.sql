-- Phase 2 Marketing Compliance: Database Migration
-- Run this in Supabase SQL Editor
-- Creates marketing_consents and unsubscribe_tokens tables with RLS

-- ============================================================================
-- Table: marketing_consents
-- Purpose: Track user consent for marketing communications (PECR compliance)
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketing_consents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,  -- 'email_marketing', 'sms_marketing'
    consented BOOLEAN NOT NULL,
    consented_at TIMESTAMP NOT NULL,
    consent_source VARCHAR(100) NOT NULL,  -- 'signup_form', 'settings_page', 'unsubscribe_link'
    ip_address VARCHAR(45),
    user_agent TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_consent UNIQUE(user_id, consent_type)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_marketing_consents_user ON marketing_consents(user_id);

-- Enable Row Level Security
ALTER TABLE marketing_consents ENABLE ROW LEVEL SECURITY;

-- Create restrictive RLS policy (server-side access only)
DROP POLICY IF EXISTS block_non_superuser_access ON marketing_consents;
CREATE POLICY block_non_superuser_access ON marketing_consents
    FOR ALL USING (current_user = 'postgres');

-- ============================================================================
-- Table: unsubscribe_tokens
-- Purpose: Manage one-click unsubscribe tokens (PECR compliance)
-- ============================================================================

CREATE TABLE IF NOT EXISTS unsubscribe_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,  -- 90 days from creation
    used_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_user ON unsubscribe_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_token ON unsubscribe_tokens(token);

-- Enable Row Level Security
ALTER TABLE unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- Create restrictive RLS policy
DROP POLICY IF EXISTS block_non_superuser_access ON unsubscribe_tokens;
CREATE POLICY block_non_superuser_access ON unsubscribe_tokens
    FOR ALL USING (current_user = 'postgres');

-- ============================================================================
-- Verification Queries
-- Run these to confirm tables were created correctly
-- ============================================================================

-- Check tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('marketing_consents', 'unsubscribe_tokens');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('marketing_consents', 'unsubscribe_tokens');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('marketing_consents', 'unsubscribe_tokens');

-- ============================================================================
-- Sample Data (Optional - for testing)
-- ============================================================================

-- Example: Record consent for user ID 1
-- INSERT INTO marketing_consents 
--   (user_id, consent_type, consented, consented_at, consent_source, ip_address)
-- VALUES 
--   (1, 'email_marketing', true, CURRENT_TIMESTAMP, 'signup_form', '127.0.0.1');
