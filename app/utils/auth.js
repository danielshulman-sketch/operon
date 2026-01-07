import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET;
const DEBUG = process.env.NODE_ENV !== 'production';

if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable must be set. Add it to your .env.local file.');
}

export async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

export async function verifyPassword(hash, password) {
    return await bcrypt.compare(password, hash);
}

export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export async function getUserFromToken(token) {
    if (DEBUG) console.log('[getUserFromToken] Starting, token length:', token?.length);
    const payload = verifyToken(token);
    if (DEBUG) console.log('[getUserFromToken] Payload:', payload ? 'exists' : 'null');

    if (!payload || !payload.userId) {
        if (DEBUG) console.log('[getUserFromToken] No payload or userId');
        return null;
    }

    const result = await query(
        `SELECT u.*, om.org_id, om.role, om.is_admin, om.is_active, 
                COALESCE(u.is_superadmin, false) as is_superadmin
         FROM users u
         JOIN org_members om ON u.id = om.user_id
         WHERE u.id = $1 AND om.is_active = true
         LIMIT 1`,
        [payload.userId]
    );

    if (DEBUG) console.log('[getUserFromToken] Query result rows:', result.rows.length);
    return result.rows[0] || null;
}

export async function requireAuth(request) {
    if (DEBUG) console.log('[requireAuth] Starting...');
    const authHeader = request.headers.get('authorization');
    if (DEBUG) console.log('[requireAuth] Auth header exists:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (DEBUG) console.log('[requireAuth] No valid auth header');
        throw new Error('Unauthorized');
    }

    const token = authHeader.substring(7);
    if (DEBUG) console.log('[requireAuth] Token extracted, length:', token.length);

    const user = await getUserFromToken(token);
    if (DEBUG) console.log('[requireAuth] User from token:', user ? user.id : 'null');

    if (!user) {
        if (DEBUG) console.log('[requireAuth] No user found');
        throw new Error('Unauthorized');
    }

    if (DEBUG) console.log('[requireAuth] Success!');
    return user;
}

export async function requireAdmin(request) {
    const user = await requireAuth(request);

    if (!user.is_admin && !user.is_superadmin) {
        throw new Error('Admin access required');
    }

    return user;
}

export async function requireSuperAdmin(request) {
    const user = await requireAuth(request);

    if (!user.is_superadmin) {
        throw new Error('Superadmin access required');
    }

    return user;
}
