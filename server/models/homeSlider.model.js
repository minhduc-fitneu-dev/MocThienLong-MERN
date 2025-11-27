// models/homeSlider.model.js
import mongoose from "mongoose";

const homeSliderSchema = mongoose.Schema(
  {
    // Ảnh duy nhất cho mỗi slide (dạng object: chuẩn product/category)
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

    // Text hiển thị trên slide (optional)
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    // Link chuyển hướng khi click
    redirectUrl: {
      type: String,
      default: "",
    },

    // Bật/tắt slide
    isActive: {
      type: Boolean,
      default: true,
    },

    // Số thứ tự (để kéo sắp xếp)
    sortOrder: {
      type: Number,
      default: 0,
    },

    // Lưu ngày tạo (thừa nhưng m thích thì để)
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const HomeSliderModel = mongoose.model("HomeSlider", homeSliderSchema);
export default HomeSliderModel;
