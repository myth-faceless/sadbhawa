import { Router } from "express";
const router = Router();

//routes import
import adminRouter from "./admin.routes.js";

//routes declaration
router.use("/admin", adminRouter);

export default router;
