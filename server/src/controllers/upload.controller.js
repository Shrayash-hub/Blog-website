import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Protected - handles a single ad-hoc image upload that isn't tied to a
// specific post or profile yet (e.g. an image dropped into the post
// content editor before the post itself is saved). Returns the URL the
// frontend should insert into the content. Featured images and avatars
// are uploaded directly through their own create/update endpoints and
// don't go through this controller.
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No image file provided");
    }

    // filename matches how Post.featuredImage / Profile.avatar store
    // images. The frontend builds the full URL as
    // `${VITE_API_BASE_URL}/uploads/${filename}`.
    return res.status(201).json(
        new ApiResponse(
            201,
            { filename: req.file.filename },
            "Image uploaded successfully"
        )
    );
});

export { uploadImage };
