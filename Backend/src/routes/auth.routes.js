// src/routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  getUserData,
  getUserDetailsById,
  updateUser,
  updatePassword,
  updatecredits,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUserData);
router.get("/getUserDetailsById/:userId", verifyToken, getUserDetailsById);
router.patch("/:userId", verifyToken, updateUser);
router.patch("/updatePassword/:userId", verifyToken, updatePassword);
router.patch("/updatecredits/:userId", verifyToken, updatecredits);

export default router;
