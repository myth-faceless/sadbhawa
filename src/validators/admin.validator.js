import Joi from "joi";

const adminSchema = Joi.object({
  fullName: Joi.string().max(100).required(),
  userName: Joi.string().alphanum().min(3).max(30).required(),
  phoneNumber: Joi.string().pattern("/^[0-9]{10}$/").max(15).required(),
  email: Joi.string().pattern("/^[^s@]+@[^s@]+.[^s@]+$/").required(),
  password: Joi.string().pattern("/^[a-zA-Z0-9]{3,30}$/").required(),
  role: Joi.string().valid("admin", "superadmin").required(),
  avatar: Joi.string().optional(),
});

export default adminSchema;
