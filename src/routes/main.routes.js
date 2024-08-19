import { Router } from "express";
const router = Router();

//routes import
import { userRoutes } from "./user.routes.js";
import { adminRoutes } from "./admin.routes.js";

//routes declaration
router.use("/admin/", adminRoutes);
router.use("/", userRoutes);

export { router as mainRoutes };
