import { User } from "../models/User.js";
import { ApiError } from "./ApiError.js";

// Generates a new access + refresh token pair for a user, persists the
// refresh token on the User document (so it can be invalidated on logout
// or rotated on refresh), and returns both tokens. Centralized here so
// auth.controller.js doesn't duplicate this logic across
// register/login/refresh.
export const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};
