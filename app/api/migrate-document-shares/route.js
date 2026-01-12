import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { requireSuperAdmin } from '@/utils/auth';

export async function POST(request) {
    try {
        await requireSuperAdmin(request);

        console.log('Creating document_shares table...');

        // Create document_shares table
        await query(`
            CREATE TABLE IF NOT EXISTS document_shares (
                id SERIAL PRIMARY KEY,
                document_id INTEGER NOT NULL,
                shared_by UUID NOT NULL,
                shared_with UUID NOT NULL,
                org_id UUID NOT NULL,
                permission VARCHAR(50) DEFAULT 'view',
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(document_id, shared_with)
            )
        `);

        // Create indexes
        await query(`CREATE INDEX IF NOT EXISTS idx_document_shares_document ON document_shares(document_id)`);
        await query(`CREATE INDEX IF NOT EXISTS idx_document_shares_user ON document_shares(shared_with)`);
        await query(`CREATE INDEX IF NOT EXISTS idx_document_shares_org ON document_shares(org_id)`);

        // Add foreign key constraints
        await query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint 
                    WHERE conname = 'fk_document_shares_document'
                ) THEN
                    ALTER TABLE document_shares
                    ADD CONSTRAINT fk_document_shares_document
                    FOREIGN KEY (document_id) REFERENCES knowledge_base(id) ON DELETE CASCADE;
                END IF;
            END $$;
        `);

        return NextResponse.json({
            success: true,
            message: 'document_shares table created successfully with indexes and constraints'
        });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { error: error.message || 'Migration failed' },
            { status: 500 }
        );
    }
}
