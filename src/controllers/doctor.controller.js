import { Doctor } from "../models/doctor.model.js";
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

const createDoctor = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      nmcNumber,
      specialization,
      description,
      qualification,
      availableDays,
      dateOfBirth,
      phoneNumber,
      email,
    } = req.validateBody;

    const existedDoctor = await Doctor.findOne({ email });

    if (existedDoctor) {
      return res
        .status(STATUS_CODES.DUPLICATE_ENTRY)
        .json(
          new ApiResponse(
            STATUS_CODES.DUPLICATE_ENTRY,
            ERROR_MESSAGES.USER_EMAIL_ALREADY_EXIST,
            false
          )
        );
    }

    const profileImageLocalPath = req.file?.path;
    let profileImageUrl = null;
    if (profileImageLocalPath) {
      try {
        const response = await uploadOnCloudinary(profileImageLocalPath);
        profileImageUrl = response.secure_url;
      } catch (uploadError) {
        throw new ApiError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          ERROR_MESSAGES.CLOUDINARY_AVATAR_UPLOAD_FAILED,
          [uploadError.message]
        );
      }
    } else {
      profileImageUrl = USER_ICON;
    }

    const doctor = await Doctor.create({
      name,
      nmcNumber,
      specialization,
      description,
      qualification,
      availableDays,
      dateOfBirth,
      phoneNumber,
      email,
      profileImage: profileImageUrl,
    });

    const response = new ApiResponse(
      STATUS_CODES.CREATED,
      SUCCESS_MESSAGES.DOCTOR_CREATED,
      doctor
    );
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR_CREATING_DOCTOR,
        error.stack
      )
    );
  }
});

const getAllDoctors = asyncHandler(async (req, res, next) => {
  try {
    const doctor = await Doctor.find({});
    const response = new ApiResponse(
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DOCTOR_FETCHED,
      doctor
    );
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(
      new ApiResponse(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR_FETCHING_DOCTOR,
        error.stack
      )
    );
  }
});

const getDoctorById = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;
  console.log(doctorId);
  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOCTOR_NOT_FOUND)
      );
    }
    const response = new ApiResponse(
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DOCTOR_FETCHED,
      doctor
    );
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR_FETCHING_DOCTOR,
        error.stack
      )
    );
  }
});

const updateDoctor = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;

  const {
    name,
    nmcNumber,
    specialization,
    description,
    qualification,
    availableDays,
    dateOfBirth,
    phoneNumber,
    email,
  } = req.validateBody;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOCTOR_NOT_FOUND)
      );
    }
    const profileImageLocalPath = req.file?.path;
    let profileImageUrl = doctor.profileImage;

    if (profileImageLocalPath) {
      try {
        const response = await uploadOnCloudinary(profileImageLocalPath);
        profileImageUrl = response.secure_url;
      } catch (uploadError) {
        throw new ApiError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          ERROR_MESSAGES.CLOUDINARY_AVATAR_UPLOAD_FAILED,
          [uploadError.message]
        );
      }
    }

    doctor.name = name || doctor.name;
    doctor.nmcNumber = nmcNumber || doctor.nmcNumber;
    doctor.specialization = specialization || doctor.specialization;
    doctor.description = description || doctor.description;
    doctor.qualification = qualification || doctor.qualification;
    doctor.availableDays = availableDays || doctor.availableDays;
    doctor.dateOfBirth = dateOfBirth || doctor.dateOfBirth;
    doctor.phoneNumber = phoneNumber || doctor.phoneNumber;
    doctor.email = email || doctor.email;
    doctor.profileImage = profileImageUrl || doctor.profileImage;

    await doctor.save();

    const response = new ApiResponse(
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DOCTOR_UPDATED,
      doctor
    );
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR_UPDATING_DOCTOR,
        error.stack
      )
    );
  }
});

const deleteDoctor = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return next(
        new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.DOCTOR_NOT_FOUND)
      );
    }

    await doctor.deleteOne();

    const response = new ApiResponse(
      STATUS_CODES.SUCCESS,
      SUCCESS_MESSAGES.DOCTOR_DELETED,
      true
    );
    res.status(200).json(response);
  } catch (err) {
    next(
      new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.ERROR_DELETING_DOCTOR,
        err.stack
      )
    );
  }
});

export {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
