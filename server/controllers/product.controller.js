import ProductModel from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ============ CẤU HÌNH CLOUDINARY ============
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// ============ ẢNH TOÀN CỤC ============
var imagesArr = [];

// ============ UPLOAD ẢNH ============
export async function uploadImages(request, response) {
  try {
    imagesArr = [];

    if (!request.files || request.files.length === 0) {
      return response.status(400).json({
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

    for (let i = 0; i < request.files.length; i++) {
      const result = await cloudinary.uploader.upload(
        request.files[i].path,
        options
      );

      imagesArr.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      fs.unlinkSync(`uploads/${request.files[i].filename}`);
    }

    return response.status(200).json({
      message: "Images uploaded successfully",
      error: false,
      success: true,
      images: imagesArr,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ TẠO SẢN PHẨM ============ //
export async function createProduct(request, response) {
  try {
    const cleanId = (value) => {
      if (!value || value === "" || value === "undefined" || value === "null") {
        return null;
      }
      return value;
    };

    const catId = cleanId(request.body.catId);
    const subCatId = cleanId(request.body.subCatId);
    const thirdSubCatId = cleanId(request.body.thirdSubCatId);

    const product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      images: request.body.images,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,

      catName: request.body.catName,
      catId: catId,
      subCatId: subCatId,
      subCat: request.body.subCat,
      thirdSubCat: request.body.thirdSubCat,
      thirdSubCatId: thirdSubCatId,

      category: catId, // chỉ để 1 dòng

      countInStock: request.body.countInStock,
      sales: request.body.sales || 0,
      rating: request.body.rating || 0,
      isFeatured: request.body.isFeatured || false,
      discount: request.body.discount || 0,

      size: request.body.size,
      productWeight: request.body.productWeight,
      material: request.body.material,
      color: request.body.color,
    });

    await product.save();

    return response.status(200).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS (with pagination) ============
export async function getAllProducts(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.max(1, Math.ceil(totalPosts / perPage)); // ✅ đảm bảo ít nhất = 1

    // ⚙️ Nếu không có sản phẩm nào, trả về mảng rỗng
    if (totalPosts === 0) {
      return response.status(200).json({
        error: false,
        success: true,
        data: [],
        totalPages,
        page,
        message: "No products yet",
      });
    }

    // Nếu page vượt quá giới hạn thật (sau khi có sản phẩm)
    if (page > totalPages) {
      return response.status(400).json({
        message: "Invalid page number",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      error: false,
      success: true,
      data: products,
      totalPages,
      page,
    });
  } catch (error) {
    console.error("❌ Get All Products Error:", error);
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY CATEGORY ID (with pagination) ============
// ============ GET ALL PRODUCTS BY CATEGORY ID (with pagination) ============
export async function getAllProductsByCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    // ⭐ Lấy cả catId, subCatId, thirdSubCatId
    const filter = {
      $or: [
        { catId: request.params.id },
        { subCatId: request.params.id },
        { thirdSubCatId: request.params.id },
      ],
    };

    const totalPosts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / perPage);

    const products = await ProductModel.find(filter)
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      error: false,
      success: true,
      products,
      totalPages,
      page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY CATEGORY NAME (with pagination) ============
export async function getAllProductsByCatName(request, response) {
  try {
    // --- Lấy thông tin phân trang ---
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    // --- Lấy tên category từ query ---
    const catName = request.query.catName;

    // --- Kiểm tra nếu không có tên category ---
    if (!catName) {
      return response.status(400).json({
        message: "Category name is required",
        success: false,
        error: true,
      });
    }

    // --- Đếm tổng sản phẩm theo tên category ---
    const totalPosts = await ProductModel.countDocuments({ catName: catName });
    const totalPages = Math.ceil(totalPosts / perPage);

    // --- Nếu không có sản phẩm ---
    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No products found for this category name",
        success: false,
        error: true,
      });
    }

    // --- Nếu vượt quá số trang ---
    if (page > totalPages && totalPages > 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    // --- Lấy danh sách sản phẩm theo tên category ---
    const products = await ProductModel.find({ catName: catName })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    // --- Trả về kết quả ---
    return response.status(200).json({
      error: false,
      success: true,
      message: "Products fetched successfully",
      totalPages: totalPages,
      page: page,
      products: products,
    });
  } catch (error) {
    // --- Bắt lỗi hệ thống ---
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY SUB CATEGORY ID ============
export async function getAllProductsBySubCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    if (!request.params.id) {
      return response.status(400).json({
        message: "Sub Category ID is required",
        success: false,
        error: true,
      });
    }

    const totalPosts = await ProductModel.countDocuments({
      subCatId: request.params.id,
    });
    const totalPages = Math.ceil(totalPosts / perPage);

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No products found for this sub category",
        success: false,
        error: true,
      });
    }

    if (page > totalPages && totalPages > 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      subCatId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Products fetched successfully",
      totalPages,
      page,
      products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY SUB CATEGORY NAME ============
export async function getAllProductsBySubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const subCatName = request.query.subCatName;

    if (!subCatName) {
      return response.status(400).json({
        message: "Sub Category name is required",
        success: false,
        error: true,
      });
    }

    const totalPosts = await ProductModel.countDocuments({
      subCat: subCatName,
    });
    const totalPages = Math.ceil(totalPosts / perPage);

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No products found for this sub category name",
        success: false,
        error: true,
      });
    }

    if (page > totalPages && totalPages > 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      subCat: subCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Products fetched successfully",
      totalPages,
      page,
      products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY THIRD SUB CATEGORY ID ============
export async function getAllProductsByThirdSubCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    if (!request.params.id) {
      return response.status(400).json({
        message: "Third Sub Category ID is required",
        success: false,
        error: true,
      });
    }

    const totalPosts = await ProductModel.countDocuments({
      thirdSubCatId: request.params.id,
    });
    const totalPages = Math.ceil(totalPosts / perPage);

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No products found for this third sub category",
        success: false,
        error: true,
      });
    }

    if (page > totalPages && totalPages > 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdSubCatId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Products fetched successfully",
      totalPages,
      page,
      products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY THIRD SUB CATEGORY NAME ============
export async function getAllProductsByThirdSubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const thirdSubCatName = request.query.thirdSubCatName;

    if (!thirdSubCatName) {
      return response.status(400).json({
        message: "Third Sub Category name is required",
        success: false,
        error: true,
      });
    }

    const totalPosts = await ProductModel.countDocuments({
      thirdSubCat: thirdSubCatName,
    });
    const totalPages = Math.ceil(totalPosts / perPage);

    if (totalPosts === 0) {
      return response.status(404).json({
        message: "No products found for this third sub category name",
        success: false,
        error: true,
      });
    }

    if (page > totalPages && totalPages > 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdSubCat: thirdSubCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Products fetched successfully",
      totalPages,
      page,
      products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY PRICE RANGE (with category filtering) ============
export async function getAllProductsByPrice(request, response) {
  try {
    let productList = [];

    // --- Trường hợp lọc theo category ID ---
    if (request.query.catId && request.query.catId !== "") {
      const productListArr = await ProductModel.find({
        catId: request.query.catId,
      }).populate("category");

      productList = productListArr;
    }

    // --- Trường hợp lọc theo sub category ID ---
    if (request.query.subCatId && request.query.subCatId !== "") {
      const productListArr = await ProductModel.find({
        subCatId: request.query.subCatId,
      }).populate("category");

      productList = productListArr;
    }

    // --- Trường hợp lọc theo third sub category ID ---
    if (request.query.thirdSubCatId && request.query.thirdSubCatId !== "") {
      const productListArr = await ProductModel.find({
        thirdSubCatId: request.query.thirdSubCatId,
      }).populate("category");

      productList = productListArr;
    }

    // --- Nếu không truyền bất kỳ ID nào => lấy toàn bộ ---
    if (productList.length === 0) {
      productList = await ProductModel.find().populate("category");
    }

    // --- Lọc theo khoảng giá ---
    const filteredProducts = productList.filter((product) => {
      if (
        request.query.minPrice &&
        product.price < parseInt(request.query.minPrice)
      ) {
        return false;
      }
      if (
        request.query.maxPrice &&
        product.price > parseInt(request.query.maxPrice)
      ) {
        return false;
      }
      return true;
    });

    // --- Trả kết quả ---
    return response.status(200).json({
      error: false,
      success: true,
      products: filteredProducts,
      totalPages: 0,
      page: 0,
      message: "Products filtered successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL PRODUCTS BY RATING (fixed exact match & range) ============
// ============ GET ALL PRODUCTS (FILTER + SORT + PAGINATION) ============
export async function getAllProductsByRating(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 12;

    // ⭐ SORT TYPE
    const sort = request.query.sort || "best-seller";

    let sortQuery = {};

    switch (sort) {
      case "price-asc":
        sortQuery = { price: 1 };
        break;
      case "price-desc":
        sortQuery = { price: -1 };
        break;
      case "name-asc":
        sortQuery = { name: 1 };
        break;
      case "name-desc":
        sortQuery = { name: -1 };
        break;
      case "best-seller":
        sortQuery = { sales: -1 }; // bán chạy nhất
        break;
      default:
        sortQuery = { sales: -1 };
    }

    // ⭐ BUILD FILTER
    let filter = {};

    if (request.query.catId) filter.catId = request.query.catId;
    if (request.query.subCatId) filter.subCatId = request.query.subCatId;
    if (request.query.thirdSubCatId)
      filter.thirdSubCatId = request.query.thirdSubCatId;

    // ⭐ FILTER RATING RANGE
    if (request.query.minRating && request.query.maxRating) {
      filter.rating = {
        $gte: parseFloat(request.query.minRating),
        $lt: parseFloat(request.query.maxRating),
      };
    }

    // ⭐ FILTER PRICE RANGE
    if (request.query.minPrice || request.query.maxPrice) {
      filter.price = {};
      if (request.query.minPrice)
        filter.price.$gte = parseFloat(request.query.minPrice);
      if (request.query.maxPrice)
        filter.price.$lte = parseFloat(request.query.maxPrice);
    }

    // ⭐ COUNT
    const totalPosts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / perPage) || 1;

    // ⭐ QUERY
    const products = await ProductModel.find(filter)
      .populate("category")
      .sort(sortQuery)
      .skip((page - 1) * perPage)
      .limit(perPage);

    return response.status(200).json({
      error: false,
      success: true,
      totalPages,
      page,
      sort,
      products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET TOTAL NUMBER OF PRODUCTS ============
export async function getProductsCount(request, response) {
  try {
    // --- Đếm tổng số sản phẩm trong collection ---
    const productsCount = await ProductModel.countDocuments();

    // --- Kiểm tra nếu không có sản phẩm ---
    if (productsCount === undefined || productsCount === null) {
      return response.status(500).json({
        error: true,
        success: false,
        message: "Failed to count products",
      });
    }

    // --- Trả kết quả ---
    return response.status(200).json({
      error: false,
      success: true,
      productCount: productsCount,
    });
  } catch (error) {
    // --- Bắt lỗi hệ thống ---
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET ALL FEATURED PRODUCTS ============
export async function getAllFeaturedProducts(request, response) {
  try {
    // --- Lấy danh sách sản phẩm nổi bật ---
    const products = await ProductModel.find({ isFeatured: true }).populate(
      "category"
    );

    // --- Kiểm tra nếu không có sản phẩm ---
    if (!products || products.length === 0) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "No featured products found",
      });
    }

    // --- Trả kết quả ---
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalFeatured: products.length,
    });
  } catch (error) {
    // --- Bắt lỗi hệ thống ---
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ DELETE PRODUCT ============
export async function deleteProduct(request, response) {
  try {
    // --- Tìm sản phẩm ---
    const product = await ProductModel.findById(request.params.id);

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // --- Xóa ảnh khỏi Cloudinary ---
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.error("❌ Cloudinary delete failed:", err);
          }
        }
      }
    }

    // --- Xóa sản phẩm khỏi MongoDB ---
    await ProductModel.findByIdAndDelete(request.params.id);

    return response.status(200).json({
      success: true,
      message: "✅ Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ DELETE MULTIPLE PRODUCT ============
export async function deleteMultipleProduct(request, response) {
  const { ids } = request.body;

  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "Invalid input",
    });
  }

  try {
    for (const id of ids) {
      const product = await ProductModel.findById(id);

      if (product?.images?.length > 0) {
        for (const img of product.images) {
          if (img.public_id) {
            try {
              await cloudinary.uploader.destroy(img.public_id);
            } catch (err) {
              console.error("❌ Cloudinary delete failed:", err);
            }
          }
        }
      }

      await ProductModel.findByIdAndDelete(id);
    }

    return response.status(200).json({
      error: false,
      success: true,
      message: "Products deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// ============ GET PRODUCT BY ID ============
export async function getProduct(request, response) {
  try {
    // --- Tìm sản phẩm theo ID ---
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );

    // --- Nếu không tìm thấy sản phẩm ---
    if (!product) {
      return response.status(404).json({
        message: "The product is not found",
        error: true,
        success: false,
      });
    }

    // --- Trả kết quả thành công ---
    return response.status(200).json({
      message: "Product fetched successfully",
      error: false,
      success: true,
      product: product,
    });
  } catch (error) {
    // --- Bắt lỗi hệ thống ---
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ============ DELETE IMAGE FROM CLOUDINARY ============
// ============ DELETE IMAGE FROM CLOUDINARY ============ //
export async function removeImageFromCloudinary(req, res) {
  try {
    const { public_id } = req.query;

    // ✅ Kiểm tra thiếu public_id
    if (!public_id || public_id.trim() === "") {
      return res.status(400).json({
        message: "public_id is required",
        success: false,
        error: true,
      });
    }

    // ✅ Xóa ảnh trên Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    // ✅ Kiểm tra Cloudinary phản hồi
    if (!result || result.result !== "ok") {
      return res.status(500).json({
        message: "Cloudinary failed to delete image",
        success: false,
        error: true,
        cloudinaryResponse: result,
      });
    }

    return res.status(200).json({
      message: "✅ Image deleted successfully",
      success: true,
      error: false,
      public_id,
    });
  } catch (err) {
    console.error("❌ Cloudinary Delete Error:", err.message);
    return res.status(500).json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

// ============ UPDATE PRODUCT ============ //
export async function updateProduct(request, response) {
  try {
    const cleanId = (value) => {
      if (!value || value === "" || value === "undefined" || value === "null") {
        return null;
      }
      return value;
    };

    const catId = cleanId(request.body.catId);
    const subCatId = cleanId(request.body.subCatId);
    const thirdSubCatId = cleanId(request.body.thirdSubCatId);

    const product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        description: request.body.description,
        images: request.body.images,
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,

        catId: catId,
        catName: request.body.catName,
        subCatId: subCatId,
        subCat: request.body.subCat,
        thirdSubCat: request.body.thirdSubCat,
        thirdSubCatId: thirdSubCatId,

        category: catId, // ✔ chuẩn nhất

        countInStock: request.body.countInStock,
        sales: request.body.sales,
        rating: request.body.rating,
        isFeatured: request.body.isFeatured,
        discount: request.body.discount,

        size: request.body.size,
        productWeight: request.body.productWeight,
        material: request.body.material,
        color: request.body.color,
      },
      { new: true }
    );

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    return response.status(200).json({
      message: "Product updated successfully",
      success: true,
      product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}
// ============ GET LATEST PRODUCTS (theo ngày tạo) ============ //
export async function getLatestProducts(request, response) {
  try {
    const limit = parseInt(request.query.limit) || 10;

    const products = await ProductModel.find()
      .sort({ dateCreated: -1 }) // sắp xếp mới → cũ
      .limit(limit);

    return response.status(200).json({
      success: true,
      error: false,
      products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

// ============ GET MIN / MAX PRICE ============
export async function getMinMaxPrice(req, res) {
  try {
    const prices = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    if (!prices || prices.length === 0) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "No products found",
      });
    }

    const { minPrice, maxPrice } = prices[0];

    return res.status(200).json({
      error: false,
      success: true,
      minPrice,
      maxPrice,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      success: false,
      message: err.message || err,
    });
  }
}

// ============ SEARCH PRODUCTS (keyword + pagination + regex) ============ //
// ============ SEARCH PRODUCTS (keyword + sort + pagination) ============ //
export async function searchProducts(req, res) {
  try {
    const keyword = (req.query.keyword || "").trim();
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 12;
    const sortType = req.query.sort || "best-seller";

    if (!keyword) {
      return res.status(200).json({
        success: true,
        error: false,
        products: [],
        totalPages: 1,
        page: 1,
      });
    }

    // ⭐ BUILD SORT
    let sortQuery = {};
    switch (sortType) {
      case "price-asc":
        sortQuery = { price: 1 };
        break;
      case "price-desc":
        sortQuery = { price: -1 };
        break;
      case "name-asc":
        sortQuery = { name: 1 };
        break;
      case "name-desc":
        sortQuery = { name: -1 };
        break;
      case "best-seller":
      default:
        sortQuery = { sales: -1 }; // bán chạy nhất
    }

    // ⭐ SEARCH FILTER
    const regex = new RegExp(keyword, "i");

    const filter = {
      $or: [
        { name: regex },
        { description: regex },
        { brand: regex },
        { catName: regex },
        { subCat: regex },
        { thirdSubCat: regex },
      ],
    };

    const total = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage) || 1;

    const products = await ProductModel.find(filter)
      .populate("category")
      .sort(sortQuery)
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      success: true,
      error: false,
      products,
      totalPages,
      page,
      sort: sortType,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

// ============ AUTOCOMPLETE PRODUCT SEARCH (limit 8) ============ //
export async function autocompleteSearch(req, res) {
  try {
    const keyword = req.query.keyword?.trim();

    if (!keyword) {
      return res.status(200).json({
        success: true,
        error: false,
        products: [],
      });
    }

    const regex = new RegExp(keyword, "i"); // tìm không phân biệt hoa thường

    const products = await ProductModel.find({
      name: { $regex: regex },
    })
      .select("name price images")
      .limit(8);

    return res.status(200).json({
      success: true,
      error: false,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
}
