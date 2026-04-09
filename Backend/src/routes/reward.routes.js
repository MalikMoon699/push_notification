import express from "express";
import {
  claimTodayReward,
  claimFirstLoginReward,
  getRewardHistory,
} from "../controllers/reward.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/claim-today-reward", verifyToken, claimTodayReward);
router.get("/claim-first-login-reward", verifyToken, claimFirstLoginReward);
router.get("/get-reward-history", verifyToken, getRewardHistory);

export default router;