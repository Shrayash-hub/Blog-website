const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Builds the full public URL for an uploaded file (post image, avatar,
// standalone upload). Every stored image field is just a filename (see
// server/src/app.js), so this is the single place that turns a filename
// into a browser-loadable URL.
export const getFileUrl = (filename) => {
    if (!filename) return "";
    // If it's already a full URL (e.g. an old Appwrite/external URL),
    // don't double-prefix it.
    if (filename.startsWith("http")) return filename;
    const origin = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
    return `${origin}/uploads/${filename}`;
};

// Central request function. Every api/*.js file goes through this so
// credentials, JSON parsing, and error shape are handled in one place.
export async function request(path, { method = "GET", body, isFormData = false } = {}) {
    const options = {
        method,
        credentials: "include", // sends/receives the httpOnly JWT cookies
    };

    if (body !== undefined) {
        if (isFormData) {
            options.body = body; // browser sets the multipart Content-Type
        } else {
            options.headers = { "Content-Type": "application/json" };
            options.body = JSON.stringify(body);
        }
    }

    const res = await fetch(`${API_BASE_URL}${path}`, options);

    // 204 No Content or empty bodies won't parse as JSON.
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        // Mirrors the backend's ApiError shape: { success, message, errors }
        const error = new Error(data?.message || `Request failed (${res.status})`);
        error.statusCode = res.status;
        error.errors = data?.errors || [];
        throw error;
    }

    return data; // { statusCode, data, message, success }
}