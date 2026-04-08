import express from "express";
import {
  getFcmTokken,
  sendNotification,
  getFcmTokkenByCredits,
  sendNotificationByCredits,
} from "../controllers/notification.controller.js";
import { verifyApiKey } from "../middlewares/apiKey.middleware.js";
const router = express.Router();

router.post("/get-fcm-tokken", verifyApiKey, getFcmTokkenByCredits);
router.post("/send-notification", verifyApiKey, sendNotificationByCredits);

export default router;
