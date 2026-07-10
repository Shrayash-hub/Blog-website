import { Router } from "express";
import {
    toggleBookmark,
    getUserBookmarks,
    getBookmarkStatus,
} from "../controllers/bookmark.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All bookmark routes require authentication.
router.route("/mine").get(verifyJWT, getUserBookmarks);
router.route("/:postID/toggle").post(verifyJWT, toggleBookmark);
router.route("/:postID/status").get(verifyJWT, getBookmarkStatus);

export default router;