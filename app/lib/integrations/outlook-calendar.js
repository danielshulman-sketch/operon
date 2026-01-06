/**
 * Outlook Calendar Integration
 * Create and manage calendar events via Microsoft Graph API
 */

/**
 * Make authenticated request to Microsoft Graph API
 */
async function graphRequest(credentials, endpoint, method = 'GET', body = null) {
    const url = `https://graph.microsoft.com/v1.0${endpoint}`;

    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Microsoft Graph API error: ${response.status} - ${error}`);
    }

    // DELETE requests may not return content
    if (method === 'DELETE') {
        return { success: true };
    }

    return await response.json();
}

/**
 * Create a calendar event
 */
export async function create_event(credentials, config) {
    const event = {
        subject: config.title || config.summary,
        body: {
            contentType: 'HTML',
            content: config.description || '',
        },
        start: {
            dateTime: config.start_time,
            timeZone: config.timezone || 'America/New_York',
        },
        end: {
            dateTime: config.end_time,
            timeZone: config.timezone || 'America/New_York',
        },
        attendees: config.attendees ?
            config.attendees.split(',').map(email => ({
                emailAddress: { address: email.trim() },
                type: 'required',
            })) :
            [],
        isOnlineMeeting: !!config.zoom_link,
        onlineMeetingUrl: config.zoom_link || undefined,
        reminderMinutesBeforeStart: 30,
        isReminderOn: true,
    };

    const response = await graphRequest(
        credentials,
        '/me/calendar/events',
        'POST',
        event
    );

    return {
        event_id: response.id,
        event_link: response.webLink,
        status: response.responseStatus?.response || 'accepted',
        created: response.createdDateTime,
    };
}

/**
 * Check calendar availability for a time slot
 */
export async function check_availability(credentials, config) {
    const requestBody = {
        schedules: [credentials.email || 'me'],
        startTime: {
            dateTime: config.start_time,
            timeZone: config.timezone || 'America/New_York',
        },
        endTime: {
            dateTime: config.end_time,
            timeZone: config.timezone || 'America/New_York',
        },
        availabilityViewInterval: 30,
    };

    const response = await graphRequest(
        credentials,
        '/me/calendar/getSchedule',
        'POST',
        requestBody
    );

    const schedule = response.value && response.value[0];
    const isBusy = schedule?.scheduleItems && schedule.scheduleItems.length > 0;

    return {
        available: !isBusy,
        busy_times: schedule?.scheduleItems || [],
    };
}

/**
 * Update an existing calendar event
 */
export async function update_event(credentials, config) {
    const event = {};

    if (config.title || config.summary) {
        event.subject = config.title || config.summary;
    }
    if (config.description) {
        event.body = {
            contentType: 'HTML',
            content: config.description,
        };
    }
    if (config.start_time) {
        event.start = {
            dateTime: config.start_time,
            timeZone: config.timezone || 'America/New_York',
        };
    }
    if (config.end_time) {
        event.end = {
            dateTime: config.end_time,
            timeZone: config.timezone || 'America/New_York',
        };
    }
    if (config.attendees) {
        event.attendees = config.attendees.split(',').map(email => ({
            emailAddress: { address: email.trim() },
            type: 'required',
        }));
    }

    const response = await graphRequest(
        credentials,
        `/me/calendar/events/${config.event_id}`,
        'PATCH',
        event
    );

    return {
        event_id: response.id,
        event_link: response.webLink,
        status: response.responseStatus?.response || 'accepted',
        updated: response.lastModifiedDateTime,
    };
}

/**
 * Delete a calendar event
 */
export async function delete_event(credentials, config) {
    await graphRequest(
        credentials,
        `/me/calendar/events/${config.event_id}`,
        'DELETE'
    );

    return {
        success: true,
        event_id: config.event_id,
        deleted: true,
    };
}

export const outlookCalendarIntegration = {
    name: 'Outlook Calendar',
    create_event,
    check_availability,
    update_event,
    delete_event,
};
