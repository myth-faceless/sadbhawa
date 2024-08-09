import { Router } from "express";
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
  changeAdminPassword,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerAdminSchema,
  loginAdminSchema,
  updateAdminSchema,
  changeAdminPasswordSchema,
} from "../validators/admin.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//public routes
router
  .route("/register")
  .post(upload.single("avatar"), validate(registerAdminSchema), createAdmin);
router.route("/login").post(validate(loginAdminSchema), loginAdmin);

//protected routes
router.route("/logout").post(verifyJWT, logoutAdmin);
router
  .route("/:adminId")
  .put(
    verifyJWT,
    upload.single("avatar"),
    validate(updateAdminSchema),
    updateAdmin
  );
router
  .route("/changepassword")
  .post(verifyJWT, validate(changeAdminPasswordSchema), changeAdminPassword);

export { router as adminRoutes };
