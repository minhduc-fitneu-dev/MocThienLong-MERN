import express from "express";
import { adminGetStats } from "../controllers/adminStats.controller.js";
import adminAuth from "../middlewares/adminAuth.js";
import auth from "../middlewares/auth.js";

const adminStatsRouter = express.Router();

// Admin phải đăng nhập mới xem được stats
adminStatsRouter.get("/", auth, adminAuth, adminGetStats);

export default adminStatsRouter;
