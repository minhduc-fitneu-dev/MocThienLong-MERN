import AdsBannerModel from "../models/adsBanner.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ============ CLOUDINARY CONFIG ============
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// Bộ nhớ tạm khi upload ảnh
let imagesArr = [];

// ===================================================================
// ==================== UPLOAD IMAGES (ADMIN) ========================
// ===================================================================
export async function uploadAdsBannerImages(req, res) {
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
    console.error("Upload AdsBanner error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// ===================================================================
// ======================== CREATE BANNER =============================
// ===================================================================
export async function createAdsBanner(req, res) {
  try {
    let {
      image,
      title,
      subtitle,
      price,
      buttonText,
      categoryId,
      position,
      sortOrder,
      isActive,
    } = req.body;

    // FE gửi ảnh dạng string → parse lại
    if (typeof image === "string") {
      try {
        image = JSON.parse(image);
      } catch {}
    }

    // Nếu sử dụng UploadBox → dùng ảnh trong imagesArr
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

    const banner = new AdsBannerModel({
      image,
      title: title || "",
      subtitle: subtitle || "",
      price: price || "",
      buttonText: buttonText || "Xem ngay",
      categoryId: categoryId || null,
      position: position || "slider",
      sortOrder: sortOrder || 0,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const saved = await banner.save();
    imagesArr = []; // reset cache

    return res.status(200).json({
      message: "Ads banner created successfully",
      success: true,
      error: false,
      banner: saved,
    });
  } catch (error) {
    console.error("Create AdsBanner error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// ===================================================================
// ===================== GET ACTIVE BY POSITION ======================
// ===================================================================
export async function getActiveAdsBanner(req, res) {
  try {
    const position = req.query.position || "slider";

    const banners = await AdsBannerModel.find({
      isActive: true,
      $or: [{ position }, { position: "both" }],
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: banners,
    });
  } catch (error) {
    console.error("Get active AdsBanner error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// ===================================================================
// ============================ GET ALL ===============================
// ===================================================================
export async function getAllAdsBanner(req, res) {
  try {
    const banners = await AdsBannerModel.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      error: false,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// ===================================================================
// ========================== UPDATE BANNER ===========================
// ===================================================================
export async function updateAdsBanner(req, res) {
  try {
    const { id } = req.params;

    const current = await AdsBannerModel.findById(id);
    if (!current) {
      return res.status(404).json({
        message: "Banner not found",
        success: false,
        error: true,
      });
    }

    let newImage = req.body.image;

    // Parse nếu FE gửi string
    if (typeof newImage === "string") {
      try {
        newImage = JSON.parse(newImage);
      } catch {
        newImage = undefined;
      }
    }

    // Nếu UploadBox upload ảnh mới →
    if (imagesArr.length > 0) {
      // Xoá ảnh cũ Cloudinary
      if (current.image?.public_id) {
        try {
          await cloudinary.uploader.destroy(current.image.public_id);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
      newImage = imagesArr[0];
    }

    const payload = {
      image: newImage || current.image,
      title: req.body.title ?? current.title,
      subtitle: req.body.subtitle ?? current.subtitle,
      price: req.body.price ?? current.price,
      buttonText: req.body.buttonText ?? current.buttonText,
      categoryId: req.body.categoryId ?? current.categoryId,
      position: req.body.position ?? current.position,
      sortOrder:
        typeof req.body.sortOrder !== "undefined"
          ? req.body.sortOrder
          : current.sortOrder,
      isActive:
        typeof req.body.isActive !== "undefined"
          ? req.body.isActive
          : current.isActive,
    };

    const updated = await AdsBannerModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    imagesArr = [];

    return res.status(200).json({
      message: "Ads banner updated successfully",
      success: true,
      error: false,
      banner: updated,
    });
  } catch (error) {
    console.error("Update AdsBanner error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// ===================================================================
// ============================ DELETE BANNER ==========================
// ===================================================================
export async function deleteAdsBanner(req, res) {
  try {
    const { id } = req.params;

    const banner = await AdsBannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
        success: false,
        error: true,
      });
    }

    // Xóa ảnh Cloudinary
    if (banner.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(banner.image.public_id);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await AdsBannerModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Ads banner deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete AdsBanner error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}
