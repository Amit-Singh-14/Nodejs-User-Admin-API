import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

config({ path: "./.env" });

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: false,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser({}));

import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter);

import adminRouter from "./routes/admin.route.js";
app.use("/api/v1/admins", adminRouter);
export { app };
