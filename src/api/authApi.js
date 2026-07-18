/**
 * authApi.js
 *
 * Wraps the /api/v1/auth/* endpoints.
 *
 * Shape normalization
 * -------------------
 * The backend wraps every response as { statusCode, data, message, success }
 * (see server/src/utils/ApiResponse.js), and inside `data` the user's
 * primary key is `_id`. The frontend (authSlice, all components) expects
 * `userData.$id`. `normalizeUser` unwraps the envelope AND performs the
 * _id -> $id mapping so no call site needs to change.
 *
 * Auth transport: Bearer token, not cookies
 * ------------------------------------------
 * The deployed setup (S3 frontend + EC2 backend, both plain HTTP, different
 * origins) can't rely on the httpOnly cookie the backend also sets -
 * cross-site cookies require SameSite=None + Secure, which needs HTTPS.
 * Instead, we store the accessToken from login/register in localStorage
 * (see tokenStore.js) and httpClient.js attaches it as an
 * `Authorization: Bearer <token>` header on every request. Our backend's
 * verifyJWT middleware already accepts this header as a fallback to the
 * cookie, so no backend changes were needed.
 *
 * Endpoints
 * ---------
 *  POST /auth/register   { name, email, password }  -> { user, accessToken }
 *  POST /auth/login      { email, password }         -> { user, accessToken }
 *  POST /auth/logout     (Bearer auth)               -> {}
 *  GET  /auth/current-user (Bearer auth)             -> user object
 */

import { request } from "./httpClient.js";
import { setToken, clearToken } from "./tokenStore.js";

/** Map MongoDB _id -> $id so existing components stay unchanged. */
function normalizeUser(user) {
    if (!user) return null;
    return {
        ...user,
        $id: user._id?.toString() ?? user.$id,
    };
}

const authApi = {
    /**
     * Register a new account.
     * Stores the access token and returns the normalized user object.
     */
    async createAccount({ name, email, password }) {
        const res = await request("/auth/register", {
            method: "POST",
            body: { name, email, password },
        });
        // res = { statusCode, data: { user, accessToken }, message, success }
        setToken(res.data?.accessToken);
        return normalizeUser(res.data?.user);
    },

    /**
     * Log in with email + password.
     * Stores the access token and returns the normalized user object.
     */
    async login({ email, password }) {
        const res = await request("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        setToken(res.data?.accessToken);
        return normalizeUser(res.data?.user);
    },

    /**
     * Log out the current session - clears both the server-side cookie
     * (if any) and the locally stored Bearer token.
     */
    async logout() {
        try {
            return await request("/auth/logout", { method: "POST" });
        } finally {
            // Always clear the local token, even if the network call
            // fails (e.g. token already expired) - the user's intent is
            // to be logged out locally regardless.
            clearToken();
        }
    },

    /**
     * Fetch the currently authenticated user.
     * Returns null if not logged in (no valid token), or the normalized user.
     */
    async getCurrentUser() {
        try {
            const res = await request("/auth/current-user");
            return normalizeUser(res.data);
        } catch (err) {
            // 401 just means no active session - not a crash-worthy error.
            // Our httpClient sets `statusCode` on thrown errors, not `code`.
            if (err.statusCode === 401 || err.statusCode === 403) return null;
            throw err;
        }
    },
};

export default authApi;