import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "Name, email and password are required");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
        throw new ApiError(409, "A user with this email already exists");
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                { user: createdUser, accessToken },
                "User registered successfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "No account found with this email");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken },
                "Logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    let decoded;
    try {
        decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(401, "Refresh token is invalid or expired");
    }

    const user = await User.findById(decoded._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is invalid or has been used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, { accessToken }, "Access token refreshed")
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
};
