import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from "../validators/user.validator.js";
import { upload } from "../middlewares/multter.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
  updateSelf,
} from "../controllers/user.controller.js";
const router = Router();

//public user route
router
  .route("/register")
  .post(upload.single("avatar"), validate(registerUserSchema), registerUser);

router.route("/login").post(validate(loginUserSchema), loginUser);
router.route("/logout").post(authenticate, logoutUser);

//protected user route
router
  .route("/profile")
  .put(
    authenticate,
    upload.single("avatar"),
    validate(updateUserSchema),
    updateSelf
  );
router
  .route("update-password")
  .put(authenticate, validate(updateUserPasswordSchema), updatePassword);

export { router as userRoutes };
