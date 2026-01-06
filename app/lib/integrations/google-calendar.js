/**
 * Google Calendar Integration
 * Create and manage calendar events via Google Calendar API
 */

import { google } from 'googleapis';

/**
 * Initialize Google Calendar API client
 */
function getCalendarClient(credentials) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Create a calendar event
 */
export async function create_event(credentials, config) {
    const calendar = getCalendarClient(credentials);

    const event = {
        summary: config.title || config.summary,
        description: config.description || '',
        start: {
            dateTime: config.start_time,
            timeZone: config.timezone || 'America/New_York',
        },
        end: {
            dateTime: config.end_time,
            timeZone: config.timezone || 'America/New_York',
        },
        attendees: config.attendees ?
            config.attendees.split(',').map(email => ({ email: email.trim() })) :
            [],
        conferenceData: config.zoom_link ? {
            entryPoints: [{
                entryPointType: 'video',
                uri: config.zoom_link,
                label: 'Zoom Meeting'
            }],
            conferenceSolution: {
                name: 'Zoom Meeting',
                iconUri: 'https://zoom.us/favicon.ico'
            }
        } : undefined,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
            ],
        },
    };

    const response = await calendar.events.insert({
        calendarId: config.calendar_id || 'primary',
        resource: event,
        conferenceDataVersion: config.zoom_link ? 1 : 0,
        sendUpdates: 'all',
    });

    return {
        event_id: response.data.id,
        event_link: response.data.htmlLink,
        status: response.data.status,
        created: response.data.created,
    };
}

/**
 * Check calendar availability for a time slot
 */
export async function check_availability(credentials, config) {
    const calendar = getCalendarClient(credentials);

    const response = await calendar.freebusy.query({
        requestBody: {
            timeMin: config.start_time,
            timeMax: config.end_time,
            timeZone: config.timezone || 'America/New_York',
            items: [{ id: config.calendar_id || 'primary' }],
        },
    });

    const calendarBusy = response.data.calendars[config.calendar_id || 'primary'];
    const isBusy = calendarBusy.busy && calendarBusy.busy.length > 0;

    return {
        available: !isBusy,
        busy_times: calendarBusy.busy || [],
    };
}

/**
 * Update an existing calendar event
 */
export async function update_event(credentials, config) {
    const calendar = getCalendarClient(credentials);

    const event = {};
    if (config.title || config.summary) event.summary = config.title || config.summary;
    if (config.description) event.description = config.description;
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
        event.attendees = config.attendees.split(',').map(email => ({ email: email.trim() }));
    }

    const response = await calendar.events.patch({
        calendarId: config.calendar_id || 'primary',
        eventId: config.event_id,
        resource: event,
        sendUpdates: 'all',
    });

    return {
        event_id: response.data.id,
        event_link: response.data.htmlLink,
        status: response.data.status,
        updated: response.data.updated,
    };
}

/**
 * Delete a calendar event
 */
export async function delete_event(credentials, config) {
    const calendar = getCalendarClient(credentials);

    await calendar.events.delete({
        calendarId: config.calendar_id || 'primary',
        eventId: config.event_id,
        sendUpdates: 'all',
    });

    return {
        success: true,
        event_id: config.event_id,
        deleted: true,
    };
}

export const googleCalendarIntegration = {
    name: 'Google Calendar',
    create_event,
    check_availability,
    update_event,
    delete_event,
};
