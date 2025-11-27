import BlogModel from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ============= CLOUDINARY CONFIG =============
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// Cache tạm mỗi lần upload
let imagesArr = [];

// ============================================================
// 📌 UPLOAD ẢNH (thumbnail hoặc ảnh trong bài viết)
// ============================================================
export async function uploadBlogImages(req, res) {
  try {
    imagesArr = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No images uploaded",
        success: false,
        error: true,
      });
    }

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, options);

      imagesArr.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      fs.unlinkSync(file.path);
    }

    return res.status(200).json({
      message: "Images uploaded successfully",
      success: true,
      error: false,
      images: imagesArr,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

// ============================================================
// 📌 TẠO BÀI VIẾT
// ============================================================
export async function createBlog(req, res) {
  try {
    const { title, shortDescription, content, slug, thumbnail } = req.body;

    if (!title || !slug || !shortDescription || !content) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        error: true,
      });
    }

    const exists = await BlogModel.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        message: "Slug already exists",
        success: false,
        error: true,
      });
    }

    const blog = new BlogModel({
      title,
      slug,
      shortDescription,
      content,
      thumbnail: thumbnail || {},
      author: req.userId || "Mộc Thiên Long",
    });

    await blog.save();

    return res.status(200).json({
      message: "Blog created successfully",
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

// ============================================================
// 📌 LẤY TẤT CẢ BÀI VIẾT (pagination)
// ============================================================
export async function getAllBlogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await BlogModel.countDocuments();
    const totalPages = Math.max(1, Math.ceil(total / perPage));

    const blogs = await BlogModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      success: true,
      error: false,
      blogs,
      totalPages,
      page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

// ============================================================
// 📌 LẤY BÀI VIẾT THEO SLUG
// ============================================================
export async function getBlogBySlug(req, res) {
  try {
    const blog = await BlogModel.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

// ============================================================
// 📌 UPDATE BÀI VIẾT
// ============================================================
export async function updateBlog(req, res) {
  try {
    const { id } = req.params;

    const updated = await BlogModel.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        slug: req.body.slug,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        thumbnail: req.body.thumbnail,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Blog not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Blog updated successfully",
      success: true,
      blog: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

// ============================================================
// 📌 XÓA BÀI VIẾT
// ============================================================
export async function deleteBlog(req, res) {
  try {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
        success: false,
        error: true,
      });
    }

    // Xóa thumbnail trên Cloudinary nếu tồn tại
    if (blog.thumbnail?.public_id) {
      try {
        await cloudinary.uploader.destroy(blog.thumbnail.public_id);
      } catch {}
    }

    await BlogModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Blog deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}
