// Simple logging utility with environment-aware levels
const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
    info: (message, data) => {
        if (isDevelopment) {
            console.log(`[INFO] ${message}`, data || '');
        }
    },

    warn: (message, data) => {
        console.warn(`[WARN] ${message}`, data || '');
    },

    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);

        // In production, also send to error tracking service
        if (!isDevelopment && typeof window === 'undefined') {
            // Server-side error logging
            // TODO: Send to error tracking service (Sentry, etc.)
        }
    },

    debug: (message, data) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
    }
};

export default logger;
