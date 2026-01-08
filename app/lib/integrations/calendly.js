/**
 * Calendly Integration
 * Actions: get_events, get_event_invitees, get_user, cancel_event
 */

export const calendlyIntegration = {
    name: 'Calendly',

    /**
     * Get scheduled events
     */
    async get_events(credentials, config, context) {
        const { user_uri, status, min_start_time, max_start_time } = config;
        const { api_key } = credentials;

        let url = 'https://api.calendly.com/scheduled_events';
        const params = new URLSearchParams();

        if (user_uri) params.append('user', user_uri);
        if (status) params.append('status', status);
        if (min_start_time) params.append('min_start_time', min_start_time);
        if (max_start_time) params.append('max_start_time', max_start_time);

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Calendly API error: ${error.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            success: true,
            events: data.collection || [],
            total: data.collection?.length || 0
        };
    },

    /**
     * Get event invitees
     */
    async get_event_invitees(credentials, config, context) {
        const { event_uuid } = config;
        const { api_key } = credentials;

        if (!event_uuid) {
            throw new Error('event_uuid is required');
        }

        const response = await fetch(`https://api.calendly.com/scheduled_events/${event_uuid}/invitees`, {
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Calendly API error: ${error.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            success: true,
            invitees: data.collection || [],
            total: data.collection?.length || 0
        };
    },

    /**
     * Get current user information
     */
    async get_user(credentials, config, context) {
        const { api_key } = credentials;

        const response = await fetch('https://api.calendly.com/users/me', {
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Calendly API error: ${error.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            success: true,
            user: data.resource || data
        };
    },

    /**
     * Cancel a scheduled event
     */
    async cancel_event(credentials, config, context) {
        const { event_uuid, reason } = config;
        const { api_key } = credentials;

        if (!event_uuid) {
            throw new Error('event_uuid is required');
        }

        const response = await fetch(`https://api.calendly.com/scheduled_events/${event_uuid}/cancellation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason || 'Cancelled via automation'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Calendly API error: ${error.message || response.statusText}`);
        }

        const data = await response.json();

        return {
            success: true,
            cancellation: data.resource || data
        };
    },

    /**
     * Get Calendly statistics
     */
    async get_stats(credentials) {
        const { api_key } = credentials;

        try {
            // Get current user
            const userResponse = await fetch('https://api.calendly.com/users/me', {
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();
            const userUri = userData.resource.uri;

            // Get scheduled events
            const eventsResponse = await fetch(`https://api.calendly.com/scheduled_events?user=${userUri}&status=active`, {
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!eventsResponse.ok) {
                throw new Error('Failed to fetch events');
            }

            const eventsData = await eventsResponse.json();
            const activeEvents = eventsData.collection || [];

            return {
                user: {
                    name: userData.resource.name,
                    email: userData.resource.email,
                    scheduling_url: userData.resource.scheduling_url
                },
                events: {
                    total: activeEvents.length,
                    active: activeEvents.filter(e => e.status === 'active').length
                }
            };
        } catch (error) {
            console.error('Calendly stats error:', error);
            throw new Error(`Failed to fetch Calendly statistics: ${error.message}`);
        }
    }
};
