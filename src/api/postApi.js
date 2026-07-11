import { request, getFileUrl } from "./httpClient";

// Normalizes a backend Post document into the shape components already
// expect from Appwrite:
// - $id = slug: post CRUD routes (edit/delete links, getPost) are keyed
//   by slug on our backend, exactly like Appwrite used slug as the
//   document ID - so existing `Link to={`/post/${post.$id}`}` etc. keep
//   working unchanged.
// - _id: the real Mongo ObjectId, needed only for bookmarks (Bookmark.
//   postID references Post._id, not the slug).
// - userID: normalized to a plain string id whether or not the field
//   came back populated (populated -> {_id, name, email} object).
const normalizePost = (post) => {
    if (!post) return null;

    const authorPopulated = post.userID && typeof post.userID === "object";

    return {
        ...post,
        $id: post.slug,
        _id: post._id,
        userID: authorPopulated ? post.userID._id : post.userID,
        authorName: authorPopulated ? post.userID.name : undefined,
    };
};

const normalizeList = (posts = []) => posts.map(normalizePost);

// Converts a post payload into FormData, since file upload (featuredImage)
// requires multipart/form-data rather than JSON.
const toFormData = ({ title, content, excerpt, tags, status, featuredImage }) => {
    const formData = new FormData();
    if (title !== undefined) formData.append("title", title);
    if (content !== undefined) formData.append("content", content);
    if (excerpt !== undefined) formData.append("excerpt", excerpt);
    if (status !== undefined) formData.append("status", status);
    if (tags !== undefined) {
        formData.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
    }
    if (featuredImage instanceof File) {
        // New file selected — send as multipart so multer saves it to disk.
        formData.append("featuredImage", featuredImage);
    } else if (typeof featuredImage === "string" && featuredImage) {
        // Already-stored filename — pass as a plain field.
        formData.append("featuredImage", featuredImage);
    }
    return formData;
};

async function createPost({ title, content, featuredImage, status, excerpt, tags }) {
    const formData = toFormData({ title, content, excerpt, tags, status, featuredImage });
    const res = await request("/posts", { method: "POST", body: formData, isFormData: true });
    return normalizePost(res.data);
}

async function updatePost(slug, { title, content, featuredImage, status, excerpt, tags }) {
    const formData = toFormData({ title, content, excerpt, tags, status, featuredImage });
    const res = await request(`/posts/${slug}`, { method: "PATCH", body: formData, isFormData: true });
    return normalizePost(res.data);
}

async function deletePost(slug) {
    try {
        await request(`/posts/${slug}`, { method: "DELETE" });
        return true;
    } catch {
        return false;
    }
}

async function getPost(slug) {
    try {
        const res = await request(`/posts/${slug}`);
        return normalizePost(res.data);
    } catch {
        return false;
    }
}

async function getPublishedPosts({ page = 1, limit = 50 } = {}) {
    const res = await request(`/posts?page=${page}&limit=${limit}`);
    return { documents: normalizeList(res.data.docs) };
}

async function getUserPosts() {
    const res = await request("/posts/mine/all");
    return { documents: normalizeList(res.data) };
}

async function searchPosts(searchTerm) {
    const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";
    const res = await request(`/posts/search${query}`);
    return { documents: normalizeList(res.data) };
}

// File upload/preview - the backend already attaches featuredImage
// directly in createPost/updatePost, so a separate uploadFile step
// isn't needed for posts. This is kept only for the standalone image
// upload endpoint (e.g. inline images in the RTE), matching the old
// uploadFile/getFileView pair.
async function uploadFile(file) {
    const formData = new FormData();
    formData.append("image", file);
    try {
        const res = await request("/upload", { method: "POST", body: formData, isFormData: true });
        return res.data; // { filename }
    } catch {
        return false;
    }
}

function getFileView(filename) {
    return getFileUrl(filename);
}

const postService = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPublishedPosts,
    getUserPosts,
    searchPosts,
    uploadFile,
    getFileView,
    getFilePreview: getFileView,
};

export default postService;