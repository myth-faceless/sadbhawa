import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { allowedOrigins } from "./constants/app.constants.js";
// import mainRoutes from "./routes/main.routes.js";

const app = express();

// middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("api/v1", (req, res) => {
  res.send("API V1 is running");
});

//routes import
import adminRouter from "./routes/admin.routes.js";

//routes declaration
app.use("/api/v1/admin", adminRouter);
// app.use ("/api/v1", mainRoutes)

export default app;
