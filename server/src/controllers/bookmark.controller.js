import { Bookmark } from "../models/Bookmark.js";
import { Post } from "../models/Post.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Protected - checks whether the logged-in user has already bookmarked
// a given post. Needed by the Post detail page to show "Save"/"Saved"
// without fetching the user's entire bookmark list.
const getBookmarkStatus = asyncHandler(async (req, res) => {
    const { postID } = req.params;

    const bookmark = await Bookmark.findOne({
        userID: req.user._id,
        postID,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, { bookmarked: Boolean(bookmark) }, "Bookmark status fetched")
        );
});

// Protected - toggles a bookmark on/off for the logged-in user and a
// given post. If a bookmark already exists, remove it; otherwise create
// one. This single endpoint covers both "save" and "unsave" so the
// frontend doesn't need two separate calls.
const toggleBookmark = asyncHandler(async (req, res) => {
    const { postID } = req.params;

    const post = await Post.findById(postID);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const existingBookmark = await Bookmark.findOne({
        userID: req.user._id,
        postID,
    });

    if (existingBookmark) {
        await existingBookmark.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, { bookmarked: false }, "Bookmark removed"));
    }

    await Bookmark.create({ userID: req.user._id, postID });

    return res
        .status(201)
        .json(new ApiResponse(201, { bookmarked: true }, "Post bookmarked"));
});

// Protected - returns the logged-in user's bookmarked posts, populated
// with the full post data so the frontend can render them directly
// without a second round of lookups.
const getUserBookmarks = asyncHandler(async (req, res) => {
    const bookmarks = await Bookmark.find({ userID: req.user._id })
        .populate({
            path: "postID",
            populate: { path: "userID", select: "name email" },
        })
        .sort({ createdAt: -1 });

    // Filter out bookmarks whose post has since been deleted, rather than
    // letting a null postID reach the frontend.
    const posts = bookmarks
        .filter((bookmark) => bookmark.postID)
        .map((bookmark) => bookmark.postID);

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Bookmarked posts fetched"));
});

export { toggleBookmark, getUserBookmarks, getBookmarkStatus };