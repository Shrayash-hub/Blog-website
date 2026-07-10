/**
 * authApi.js
 *
 * Wraps the /api/v1/auth/* endpoints.
 *
 * Shape normalization
 * -------------------
 * The backend returns MongoDB documents whose primary key is `_id`.
 * The frontend (authSlice, all components) expects `userData.$id`.
 * `normalizeUser` performs that mapping so no call site needs to change.
 *
 * Endpoints
 * ---------
 *  POST /auth/register   { name, email, password }  → { user, accessToken }
 *  POST /auth/login      { email, password }         → { user, accessToken }
 *  POST /auth/logout     (cookie auth)               → {}
 *  GET  /auth/current-user (cookie auth)             → user object
 */

import { request } from "./httpClient.js";

/** Map MongoDB _id → $id so existing components stay unchanged. */
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
     * Returns the normalized user object on success.
     */
    async createAccount({ name, email, password }) {
        const data = await request("/auth/register", {
            method: "POST",
            body: { name, email, password },
        });
        // data = { user, accessToken }
        return normalizeUser(data?.user ?? data);
    },

    /**
     * Log in with email + password.
     * Returns the normalized user object (access token is stored in an
     * HttpOnly cookie by the server; we don't need it client-side).
     */
    async login({ email, password }) {
        const data = await request("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        return normalizeUser(data?.user ?? data);
    },

    /**
     * Log out the current session (clears the server-side cookie).
     */
    async logout() {
        return request("/auth/logout", { method: "POST" });
    },

    /**
     * Fetch the currently authenticated user.
     * Returns null if not logged in (no valid cookie), or the normalized user.
     */
    async getCurrentUser() {
        try {
            const data = await request("/auth/current-user");
            return normalizeUser(data);
        } catch (err) {
            // 401 just means no active session – not a crash-worthy error.
            if (err.code === 401 || err.code === 403) return null;
            throw err;
        }
    },
};

export default authApi;
