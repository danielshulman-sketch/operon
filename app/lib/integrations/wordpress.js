/**
 * WordPress Integration
 * Manage WordPress posts and comments
 */

/**
 * Make authenticated request to WordPress API
 */
async function wpRequest(credentials, endpoint, method = 'GET', body = null) {
    // Basic Auth is common for Application Passwords
    // API Url typically: https://yoursite.com/wp-json/wp/v2

    // Ensure siteUrl doesn't end with slash
    const siteUrl = credentials.siteUrl.replace(/\/$/, '');
    const url = `${siteUrl}/wp-json/wp/v2${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (credentials.username && credentials.applicationPassword) {
        const auth = Buffer.from(`${credentials.username}:${credentials.applicationPassword}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`WordPress API error: ${response.status} - ${error}`);
    }

    return await response.json();
}

/**
 * Get WordPress Posts
 */
export async function get_posts(credentials, config) {
    const params = new URLSearchParams();
    if (config.limit) params.append('per_page', config.limit);
    if (config.status) params.append('status', config.status); // publish, future, draft, pending, private

    const endpoint = `/posts?${params.toString()}`;

    const posts = await wpRequest(
        credentials,
        endpoint
    );

    return {
        posts: posts.map(p => ({
            id: p.id,
            date: p.date,
            title: p.title.rendered,
            link: p.link,
            status: p.status
        }))
    };
}

/**
 * Create a Post
 */
export async function create_post(credentials, config) {
    const post = {
        title: config.title,
        content: config.content,
        status: config.status || 'draft'
    };

    const response = await wpRequest(
        credentials,
        '/posts',
        'POST',
        post
    );

    return {
        success: true,
        post_id: response.id,
        link: response.link
    };
}

/**
 * Get Comments
 */
export async function get_comments(credentials, config) {
    const params = new URLSearchParams();
    if (config.limit) params.append('per_page', config.limit);
    if (config.post_id) params.append('post', config.post_id);

    const endpoint = `/comments?${params.toString()}`;

    const comments = await wpRequest(
        credentials,
        endpoint
    );

    return {
        comments: comments.map(c => ({
            id: c.id,
            author_name: c.author_name,
            date: c.date,
            content: c.content.rendered,
            link: c.link
        }))
    };
}

export const wordpressIntegration = {
    name: 'WordPress',
    get_posts,
    create_post,
    get_comments
};
