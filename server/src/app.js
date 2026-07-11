import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";
import profileRouter from "./routes/profile.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import { upload, uploadDir } from "./middlewares/upload.middleware.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import { uploadImage } from "./controllers/upload.controller.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            // Read the env var at request time so ESM-hoisting of app.js
            // before dotenv.config() runs doesn't capture `undefined`.
            const allowed = process.env.CORS_ORIGIN || "http://localhost:5174";
            callback(null, origin === allowed ? origin : false);
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Serves uploaded images (featured images, avatars, standalone uploads).
// Every stored image field (Post.featuredImage, Profile.avatar) holds
// ONLY the filename - never a full path - so the frontend always builds
// URLs as `${VITE_API_BASE_URL}/uploads/<filename>`.
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);

// Standalone image upload (e.g. rich text editor images) - small enough
// that it doesn't need its own route file; mounted directly here.
app.post("/api/v1/upload", verifyJWT, upload.single("image"), uploadImage);

app.get("/api/v1/healthcheck", (_req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
});

// Must be mounted last - after all routes - so it catches errors from
// every route above.
app.use(errorHandler);

export { app };
