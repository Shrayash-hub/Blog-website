import slugify from "slugify";
import { Post } from "../models/Post.js";

// Generates a URL-safe slug from a title and guarantees uniqueness by
// appending a numeric suffix if the base slug is already taken. Doing
// this server-side (instead of trusting client-generated slugs, as the
// old Appwrite setup did) avoids collisions and keeps slug logic in one
// place.
export const generateUniqueSlug = async (title) => {
    const baseSlug = slugify(title, { lower: true, strict: true });

    let slug = baseSlug;
    let counter = 1;

    while (await Post.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }

    return slug;
};
