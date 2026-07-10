import path from "path";
import { Post } from "../models/Post.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateUniqueSlug } from "../utils/generateSlug.js";
import { removeLocalFile } from "../utils/removeLocalFile.js";
import { uploadDir } from "../middlewares/upload.middleware.js";

const createPost = asyncHandler(async (req, res) => {
    const { title, content, excerpt, tags, status } = req.body;

    if (!title?.trim() || !content?.trim()) {
        throw new ApiError(400, "Title and content are required");
    }

    const slug = await generateUniqueSlug(title);

    const parsedTags = Array.isArray(tags)
        ? tags
        : tags
            ? String(tags).split(",").map((tag) => tag.trim()).filter(Boolean)
            : [];

    const featuredImage = req.file ? req.file.filename : "";

    const post = await Post.create({
        title,
        slug,
        content,
        excerpt: excerpt || "",
        tags: parsedTags,
        status: status || "active",
        featuredImage,
        userID: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, post, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { title, content, excerpt, tags, status } = req.body;

    const post = await Post.findOne({ slug });

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.userID.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this post");
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (status) post.status = status;
    if (tags !== undefined) {
        post.tags = Array.isArray(tags)
            ? tags
            : String(tags).split(",").map((tag) => tag.trim()).filter(Boolean);
    }

    // Replace the featured image only if a new one was uploaded - and
    // clean up the old file from disk so storage doesn't grow unbounded.
    if (req.file) {
        removeLocalFile(path.join(uploadDir, post.featuredImage));
        post.featuredImage = req.file.filename;
    }

    await post.save();

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const post = await Post.findOne({ slug });

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.userID.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }

    removeLocalFile(path.join(uploadDir, post.featuredImage));
    await post.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const getPost = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }).populate("userID", "name email");

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post fetched successfully"));
});

// Public listing - only "active" (published) posts, newest first.
// Supports pagination via ?page= and ?limit= query params.
const getPublishedPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await Post.paginate(
        { status: "active" },
        {
            page: Number(page),
            limit: Number(limit),
            sort: { createdAt: -1 },
            populate: { path: "userID", select: "name email" },
        }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Published posts fetched"));
});

const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ userID: req.user._id }).sort({
        createdAt: -1,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "User posts fetched"));
});

const searchPosts = asyncHandler(async (req, res) => {
    const { q = "" } = req.query;

    const filter = { status: "active" };
    if (q.trim()) {
        filter.title = { $regex: q.trim(), $options: "i" };
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Search results fetched"));
});

export {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPublishedPosts,
    getUserPosts,
    searchPosts,
};
