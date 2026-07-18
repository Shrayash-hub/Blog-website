const TOKEN_KEY = "blogfolio_access_token";

// Cross-origin (S3 frontend + EC2 backend) cookies get blocked by browsers
// when not on HTTPS (SameSite=None requires Secure, which requires TLS).
// Storing the JWT in localStorage and sending it as an Authorization
// header sidesteps this entirely - our backend's verifyJWT middleware
// already accepts `Authorization: Bearer <token>` as a fallback to the
// cookie, so no backend changes are needed.
export function getToken() {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function setToken(token) {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
    } catch {
        // localStorage unavailable (e.g. private browsing) - fail silently,
        // user will just need to log in again each session.
    }
}

export function clearToken() {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {
        // no-op
    }
}
