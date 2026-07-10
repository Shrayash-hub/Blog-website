import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        // Slug is generated from the title on the frontend/controller and
        // acts as the human-readable identifier, mirroring how the old
        // Appwrite setup used slug as the document ID.
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: {
            type: String,
            trim: true,
            default: "",
        },
        featuredImage: {
            type: String, // stores the file path/URL (local disk now, S3 later)
            default: "",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        tags: {
            type: [String],
            default: [],
        },
        userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

postSchema.plugin(mongoosePaginate);

export const Post = mongoose.model("Post", postSchema);
