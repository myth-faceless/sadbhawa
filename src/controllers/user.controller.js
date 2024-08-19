import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

export const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, contactNo, email, password, confirmPassword } =
      req.validateBody;

    if (password !== confirmPassword) {
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH
        )
      );
    }

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

export const updateSelf = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, email, contactNo } = req.validateBody;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND)
      );
    }
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(
          new ApiError(
            STATUS_CODES.DUPLICATE_ENTRY,
            ERROR_MESSAGES.USER_EMAIL_ALREADY_EXIST
          )
        );
      }
    }

    const avatarLocalPath = req.file?.path;
    let avatarUrl = user.avatar;
    if (avatarLocalPath) {
      try {
        const response = await uploadOnCloudinary(avatarLocalPath);
        avatarUrl = response.secure_url;
      } catch (error) {
        return next(
          new ApiError(
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            [uploadError.message]
          )
        );
      }
    }

    user.fullName = fullName || user.fullName;
    user.contactNo = contactNo || user.contactNo;
    user.email = email || user.email;
    user.avatar = avatarUrl;

    await user.save();

    res
      .status(STATUS_CODES.SUCCESS)
      .json(
        new ApiResponse(
          STATUS_CODES.SUCCESS,
          SUCCESS_MESSAGES.USER_UPDATED,
          user
        )
      );
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

export const updatePassword = asyncHandler(async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.validateBody;
    const userId = req.user.id;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordCorrect) {
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.INVALID_OLD_PASSWORD
        )
      );
    }

    if (newPassword !== confirmNewPassword) {
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH
        )
      );
    }

    user.password = newPassword;
    await user.save();
    res
      .status(STATUS_CODES.SUCCESS)
      .json(
        new ApiResponse(STATUS_CODES.SUCCESS, SUCCESS_MESSAGES.PASSWORD_UPDATED)
      );
  } catch (error) {
    return next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        error.stack
      )
    );
  }
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.validateBody;

  if (!email || !password) {
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        ERROR_MESSAGES.REQUIRED_EMAIL_PASSWORD
      )
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(
      new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.INCORRECT_EMAIL_PASSWORD
      )
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
  try {
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
  } catch (error) {
    return next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        error.stack
      )
    );
  }
});
