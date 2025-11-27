import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

import {
  uploadBlogImages,
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const blogRouter = Router();

// Upload ảnh (thumbnail + ảnh nội dung)
blogRouter.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  uploadBlogImages
);

// Tạo bài viết
blogRouter.post("/create", auth, createBlog);

// Lấy tất cả bài viết (pagination)
blogRouter.get("/", getAllBlogs);

// Lấy bài viết theo slug
blogRouter.get("/slug/:slug", getBlogBySlug);

// Update bài viết
blogRouter.put("/:id", auth, updateBlog);

// Xóa bài viết
blogRouter.delete("/:id", auth, deleteBlog);

export default blogRouter;
