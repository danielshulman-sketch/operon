/**
 * GET /api/v1/integrations
 * List connected integrations for the organization
 */

import { requireApiKey, apiSuccess, apiError } from '@/utils/api-auth-middleware';
import { query } from '@/utils/db';
import { getAllIntegrations } from '@/lib/integrations/index';

export async function GET(request) {
    // Authenticate request
    const auth = await requireApiKey(request);
    if (auth.error) return auth.response;

    const { orgId, rateLimit } = auth;

    try {
        // Get all available integrations
        const allIntegrations = getAllIntegrations();

        // Get connected integrations for this org
        const result = await query(
            `SELECT integration_name, created_at, updated_at 
             FROM integration_credentials 
             WHERE org_id = $1`,
            [orgId]
        );

        const connectedMap = {};
        result.rows.forEach(row => {
            connectedMap[row.integration_name] = {
                connected: true,
                connectedAt: row.created_at,
                updatedAt: row.updated_at
            };
        });

        // Merge connection status with available integrations
        const integrations = allIntegrations.map(integration => ({
            id: integration.id,
            name: integration.name,
            category: integration.category,
            connected: !!connectedMap[integration.id],
            connectedAt: connectedMap[integration.id]?.connectedAt || null,
            updatedAt: connectedMap[integration.id]?.updatedAt || null
        }));

        return apiSuccess({
            integrations,
            summary: {
                total: integrations.length,
                connected: integrations.filter(i => i.connected).length
            }
        }, rateLimit);

    } catch (error) {
        console.error('API v1/integrations error:', error);
        return apiError(
            'internal_error',
            'An error occurred while fetching integrations',
            500
        );
    }
}
