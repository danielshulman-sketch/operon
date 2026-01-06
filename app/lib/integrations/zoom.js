/**
 * Zoom Integration
 * Create and manage Zoom meetings via Zoom API
 */

/**
 * Make authenticated request to Zoom API
 */
async function zoomRequest(credentials, endpoint, method = 'GET', body = null) {
    const url = `https://api.zoom.us/v2${endpoint}`;

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
        throw new Error(`Zoom API error: ${response.status} - ${error}`);
    }

    // DELETE requests may not return content
    if (method === 'DELETE' && response.status === 204) {
        return { success: true };
    }

    return await response.json();
}

/**
 * Create a Zoom meeting
 */
export async function create_meeting(credentials, config) {
    const meeting = {
        topic: config.topic || config.title || 'Zoom Meeting',
        type: config.scheduled ? 2 : 1, // 1 = instant, 2 = scheduled
        start_time: config.start_time || undefined,
        duration: config.duration || 60, // Duration in minutes
        timezone: config.timezone || 'America/New_York',
        agenda: config.description || config.agenda || '',
        settings: {
            host_video: config.host_video !== false,
            participant_video: config.participant_video !== false,
            join_before_host: config.join_before_host || false,
            mute_upon_entry: config.mute_upon_entry || false,
            waiting_room: config.waiting_room !== false,
            audio: 'both', // both, telephony, voip
            auto_recording: config.auto_recording || 'none', // local, cloud, none
            approval_type: config.approval_type || 2, // 0=auto, 1=manual, 2=no registration
        },
    };

    const response = await zoomRequest(
        credentials,
        '/users/me/meetings',
        'POST',
        meeting
    );

    return {
        meeting_id: response.id,
        meeting_number: response.id,
        join_url: response.join_url,
        start_url: response.start_url,
        password: response.password,
        start_time: response.start_time,
        duration: response.duration,
        created: response.created_at,
    };
}

/**
 * Get meeting details
 */
export async function get_meeting(credentials, config) {
    const response = await zoomRequest(
        credentials,
        `/meetings/${config.meeting_id}`
    );

    return {
        meeting_id: response.id,
        topic: response.topic,
        join_url: response.join_url,
        start_url: response.start_url,
        password: response.password,
        start_time: response.start_time,
        duration: response.duration,
        status: response.status,
    };
}

/**
 * Update a Zoom meeting
 */
export async function update_meeting(credentials, config) {
    const meeting = {};

    if (config.topic || config.title) {
        meeting.topic = config.topic || config.title;
    }
    if (config.start_time) {
        meeting.start_time = config.start_time;
    }
    if (config.duration) {
        meeting.duration = config.duration;
    }
    if (config.description || config.agenda) {
        meeting.agenda = config.description || config.agenda;
    }
    if (config.timezone) {
        meeting.timezone = config.timezone;
    }

    const response = await zoomRequest(
        credentials,
        `/meetings/${config.meeting_id}`,
        'PATCH',
        meeting
    );

    return {
        success: true,
        meeting_id: config.meeting_id,
        updated: true,
    };
}

/**
 * Delete a Zoom meeting
 */
export async function delete_meeting(credentials, config) {
    await zoomRequest(
        credentials,
        `/meetings/${config.meeting_id}`,
        'DELETE'
    );

    return {
        success: true,
        meeting_id: config.meeting_id,
        deleted: true,
    };
}

export const zoomIntegration = {
    name: 'Zoom',
    create_meeting,
    get_meeting,
    update_meeting,
    delete_meeting,
};
