export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  DUPLICATE_ENTRY: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error.",
  UNAUTHORIZED: "Access denied. Please login to continue.",
  FORBIDDEN: "Access denied. Admin only.",

  USER_EMAIL_ALREADY_EXIST:
    "User with this email already exist. Please try with other email.",
  USER_PHONE_ALREADY_EXIST:
    "User with this phone already exist. Please try with other phone.",
  ERROR_CREATING_USER: "Error Registering User.",
  ERROR_UPDATING_USER: "Error Updating User.",
  ERROR_FETCHING_USER: "Error Fetching User.",

  INVALID_EMAIL_PASSWORD: "Invalid Email, Phone or password.",
  INCORRECT_EMAIL_PASSWORD: "Incorrect Email or password.",
  REQUIRED_EMAIL_PASSWORD: "Email and Password is Required",
  PASSWORDS_DO_NOT_MATCH: "Password do not match.",

  USER_NOT_FOUND: "User not found.",
  USER_NOT_FOUND_INVALID_TOKEN: "User not found or invalid token.",
  INVALID_OLD_PASSWORD: "Old Password doesn't match or invalid.",
  INVALID_TOKEN: "Invalid Token.",

  SAME_PASSWORD: "New password cannot be the same as old password.",

  CLOUDINARY_UPLOAD_FAILED: "Failed to upload to cloudinary",
  CLOUDINARY_AVATAR_UPLOAD_FAILED: "Failed to upload avatar to cloudinary",

  TOKEN_GENEREATION: "Something went wrong while generating access token",
};

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "User registered successfully.",
  USER_LOGGED_IN: "User logged in successfully.",
  USER_LOGGED_OUT: "User logged out successfully.",
  USER_UPDATED: "User updated successfully.",

  USER_FETCHED: "User fetched successfully",

  ADMIN_LOGGED_IN: "Admin logged in successfully.",
  ADMIN_LOGGED_OUT: "Admin logged out successfully.",
  ADMIN_UPDATED: "Admin updated successfully.",

  PASSWORD_UPDATED: "Password updated successfully.",
};
