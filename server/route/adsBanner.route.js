import express from "express";
import upload from "../middlewares/multer.js";

import {
  uploadAdsBannerImages,
  createAdsBanner,
  getActiveAdsBanner,
  getAllAdsBanner,
  updateAdsBanner,
  deleteAdsBanner,
} from "../controllers/adsBanner.controller.js";

import auth from "../middlewares/auth.js";

const adsBannerRouter = express.Router();

// ========== UPLOAD ẢNH (ADMIN) ==========
adsBannerRouter.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  uploadAdsBannerImages
);

// ========== CREATE (ADMIN) ==========
adsBannerRouter.post("/create", auth, createAdsBanner);

// ========== GET ACTIVE (PUBLIC) ==========
// FE gọi: /api/ads-banner/active?position=slider
adsBannerRouter.get("/active", getActiveAdsBanner);

// ========== GET ALL (ADMIN TABLE) ==========
// ĐỔI "/"" -> "/admin" để tránh FE nhầm endpoint
adsBannerRouter.get("/admin", auth, getAllAdsBanner);

// ========== UPDATE (ADMIN) ==========
adsBannerRouter.put("/:id", auth, updateAdsBanner);

// ========== DELETE (ADMIN) ==========
adsBannerRouter.delete("/:id", auth, deleteAdsBanner);

export default adsBannerRouter;
