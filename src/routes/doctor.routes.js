import { Router } from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../validators/doctor.validator.js";
import { upload } from "../middlewares/multter.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//public routes
router.route("/doctors").get(getAllDoctors);
router.route("/doctors/:doctorId").get(getDoctorById);

//protected routes
router
  .route("/")
  .post(
    verifyJWT,
    upload.single("profileImage"),
    validate(createDoctorSchema),
    createDoctor
  );

router
  .route("/:doctorId")
  .put(
    verifyJWT,
    upload.single("profileImage"),
    validate(updateDoctorSchema),
    updateDoctor
  );

router.route("/:doctorId").delete(verifyJWT, deleteDoctor);
export { router as doctorRoutes };
