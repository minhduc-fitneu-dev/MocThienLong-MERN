import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Sửa đúng dạng lưu ảnh
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    parentCatName: { type: String, default: null },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
