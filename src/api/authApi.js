import { request } from "./httpClient";

// Normalizes our backend's Mongo user shape into what the frontend
// already expects from Appwrite ($id instead of _id), so authSlice and
// every component reading userData.$id keeps working unchanged.
const toAppUser = (user) => {
    if (!user) return null;
    return {
        $id: user._id,
        name: user.name,
        email: user.email,
    };
};

// createAccount: register + auto-login, mirroring the old AuthService
// behavior (Appwrite created the account then immediately logged in).
async function createAccount({ email, password, name }) {
    const res = await request("/auth/register", {
        method: "POST",
        body: { name, email, password },
    });
    return toAppUser(res.data.user);
}

async function login({ email, password }) {
    const res = await request("/auth/login", {
        method: "POST",
        body: { email, password },
    });
    return toAppUser(res.data.user);
}

// getCurrentUser: returns null instead of throwing when there's no
// active session, so callers can do `if (user) ...` like before.
async function getCurrentUser() {
    try {
        const res = await request("/auth/current-user");
        return toAppUser(res.data);
    } catch {
        return null;
    }
}

async function logout() {
    try {
        await request("/auth/logout", { method: "POST" });
        return true;
    } catch {
        return false;
    }
}

const authService = { createAccount, login, getCurrentUser, logout };

export default authService;