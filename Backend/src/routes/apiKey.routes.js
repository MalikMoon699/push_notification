// src/routes/auth.routes.js
import express from "express";
import {
  genApiKey,
  getApiKeys,
  deleteApiKey,
  getUserApiUsage,
  getApiUsageByDate,
  getApiUsageByMonth,
} from "../controllers/apiKey.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/gen", verifyToken, genApiKey);
router.get("/get-keys", verifyToken, getApiKeys);
router.delete("/del-key/:keyId", verifyToken, deleteApiKey);
router.get("/api-usage", verifyToken, getUserApiUsage);
router.get("/api-uage-by-date", verifyToken, getApiUsageByDate);
router.get("/api-uage-by-month", verifyToken, getApiUsageByMonth);

export default router;
