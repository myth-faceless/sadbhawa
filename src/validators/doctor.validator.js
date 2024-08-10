import Joi from "joi";

export const qualificationSchema = Joi.object({
  name: Joi.string().required(),
  institution: Joi.string().required(),
});

export const createDoctorSchema = Joi.object({
  name: Joi.string().required(),
  nmcNumber: Joi.string().required(),
  specialization: Joi.string().required(),
  description: Joi.string().required(),
  qualification: Joi.array().items(qualificationSchema).required(),
  availableDays: Joi.array()
    .items(
      Joi.string().valid(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      )
    )
    .required(),
  dateOfBirth: Joi.date().required(),
  phoneNumber: Joi.string()
    .pattern(/^9[0-9]{9}$/)
    .max(15)
    .required(),
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required(),
  profileImage: Joi.any(),
});

export const updateDoctorSchema = Joi.object({
  name: Joi.string(),
  nmcNumber: Joi.string(),
  specialization: Joi.string(),
  description: Joi.string(),
  qualification: Joi.array().items(qualificationSchema),
  availableDays: Joi.array().items(
    Joi.string().valid(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    )
  ),
  dateOfBirth: Joi.date(),
  phoneNumber: Joi.string()
    .pattern(/^9[0-9]{9}$/)
    .max(15),
  email: Joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  profileImage: Joi.any(),
});
