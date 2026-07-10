import { request } from "./httpClient";

// Normalizes to the shape components already expect ($id present, since
// AuthorProfile.jsx/ProfileSettings.jsx were written against Appwrite's
// document shape).
const normalizeProfile = (profile) => {
    if (!profile) return null;
    return {
        ...profile,
        $id: profile.userID,
    };
};

async function getProfile(userID) {
    if (!userID) return null;
    try {
        const res = await request(`/profiles/${userID}`);
        return normalizeProfile(res.data);
    } catch {
        return null;
    }
}

// upsertProfile: accepts the same field names the old Service did
// (userID, name, bio, avatar, website, github, linkedin). userID isn't
// sent to the backend - the logged-in user is inferred from the JWT
// cookie, matching how the auth middleware works.
async function upsertProfile({ name, bio, avatar, website, github, linkedin }) {
    const formData = new FormData();
    if (name !== undefined) formData.append("name", name);
    if (bio !== undefined) formData.append("bio", bio);
    if (website !== undefined) formData.append("website", website);
    if (github !== undefined) formData.append("github", github);
    if (linkedin !== undefined) formData.append("linkedin", linkedin);
    if (avatar instanceof File) formData.append("avatar", avatar);

    try {
        const res = await request("/profiles", { method: "PUT", body: formData, isFormData: true });
        return normalizeProfile(res.data);
    } catch (error) {
        console.log("profileApi :: upsertProfile :: error", error);
        return null;
    }
}

const profileService = { getProfile, upsertProfile };

export default profileService;