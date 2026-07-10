import { Router } from "express";
import { getProfile, upsertProfile } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Public
router.route("/:userID").get(getProfile);

// Protected
router.route("/").put(verifyJWT, upload.single("avatar"), upsertProfile);

export default router;
