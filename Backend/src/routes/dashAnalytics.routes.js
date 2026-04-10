import express from "express";
import {
  getDashBoardData,
  getAnalyticsData,
  getApiWeeklyRequests,
} from "../controllers/dashAnalytics.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/get-dash-data", verifyToken, getDashBoardData);
router.get("/get-anal-data", verifyToken, getAnalyticsData);
router.get("/get-api-request-count", verifyToken, getApiWeeklyRequests);

export default router;
