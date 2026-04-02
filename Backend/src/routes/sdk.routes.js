import express from "express";
import { getSdkConfig } from "../controllers/sdk.controller.js";

const router = express.Router();

router.get("/config", getSdkConfig);

export default router;
