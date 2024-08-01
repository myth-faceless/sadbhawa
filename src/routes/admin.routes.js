import { Router } from "express";
import { createAdmin } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import adminSchema from "../validators/admin.validator.js";

const router = Router();

router
  .route("/register")
  .post(upload.single("avatar"), validate(adminSchema), createAdmin);

export { router as adminRoutes };
