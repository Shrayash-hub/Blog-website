import { Router } from "express";
import {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPublishedPosts,
    getUserPosts,
    searchPosts,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getPublishedPosts);
router.route("/search").get(searchPosts);
router.route("/:slug").get(getPost);

// Protected routes
router.route("/").post(verifyJWT, upload.single("featuredImage"), createPost);
router.route("/mine/all").get(verifyJWT, getUserPosts);
router
    .route("/:slug")
    .patch(verifyJWT, upload.single("featuredImage"), updatePost)
    .delete(verifyJWT, deletePost);

export default router;
