import express from "express";
import {
  getAdminDashboard,
  getUsersAdmin,
  updateUserStatus,
  getCreditSalesAnalytics,
  getPaymentRecords,
  getCreditLogsAnalytics,
  getCreditLogRecords,
  getApiKeyMonitoring,
  getApiKeyRecords,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getAdminDashboard);
router.get("/get-users", verifyToken, getUsersAdmin);
router.patch("/update-user-status/:userId", verifyToken, updateUserStatus);
router.get("/get-payment-analytics", verifyToken, getCreditSalesAnalytics);
router.get("/get-payment-records", verifyToken, getPaymentRecords);
router.get("/get-log-analytics", verifyToken, getCreditLogsAnalytics);
router.get("/get-log-records", verifyToken, getCreditLogRecords);
router.get("/get-api-monitoring", verifyToken, getApiKeyMonitoring);
router.get("/get-api-records", verifyToken, getApiKeyRecords);

export default router;
