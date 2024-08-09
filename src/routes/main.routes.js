import { Router } from "express";
const router = Router();

//routes import
import { adminRoutes } from "./admin.routes.js";
import { doctorRoutes } from "./doctor.routes.js";

//routes declaration
router.use("/admin", adminRoutes);
router.use("/doctors", doctorRoutes);

export { router as mainRoutes };
