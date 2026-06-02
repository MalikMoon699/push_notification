import express from "express";
import {
  getFcmTokken,
  sendNotification,
  getFcmTokkenByCredits,
  sendNotificationByCredits,
  sendMailPush,
} from "../controllers/notification.controller.js";
import { verifyApiKey } from "../middlewares/apiKey.middleware.js";
const router = express.Router();

router.post("/get-fcm-tokken-without-api", verifyApiKey, getFcmTokken);
router.post("/send-notification-without-api", verifyApiKey, sendNotification);
router.post("/get-fcm-tokken", verifyApiKey, getFcmTokkenByCredits);
router.post("/send-notification", verifyApiKey, sendNotificationByCredits);
router.post("/send-mail-push", verifyApiKey, sendMailPush);

export default router;
