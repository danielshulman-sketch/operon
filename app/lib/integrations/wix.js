/**
 * Wix Integration
 * Manage Wix orders and contacts
 */

/**
 * Make authenticated request to Wix API
 */
async function wixRequest(credentials, endpoint, method = 'GET', body = null) {
    // Determine base URL based on authentication type or specific API needs
    // For standard REST API, it's usually https://www.wixapis.com
    const baseUrl = 'https://www.wixapis.com';
    const url = `${baseUrl}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (credentials.apiKey) {
        options.headers['Authorization'] = credentials.apiKey;
    } else if (credentials.access_token) {
        options.headers['Authorization'] = `Bearer ${credentials.access_token}`;
    }

    if (credentials.siteId) {
        options.headers['wix-site-id'] = credentials.siteId;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Wix API error: ${response.status} - ${error}`);
    }

    return await response.json();
}

/**
 * Get Wix Orders
 */
export async function get_orders(credentials, config) {
    // V2 Orders API: /stores/v2/orders/query
    const body = {
        query: {
            filter: "{\"status\": \"CREATED\"}", // Default to created, can be expanded in config
            // paging: { limit: 100 }
        }
    };

    // Allow overriding/customizing query via config if needed
    if (config.limit) {
        body.query.paging = { limit: parseInt(config.limit) };
    }

    const response = await wixRequest(
        credentials,
        '/stores/v2/orders/query',
        'POST',
        body
    );

    return {
        orders: response.orders,
        total: response.total
    };
}

/**
 * Get Wix Contacts
 */
export async function get_contacts(credentials, config) {
    // Contacts V4 query: /contacts/v4/contacts/query
    const body = {
        query: {
            // filter: {}, 
            // paging: { limit: 50 }
        }
    };

    if (config.limit) {
        body.query.paging = { limit: parseInt(config.limit) };
    }

    const response = await wixRequest(
        credentials,
        '/contacts/v4/contacts/query',
        'POST',
        body
    );

    return {
        contacts: response.contacts,
        metadata: response.metadata
    };
}

/**
 * Create a Contact
 */
export async function create_contact(credentials, config) {
    const contact = {
        info: {
            name: {
                first: config.firstName,
                last: config.lastName
            },
            emails: [
                {
                    email: config.email,
                    tag: "MAIN"
                }
            ],
            phones: config.phone ? [
                {
                    phone: config.phone,
                    tag: "MOBILE"
                }
            ] : []
        }
    };

    const response = await wixRequest(
        credentials,
        '/contacts/v4/contacts',
        'POST',
        contact
    );

    return {
        contact: response.contact,
        success: true
    };
}

export const wixIntegration = {
    name: 'Wix',
    get_orders,
    get_contacts,
    create_contact
};
