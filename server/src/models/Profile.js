import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        // Optional display name override for the profile page. If empty,
        // the frontend falls back to User.name.
        name: {
            type: String,
            trim: true,
            default: "",
        },
        bio: {
            type: String,
            trim: true,
            default: "",
        },
        avatar: {
            type: String, // local disk path now, S3 URL later
            default: "",
        },
        website: {
            type: String,
            trim: true,
            default: "",
        },
        github: {
            type: String,
            trim: true,
            default: "",
        },
        linkedin: {
            type: String,
            trim: true,
            default: "",
        },
    },
    { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
