import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true, // HTML từ ReactQuill
    },

    thumbnail: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    author: {
      type: String,
      default: "Mộc Thiên Long",
    },
  },
  {
    timestamps: true,
  }
);

const BlogModel = mongoose.model("Blog", blogSchema);
export default BlogModel;
