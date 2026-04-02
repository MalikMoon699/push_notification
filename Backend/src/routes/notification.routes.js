import express from "express";
import {
  getFcmTokken,
  sendNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/get-fcm-tokken", getFcmTokken);
router.post("/send-notification", sendNotification);

export default router;
