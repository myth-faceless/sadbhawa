import { Router } from "express";
import {
  loginUser,
  logoutUser,
  getAllUser,
  getUserById,
  updateUser,
  updateUserPassword,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
} from "../validators/user.validator.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//public routes

router.route("/login").post(validate(loginUserSchema), loginUser);
router.route("/logout").post(authenticate, logoutUser);

//protected admin routes
router.route("/users").get(authenticate, isAdmin, getAllUser);
router.route("/users/:id").get(authenticate, isAdmin, getUserById);
router
  .route("/users/:id")
  .put(
    authenticate,
    isAdmin,
    upload.single("avatar"),
    validate(updateUserSchema),
    updateUser
  );
router
  .route("/update-password")
  .post(
    authenticate,
    isAdmin,
    validate(updateUserPasswordSchema),
    updateUserPassword
  );

export { router as adminRoutes };
