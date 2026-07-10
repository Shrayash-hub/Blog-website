// Standardized success response shape, mirrored against ApiError so every
// endpoint - success or failure - returns a consistent JSON contract.
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
