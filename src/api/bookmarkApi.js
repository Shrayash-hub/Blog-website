import { request } from "./httpClient";

// getBookmarks(userID): userID param kept for call-site compatibility
// with the old Appwrite signature, but our backend infers the user from
// the JWT cookie, so it's unused here.
async function getBookmarks(_userID) {
    try {
        const res = await request("/bookmarks/mine");
        // Normalize each bookmarked post the same way postApi does,
        // so PostCard etc. receive posts with $id = slug.
        const documents = res.data.map((post) => ({ ...post, $id: post.slug }));
        return { documents };
    } catch {
        return { documents: [] };
    }
}

// getBookmark(userID, postID): returns a truthy value if bookmarked,
// null otherwise - matches the old Appwrite method's usage as a
// truthy/falsy check in Post.jsx (`bookmark ? "Saved" : "Save"`).
// postID here must be the post's real Mongo _id (see postApi.js normalizePost).
async function getBookmark(_userID, postID) {
    if (!postID) return null;
    try {
        const res = await request(`/bookmarks/${postID}/status`);
        return res.data.bookmarked ? res.data : null;
    } catch {
        return null;
    }
}

// toggleBookmark(userID, postID): userID kept for signature
// compatibility, unused. Returns a truthy object when now bookmarked,
// null when now un-bookmarked - same contract Post.jsx already expects.
async function toggleBookmark(_userID, postID) {
    try {
        const res = await request(`/bookmarks/${postID}/toggle`, { method: "POST" });
        return res.data.bookmarked ? res.data : null;
    } catch {
        return null;
    }
}

const bookmarkService = { getBookmarks, getBookmark, toggleBookmark };

export default bookmarkService;