import { PORT } from "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import authRoute from "./routes/auth.routes.js";
import keyRoute from "./routes/apiKey.routes.js";
import paymentRoute from "./routes/payment.routes.js";
import sdkRoutes from "./routes/sdk.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import connectToDB from "./database/mongodb.js";

const app = express();
connectToDB();

app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the Server API");
});

app.use("/api/auth", authRoute);
app.use("/api/v1/key", keyRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/sdk", sdkRoutes);
app.use("/api/notification", notificationRoutes);

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
