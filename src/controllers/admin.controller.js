import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createAdmin = asyncHandler(async (req, res) => {
  try {
    const { fullName, userName, phoneNumber, email, password } =
      req.validateBody;

    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath);
    let avatarUrl = null;
    if (avatarLocalPath) {
      try {
        const response = await uploadOnCloudinary(avatarLocalPath);
        avatarUrl = response.secure_url;
      } catch (uploadError) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary", [
          uploadError.message,
        ]);
      }
    } else {
      avatarUrl = "../../public/avatar.png";
    }

    const admin = new Admin({
      fullName,
      userName,
      phoneNumber,
      email,
      password,
      avatar: avatarUrl,
    });
    await admin.save();

    const response = new ApiResponse(201, admin, "Admin created successfully");
    res.status(201).json(response);
  } catch (err) {
    const error = new ApiError(500, "Failed to create admin", err.stack);
    res.status(500).json(error);
  }
});

export { createAdmin };
