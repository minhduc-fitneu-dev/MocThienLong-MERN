// controllers/homeSlider.controller.js
import HomeSliderModel from "../models/homeSlider.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ============ CLOUDINARY ============
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// cache tạm thời (giống category/product)
let imagesArr = [];

// ===================================================================
// ==================== UPLOAD IMAGES (ADMIN) ========================
// ===================================================================
export async function uploadHomeSliderImages(req, res) {
  try {
    imagesArr = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No images uploaded",
        error: true,
        success: false,
      });
    }

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (const f of req.files) {
      const result = await cloudinary.uploader.upload(f.path, options);

      imagesArr.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      fs.unlinkSync(f.path);
    }

    return res.status(200).json({
      message: "Images uploaded successfully",
      success: true,
      error: false,
      images: imagesArr,
    });
  } catch (error) {
    console.error("Upload slider images error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ===================================================================
// ======================== CREATE SLIDE =============================
// ===================================================================
export async function createHomeSlide(req, res) {
  try {
    let { image, title, subtitle, redirectUrl, sortOrder, isActive } = req.body;

    // FE gửi ảnh dạng string → parse lại
    if (typeof image === "string") {
      try {
        image = JSON.parse(image);
      } catch {}
    }

    // Nếu FE gửi imagesArr sau khi upload → tự lấy ảnh đầu tiên
    if (!image && imagesArr.length > 0) {
      image = imagesArr[0];
    }

    if (!image || !image.url || !image.public_id) {
      return res.status(400).json({
        message: "Image {url, public_id} is required",
        success: false,
        error: true,
      });
    }

    const slide = new HomeSliderModel({
      image,
      title: title || "",
      subtitle: subtitle || "",
      redirectUrl: redirectUrl || "",
      sortOrder: sortOrder || 0,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const saved = await slide.save();
    imagesArr = [];

    return res.status(200).json({
      message: "Home slide created successfully",
      success: true,
      error: false,
      slide: saved,
    });
  } catch (error) {
    console.error("Create slide error:", error);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

// ===================================================================
// ================ GET ACTIVE SLIDES (CHO FE HOME) ==================
// ===================================================================
export async function getHomeSlides(req, res) {
  try {
    const slides = await HomeSliderModel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: slides,
    });
  } catch (error) {
    console.error("Get slides error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// ===================================================================
// ============ GET ALL SLIDES (CHO ADMIN TABLE) =====================
// ===================================================================
export async function getAllHomeSlides(req, res) {
  try {
    const slides = await HomeSliderModel.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: slides,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

// ===================================================================
// ========================== UPDATE SLIDE ============================
// ===================================================================
export async function updateHomeSlide(req, res) {
  try {
    const { id } = req.params;

    const current = await HomeSliderModel.findById(id);
    if (!current) {
      return res.status(404).json({
        message: "Slide not found",
        success: false,
        error: true,
      });
    }

    let newImage = req.body.image;

    // FE gửi dạng string → parse
    if (typeof newImage === "string") {
      try {
        newImage = JSON.parse(newImage);
      } catch {
        newImage = undefined;
      }
    }

    // Nếu FE vừa upload ảnh mới qua API upload → thay ảnh
    if (imagesArr.length > 0) {
      // xóa ảnh cũ trên cloudinary
      if (current.image?.public_id) {
        try {
          await cloudinary.uploader.destroy(current.image.public_id);
        } catch {}
      }

      newImage = imagesArr[0];
    }

    const payload = {
      image: newImage || current.image,
      title: req.body.title ?? current.title,
      subtitle: req.body.subtitle ?? current.subtitle,
      redirectUrl: req.body.redirectUrl ?? current.redirectUrl,
      sortOrder:
        typeof req.body.sortOrder !== "undefined"
          ? req.body.sortOrder
          : current.sortOrder,
      isActive:
        typeof req.body.isActive !== "undefined"
          ? req.body.isActive
          : current.isActive,
    };

    const updated = await HomeSliderModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    imagesArr = [];

    return res.status(200).json({
      message: "Home slide updated successfully",
      success: true,
      error: false,
      slide: updated,
    });
  } catch (error) {
    console.error("Update slide error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// ===================================================================
// ========================== DELETE SLIDE ============================
// ===================================================================
export async function deleteHomeSlide(req, res) {
  try {
    const { id } = req.params;

    const slide = await HomeSliderModel.findById(id);
    if (!slide) {
      return res.status(404).json({
        message: "Slide not found",
        success: false,
        error: true,
      });
    }

    // Xoá ảnh trên Cloudinary
    if (slide.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(slide.image.public_id);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await HomeSliderModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Home slide deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete slide error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}
