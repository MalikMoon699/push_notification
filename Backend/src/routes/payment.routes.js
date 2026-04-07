import express from "express";
import {
  createCheckoutSection,
  verifyPayment,
  getPaymentRecords,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", verifyToken, createCheckoutSection);
router.post("/verify-payment", verifyToken, verifyPayment);
router.get("/payment-records", verifyToken, getPaymentRecords);

export default router;
