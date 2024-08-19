import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../validators/user.validator.js";
import { upload } from "../middlewares/multter.middleware.js";
import {
  createUser,
  getAllUser,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();

//public user route
router
  .route("/register")
  .post(upload.single("avatar"), validate(registerUserSchema), createUser);

router.route("/login").post(validate(loginUserSchema), loginUser);
router.route("/logout").post(authenticate, logoutUser);

//protected user route
router
  .route("/profile")
  .put(authenticate, validate(updateUserSchema), updateUser);
export { router as userRoutes };
