import { Router } from "express";
import { registerAdmin } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multter.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerAdmin
);

export { router as adminRoutes };
