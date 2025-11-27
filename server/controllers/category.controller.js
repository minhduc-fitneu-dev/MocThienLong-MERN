// controllers/category.controller.js
import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ============ CLOUDINARY ============
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// cache tạm khi upload
let imagesArr = [];

// ============ UPLOAD IMAGES ============
export async function uploadImages(req, res) {
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
      imagesArr.push({ url: result.secure_url, public_id: result.public_id });
      fs.unlinkSync(f.path);
    }

    return res.status(200).json({
      message: "Images uploaded successfully",
      error: false,
      success: true,
      images: imagesArr,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ CREATE CATEGORY ============
export async function createCategory(req, res) {
  try {
    let { name, parentId = null, parentCatName = null, images } = req.body;

    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch {
        images = [];
      }
    }
    if (!Array.isArray(images)) images = [];

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
        error: true,
        success: false,
      });
    }

    // Root: bắt buộc có ảnh; Sub/Third: cho phép không có ảnh
    const isRoot = !parentId;
    if (isRoot && images.length === 0) {
      return res.status(400).json({
        message: "Root category requires at least 1 image",
        error: true,
        success: false,
      });
    }

    const doc = new CategoryModel({
      name: name.trim(),
      images,
      parentId: parentId || null,
      parentCatName: parentCatName || null,
    });

    const saved = await doc.save();
    imagesArr = [];

    return res.status(200).json({
      message: "Category created successfully",
      success: true,
      error: false,
      category: saved,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ============ BUILD TREE ============
export async function getCategories(req, res) {
  try {
    const categories = await CategoryModel.find().lean();

    // Map để dựng tree
    const map = new Map();
    categories.forEach((c) => map.set(String(c._id), { ...c, children: [] }));

    const roots = [];
    categories.forEach((c) => {
      if (c.parentId) {
        const parent = map.get(String(c.parentId));
        if (parent) parent.children.push(map.get(String(c._id)));
      } else {
        roots.push(map.get(String(c._id)));
      }
    });

    return res.status(200).json({
      error: false,
      success: true,
      data: roots,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET SINGLE ============
export async function getCategory(req, res) {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "The category with the given ID was not found.",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({ error: false, success: true, category });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ DELETE IMAGE ============
export async function removeImageFromCloudinary(req, res) {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res
        .status(400)
        .json({ error: true, message: "public_id missing" });
    }
    await cloudinary.uploader.destroy(public_id);
    return res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: true, message: error.message });
  }
}

// ============ RECURSIVE DELETE ============
async function deleteCategoryRecursive(categoryId) {
  const children = await CategoryModel.find({ parentId: categoryId }).lean();

  for (const child of children) {
    await deleteCategoryRecursive(child._id);
  }

  const cat = await CategoryModel.findById(categoryId);
  if (cat?.images?.length) {
    for (const img of cat.images) {
      if (img?.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch {}
      }
    }
  }

  await CategoryModel.findByIdAndDelete(categoryId);
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const exist = await CategoryModel.findById(id);
    if (!exist) {
      return res
        .status(404)
        .json({ success: false, error: true, message: "Category not found" });
    }

    await deleteCategoryRecursive(id);

    return res.status(200).json({
      message: "Category and its descendants deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ============ UPDATE ============
export async function updatedCategory(req, res) {
  try {
    const categoryId = req.params.id;
    const current = await CategoryModel.findById(categoryId);
    if (!current) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
        error: true,
      });
    }

    // Ảnh mới nếu FE vừa upload qua /uploadImages (đã nằm trong imagesArr)
    let newImages = req.body.images;
    if (typeof newImages === "string") {
      try {
        newImages = JSON.parse(newImages);
      } catch {
        newImages = undefined;
      }
    }

    // Nếu upload mới (imagesArr > 0) → xoá ảnh cũ trên Cloudinary, dùng ảnh mới
    if (imagesArr.length > 0) {
      if (Array.isArray(current.images)) {
        for (const img of current.images) {
          if (img?.public_id) {
            try {
              await cloudinary.uploader.destroy(img.public_id);
            } catch {}
          }
        }
      }
      newImages = imagesArr; // ảnh mới
    }

    // Nếu sub/third không dùng ảnh và FE không gửi images → giữ nguyên images cũ
    if (newImages === undefined) newImages = current.images;

    const payload = {
      name: (req.body.name || current.name).trim(),
      images: Array.isArray(newImages) ? newImages : current.images,
      parentId:
        typeof req.body.parentId === "undefined"
          ? current.parentId
          : req.body.parentId || null,
      parentCatName:
        typeof req.body.parentCatName === "undefined"
          ? current.parentCatName
          : req.body.parentCatName || null,
    };

    const updated = await CategoryModel.findByIdAndUpdate(categoryId, payload, {
      new: true,
    });

    imagesArr = []; // reset cache upload

    return res.status(200).json({
      success: true,
      error: false,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ============ COUNTS ============
export async function getCategoriesCount(req, res) {
  try {
    const count = await CategoryModel.countDocuments({ parentId: null });
    return res
      .status(200)
      .json({ success: true, error: false, categoryCount: count });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

export async function getSubCategoriesCount(req, res) {
  try {
    const subCount = await CategoryModel.countDocuments({
      parentId: { $ne: null },
    });
    return res
      .status(200)
      .json({ success: true, error: false, subCategoryCount: subCount });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
