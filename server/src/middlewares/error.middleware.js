import { ApiError } from "../utils/ApiError.js";

// Centralized Express error handler (must have 4 args for Express to
// recognize it as an error-handling middleware). Every controller throws
// ApiError via asyncHandler, so this is the single place that converts
// any error - expected or not - into a consistent JSON response.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
        });
    }

    // Multer errors (e.g. file too large, wrong file type) arrive as
    // plain Errors, not ApiError - surface them as 400s instead of 500s.
    if (err.name === "MulterError" || /image files/i.test(err.message || "")) {
        return res.status(400).json({
            success: false,
            message: err.message,
            errors: [],
        });
    }

    // Anything unexpected: log it fully on the server, but never leak
    // stack traces or raw error details to the client in production.
    console.error("Unhandled error:", err);

    return res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : err.message,
        errors: [],
    });
};
