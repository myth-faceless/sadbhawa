import { Router } from "express";
const router = Router();

//routes import
import { adminRoutes } from "./admin.routes.js";

//routes declaration
router.use("/admin", adminRoutes);

export { router as mainRoutes };
