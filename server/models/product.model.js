import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },

  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],

  brand: { type: String, default: "" },
  price: { type: Number, default: 0 },
  oldPrice: { type: Number, default: 0 },

  // ================================
  // CATEGORY (CHỈ POPULATE FIELD NÀY)
  // ================================
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },

  // 3 field dưới KHÔNG POPULATE — chỉ lọc thôi
  catId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  catName: { type: String, default: "" },

  subCatId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  subCat: { type: String, default: "" },

  thirdSubCatId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  thirdSubCat: { type: String, default: "" },

  // ================================
  countInStock: { type: Number, required: true },
  sales: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },

  // Wood product info
  size: { type: String, default: "" },
  productWeight: { type: String, default: "" },
  material: { type: String, default: "" },
  color: { type: String, default: "" },

  dateCreated: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", productSchema);

productSchema.index({ name: 1 });
productSchema.index({ description: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ catName: 1 });
productSchema.index({ subCat: 1 });
productSchema.index({ thirdSubCat: 1 });

export default ProductModel;
