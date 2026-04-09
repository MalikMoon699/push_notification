import express from "express";
import {
  getUsageStates,
  getUsageRecords,
} from "../controllers/usage.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/get-states", verifyToken, getUsageStates);
router.get("/get-records", verifyToken, getUsageRecords);

export default router;