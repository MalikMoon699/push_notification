// src/routes/auth.routes.js
import express from "express";
import {
  genApiKey,
  getApiKeys,
  deleteApiKey,
  getApiUsageStates,
  getUserApiUsage,
} from "../controllers/apiKey.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/gen", verifyToken, genApiKey);
router.get("/get-keys", verifyToken, getApiKeys);
router.delete("/del-key/:keyId", verifyToken, deleteApiKey);
router.get("/api-usage-states", verifyToken, getApiUsageStates);
router.get("/api-usage", verifyToken, getUserApiUsage);

export default router;
