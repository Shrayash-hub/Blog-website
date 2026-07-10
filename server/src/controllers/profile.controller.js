import path from "path";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeLocalFile } from "../utils/removeLocalFile.js";
import { uploadDir } from "../middlewares/upload.middleware.js";

// Public - fetch a user's profile by their userID. Falls back to an
// empty-but-valid profile shape if the user hasn't created one yet, so
// the frontend doesn't need special-case handling for "no profile".
const getProfile = asyncHandler(async (req, res) => {
    const { userID } = req.params;

    const user = await User.findById(userID).select("name email");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const profile = await Profile.findOne({ userID });

    const responseData = {
        userID,
        name: profile?.name || user.name,
        email: user.email,
        bio: profile?.bio || "",
        avatar: profile?.avatar || "",
        website: profile?.website || "",
        github: profile?.github || "",
        linkedin: profile?.linkedin || "",
    };

    return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Profile fetched successfully"));
});

// Protected - create or update the logged-in user's own profile.
// Uses findOneAndUpdate with upsert so the first save creates the
// document and subsequent saves update it, without a separate
// create-vs-update branch.
const upsertProfile = asyncHandler(async (req, res) => {
    const { name, bio, website, github, linkedin } = req.body;

    const existingProfile = await Profile.findOne({ userID: req.user._id });

    const updateData = {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(website !== undefined && { website }),
        ...(github !== undefined && { github }),
        ...(linkedin !== undefined && { linkedin }),
    };

    // Replace the avatar only if a new file was uploaded, and clean up
    // the previous file from disk so storage doesn't grow unbounded.
    if (req.file) {
        if (existingProfile?.avatar) {
            removeLocalFile(path.join(uploadDir, existingProfile.avatar));
        }
        updateData.avatar = req.file.filename;
    }

    const profile = await Profile.findOneAndUpdate(
        { userID: req.user._id },
        { $set: updateData, $setOnInsert: { userID: req.user._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, profile, "Profile saved successfully"));
});

export { getProfile, upsertProfile };
