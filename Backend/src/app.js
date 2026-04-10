import {
  PORT,
  NODE_ENV,
  DB_URI,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_SENDER_ID,
  FIREBASE_APP_ID,
  VAPID_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  JWT_SECRET,
  FRONTEND_URL,
  STRIPE_SECRET_KEY,
} from "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoute from "./routes/auth.routes.js";
import dashAnalyticRoutes from "./routes/dashAnalytics.routes.js";
import keyRoute from "./routes/apiKey.routes.js";
import paymentRoute from "./routes/payment.routes.js";
import sdkRoutes from "./routes/sdk.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import usageRoutes from "./routes/usage.routes.js";
import rewardsRoutes from "./routes/reward.routes.js";
import connectToDB from "./database/mongodb.js";

const app = express();

await connectToDB();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/v1/key", keyRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/sdk", sdkRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/dashAnalytic", dashAnalyticRoutes);

app.get("/api/health/db", async (req, res) => {
  try {
    await connectToDB();

    const state = mongoose.connection.readyState;

    const states = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    res.status(200).json({
      success: true,
      dbState: states[state],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "DB connection failed",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send(
    [
      "Welcome to the Server API",
      "All env--->  <br>",
      `PORT: ${PORT} <br> <br>`,
      `NODE_ENV: ${NODE_ENV} <br> <br>`,
      `DB_URI: ${DB_URI} <br> <br>`,
      `FIREBASE_API_KEY: ${FIREBASE_API_KEY} <br> <br>`,
      `FIREBASE_AUTH_DOMAIN: ${FIREBASE_AUTH_DOMAIN} <br> <br>`,
      `FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID} <br> <br>`,
      `FIREBASE_STORAGE_BUCKET: ${FIREBASE_STORAGE_BUCKET} <br> <br>`,
      `FIREBASE_SENDER_ID: ${FIREBASE_SENDER_ID} <br> <br>`,
      `FIREBASE_APP_ID: ${FIREBASE_APP_ID} <br> <br>`,
      `VAPID_KEY: ${VAPID_KEY} <br> <br>`,
      `FIREBASE_CLIENT_EMAIL: ${FIREBASE_CLIENT_EMAIL} <br> <br>`,
      `FIREBASE_PRIVATE_KEY: ${FIREBASE_PRIVATE_KEY} <br> <br>`,
      `JWT_SECRET: ${JWT_SECRET} <br> <br>`,
      `FRONTEND_URL: ${FRONTEND_URL} <br> <br>`,
      `STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY} <br> <br>`,
    ].join("\n"),
  );
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
