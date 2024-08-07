import { Router } from "express";
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerAdminSchema,
  loginAdminSchema,
  updateAdminSchema,
} from "../validators/admin.validator.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

//protected routes
router
  .route("/register")
  .post(upload.single("avatar"), validate(registerAdminSchema), createAdmin);

//public routes
router.route("/login").post(validate(loginAdminSchema), loginAdmin);

//secured routes
router.route("/logout").post(verifyJWT, logoutAdmin);
router
  .route("/:adminId")
  .put(
    verifyJWT,
    upload.single("avatar"),
    validate(updateAdminSchema),
    updateAdmin
  );

export { router as adminRoutes };
