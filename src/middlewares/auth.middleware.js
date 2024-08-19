import {
  ERROR_MESSAGES,
  STATUS_CODES,
} from "../constants/message.constants.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getTokenFromRequest } from "../utils/authToken.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(
      new ApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED)
    );
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      return next(
        new ApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return next(
      new ApiError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN)
    );
  }
});

const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(STATUS_CODES.FORBIDDEN).json(ERROR_MESSAGES.FORBIDDEN);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { authenticate, isAdmin };
