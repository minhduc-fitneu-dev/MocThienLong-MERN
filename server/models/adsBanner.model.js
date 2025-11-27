import mongoose from "mongoose";

const adsBannerSchema = mongoose.Schema(
  {
    // Ảnh chính của banner quảng cáo
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    // Tiêu đề lớn (nếu có)
    title: {
      type: String,
      default: "",
    },

    // Mô tả nhỏ
    subtitle: {
      type: String,
      default: "",
    },

    // Giá hoặc thông điệp giá
    price: {
      type: String,
      default: "",
    },

    // Nội dung nút — ví dụ "Xem ngay", "Liên hệ ngay"
    buttonText: {
      type: String,
      default: "Xem ngay",
    },

    // Category để điều hướng khi click banner
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    // Vị trí hiển thị
    // slider = banner lớn trong HomeSliderV2
    // side = 2 banner nhỏ bên phải (BannerBoxV2)
    // both = hiển thị cả hai nơi
    position: {
      type: String,
      enum: ["slider", "side", "both"],
      default: "slider",
    },

    // Số thứ tự sắp xếp
    sortOrder: {
      type: Number,
      default: 0,
    },

    // Ẩn / hiện banner
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const AdsBannerModel = mongoose.model("AdsBanner", adsBannerSchema);
export default AdsBannerModel;
