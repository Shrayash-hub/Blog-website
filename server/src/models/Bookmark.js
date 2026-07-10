import mongoose, { Schema } from "mongoose";

const bookmarkSchema = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        postID: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

// A user can only bookmark a given post once - enforced at the database
// level rather than just checked in application code.
bookmarkSchema.index({ userID: 1, postID: 1 }, { unique: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
