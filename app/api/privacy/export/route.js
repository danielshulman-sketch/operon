import { NextResponse } from 'next/server';
import { requireAuth } from '@/utils/auth';
import { query } from '@/utils/db';

export async function GET(request) {
    try {
        const user = await requireAuth(request);

        // Collect all user data from database
        const userData = {
            exportDate: new Date().toISOString(),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                createdAt: user.created_at,
            },
            organization: {
                id: user.org_id,
                role: user.role,
                isAdmin: user.is_admin,
            },
        };

        // Get activity logs
        const activityResult = await query(
            'SELECT * FROM user_activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1000',
            [user.id]
        );
        userData.activityLogs = activityResult.rows;

        // Get chat conversations
        const chatResult = await query(
            'SELECT * FROM chat_conversations WHERE user_id = $1',
            [user.id]
        );
        userData.chatConversations = chatResult.rows;

        // Get chat messages
        if (chatResult.rows.length > 0) {
            const conversationIds = chatResult.rows.map(c => c.id);
            const messagesResult = await query(
                'SELECT * FROM chat_messages WHERE conversation_id = ANY($1)',
                [conversationIds]
            );
            userData.chatMessages = messagesResult.rows;
        }

        // Get mailboxes
        const mailboxResult = await query(
            'SELECT * FROM mailboxes WHERE user_id = $1',
            [user.id]
        );
        userData.mailboxes = mailboxResult.rows;

        // Get integration credentials (mask sensitive data)
        const credentialsResult = await query(
            'SELECT id, org_id, integration_name, created_at FROM integration_credentials WHERE org_id = $1',
            [user.org_id]
        );
        userData.integrations = credentialsResult.rows;

        return NextResponse.json(userData);
    } catch (error) {
        console.error('Data export error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to export data' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
