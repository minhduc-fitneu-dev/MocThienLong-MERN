import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  autocompleteSearch,
  createProduct,
  deleteMultipleProduct,
  deleteProduct,
  getAllFeaturedProducts,
  getAllProducts,
  getAllProductsByCatId,
  getAllProductsByCatName,
  getAllProductsByPrice,
  getAllProductsByRating,
  getAllProductsBySubCatId,
  getAllProductsBySubCatName,
  getAllProductsByThirdSubCatId,
  getAllProductsByThirdSubCatName,
  getLatestProducts,
  getMinMaxPrice,
  getProduct,
  getProductsCount,
  removeImageFromCloudinary,
  searchProducts,
  updateProduct,
  uploadImages,
} from "../controllers/product.controller.js";

const productRouter = Router();

// ===================== 🔒 ADMIN ROUTES =====================

// Upload ảnh lên Cloudinary
productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);

// Tạo sản phẩm mới
productRouter.post("/create", auth, createProduct);

// Cập nhật sản phẩm
productRouter.put("/updateProduct/:id", auth, updateProduct);
// Xóa ảnh trong Cloudinary
productRouter.delete("/removeImage", auth, removeImageFromCloudinary);
// Xóa nhiều sản phẩm
productRouter.delete("/deleteMultiple", auth, deleteMultipleProduct);
// Xóa 1 sản phẩm
productRouter.delete("/:id", auth, deleteProduct);

// ===================== 🌐 PUBLIC ROUTES =====================

// Lấy tất cả sản phẩm (phân trang)
productRouter.get("/getAllProducts", getAllProducts);

// Lọc theo danh mục
productRouter.get("/getAllProductsByCatId/:id", getAllProductsByCatId);
productRouter.get("/getAllProductsByCatName", getAllProductsByCatName);

// Lọc theo sub category
productRouter.get("/getAllProductsBySubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/getAllProductsBySubCatName", getAllProductsBySubCatName);

// Lọc theo third sub category
productRouter.get(
  "/getAllProductsByThirdSubCatId/:id",
  getAllProductsByThirdSubCatId
);
productRouter.get(
  "/getAllProductsByThirdSubCatName",
  getAllProductsByThirdSubCatName
);

// Lọc theo giá & rating
productRouter.get("/getAllProductsByPrice", getAllProductsByPrice);
productRouter.get("/getAllProductsByRating", getAllProductsByRating);

// Lấy số lượng tổng
productRouter.get("/getProductsCount", getProductsCount);

// Lấy sản phẩm nổi bật
productRouter.get("/getAllFeaturedProducts", getAllFeaturedProducts);

// Lấy 1 sản phẩm theo ID
productRouter.get("/get/:id", getProduct);

// Lấy sản phẩm mới nhất
productRouter.get("/getLatestProducts", getLatestProducts);
productRouter.get("/getMinMaxPrice", getMinMaxPrice);


productRouter.get("/search", searchProducts);
productRouter.get("/autocomplete", autocompleteSearch);

export default productRouter;
