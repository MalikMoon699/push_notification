import express from "express";
import {
  createCheckoutSection,
  verifyPayment,markPaymentFailed,
  getPaymentRecords,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", verifyToken, createCheckoutSection);
router.post("/verify-payment", verifyToken, verifyPayment);
router.post("/fail-payment", verifyToken, markPaymentFailed);
router.get("/payment-records", verifyToken, getPaymentRecords);

export default router;
