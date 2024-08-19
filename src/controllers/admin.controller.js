import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { USER_ICON } from "../constants/app.constants.js";
import {
  STATUS_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/message.constants.js";

const generateToken = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.TOKEN_GENEREATION
    );
  }
};

export const createUser = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, contactNo, email, password } = req.validateBody;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(
        new ApiError(
          STATUS_CODES.DUPLICATE_ENTRY,
          ERROR_MESSAGES.USER_EMAIL_ALREADY_EXIST
        )
      );
    }

    const avatarLocalPath = req.file?.path;
    let avatarUrl = null;
    if (avatarLocalPath) {
      try {
        const response = await uploadOnCloudinary(avatarLocalPath);
        avatarUrl = response.secure_url;
      } catch (uploadError) {
        throw new ApiError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          ERROR_MESSAGES.CLOUDINARY_AVATAR_UPLOAD_FAILED,
          [uploadError.message]
        );
      }
    } else {
      avatarUrl = USER_ICON;
    }

    const user = await User.create({
      fullName,
      contactNo,
      email,
      password,
      avatar: avatarUrl,
    });

    const response = new ApiResponse(
      STATUS_CODES.CREATED,
      SUCCESS_MESSAGES.USER_REGISTERED,
      user
    );
    res.status(STATUS_CODES.CREATED).json(response);
  } catch (error) {
    next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        error.stack
      )
    );
  }
});

export const getAllUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.find({}).select("-password");
    if (!user) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }
    const response = new ApiResponse(
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.USER_FETCHED,
      user
    );
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        error.stack
      )
    );
  }
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findById(id);

    if (!user) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }
    const response = new ApiResponse(
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.USER_FETCHED,
      user
    );
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR_FETCHING_USER,
        error.stack
      )
    );
  }
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.validateBody;

  if (!email && !password) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_MESSAGES.REQUIRED_EMAIL_PASSWORD
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.INCORRECT_EMAIL_PASSWORD
    );
  }

  const accessToken = await generateToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(STATUS_CODES.SUCCESS)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        STATUS_CODES.SUCCESS,
        { user: loggedInUser, accessToken },
        SUCCESS_MESSAGES.USER_LOGGED_IN
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(STATUS_CODES.SUCCESS)
    .clearCookie("accessToken", options)
    .json(
      new ApiResponse(STATUS_CODES.SUCCESS, SUCCESS_MESSAGES.USER_LOGGED_OUT)
    );
});

export const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, contactNo, email } = req.validateBody;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }

    if (email && email == user.email) {
      const existedUser = await User.findOne({ email });
      if (existedUser) {
        return res
          .status(STATUS_CODES.DUPLICATE_ENTRY)
          .json(ApiResponse.error(ERROR_MESSAGES.USER_EMAIL_ALREADY_EXIST));
      }
    }

    // Handle avatar update if a new file is uploaded
    const avatarLocalPath = req.file?.path;
    let avatarUrl = user.avatar;

    if (avatarLocalPath) {
      try {
        const response = await uploadOnCloudinary(avatarLocalPath);
        avatarUrl = response.secure_url;
      } catch (uploadError) {
        throw new ApiError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          ERROR_MESSAGES.CLOUDINARY_AVATAR_UPLOAD_FAILED,
          [uploadError.message]
        );
      }
    }

    user.fullName = fullName || user.fullName;
    user.contactNo = contactNo || user.contactNo;
    user.email = email || user.email;
    user.avatar = avatarUrl;

    await user.save();

    const response = new ApiResponse(
      STATUS_CODES.SUCCESS,
      user,
      SUCCESS_MESSAGES.USER_UPDATED
    );
    res.status(200).json(response);
  } catch (err) {
    const error = new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.ERROR_UPDATING_USER,
      err.stack
    );
    res.status(500).json(error);
  }
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.validateBody;

  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_MESSAGES.INVALID_OLD_PASSWORD
    );
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(STATUS_CODES.SUCCESS)
    .json(
      new ApiResponse(STATUS_CODES.SUCCESS, SUCCESS_MESSAGES.PASSWORD_CHANGED)
    );
});
