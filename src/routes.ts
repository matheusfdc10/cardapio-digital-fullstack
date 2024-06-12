/**
 * An array of routes that are accessible to the public
 * These routers do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/"
]

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT_USER = "/";

/**
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT_ADMIN = "/home";