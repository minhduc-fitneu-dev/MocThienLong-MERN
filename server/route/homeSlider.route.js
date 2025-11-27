// routes/homeSlider.route.js
import express from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  uploadHomeSliderImages,
  createHomeSlide,
  getHomeSlides,
  getAllHomeSlides,
  updateHomeSlide,
  deleteHomeSlide,
} from "../controllers/homeSlider.controller.js";

const homeSliderRouter = express.Router();

homeSliderRouter.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  uploadHomeSliderImages
);

homeSliderRouter.post("/create", auth, createHomeSlide);

homeSliderRouter.get("/", getHomeSlides);

homeSliderRouter.get("/all", auth, getAllHomeSlides);

homeSliderRouter.put("/:id", auth, updateHomeSlide);

homeSliderRouter.delete("/:id", auth, deleteHomeSlide);

export default homeSliderRouter;
