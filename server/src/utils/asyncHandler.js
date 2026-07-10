// Wraps an async route handler so any thrown/rejected error is forwarded
// to Express's error-handling middleware instead of crashing the process
// or requiring a try/catch block in every single controller.
const asyncHandler = (requestHandler) => (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export { asyncHandler };
