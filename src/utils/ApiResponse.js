class ApiResponse {
  constructor(message, statusCode, success, data = null) {
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
  }

  static success(message, statusCode, data = null) {
    return new ApiResponse(message, statusCode, true, data);
  }

  static error(message, statusCode) {
    return new ApiResponse(message, statusCode, false);
  }
}

export default ApiResponse;
