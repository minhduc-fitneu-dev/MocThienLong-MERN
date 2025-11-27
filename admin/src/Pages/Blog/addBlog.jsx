import React, { useContext, useState } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";

const AddBlog = () => {
  const context = useContext(MyContext);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  // Auto generate slug
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleUploadThumbnail = async () => {
    if (!thumbnailFile) return null;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("images", thumbnailFile);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blog/uploadImages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.images?.[0]) {
        context.alertBox("success", "Thumbnail uploaded!");
        return res.data.images[0];
      } else {
        context.alertBox("error", "Upload failed");
        return null;
      }
    } catch (err) {
      console.error("Upload error:", err);
      context.alertBox("error", "Server upload error");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return context.alertBox("error", "Enter title");
    if (!shortDesc.trim())
      return context.alertBox("error", "Enter short description");
    if (!content.trim())
      return context.alertBox("error", "Enter content for the blog");

    if (!thumbnailFile)
      return context.alertBox("error", "Please upload a thumbnail");

    // Upload thumbnail
    const thumbnail = await handleUploadThumbnail();
    if (!thumbnail) return;

    // Prepare payload
    const payload = {
      title,
      slug,
      shortDescription: shortDesc,
      content,
      thumbnail,
    };

    const res = await postData("/api/blog/create", payload);

    if (res?.success) {
      context.alertBox("success", "Blog created successfully!");
      context.reloadProducts();
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", res?.message || "Failed to create blog");
    }
  };

  return (
    <section className="p-5 bg-gray-50 min-h-[90vh]">
      <form
        className="form py-3 p-8 bg-white rounded-lg shadow-sm border border-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4">
          {/* TITLE */}
          <div className="mb-4">
            <h3 className="text-sm font-[600] mb-1 text-gray-800">
              Blog Title
            </h3>
            <input
              type="text"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          {/* SLUG */}
          <div className="mb-4">
            <h3 className="text-sm font-[600] mb-1 text-gray-800">Slug</h3>
            <input
              type="text"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
            />
          </div>

          {/* SHORT DESCRIPTION */}
          <div className="mb-4">
            <h3 className="text-sm font-[600] mb-1 text-gray-800">
              Short Description
            </h3>
            <textarea
              className="w-full h-[100px] border border-gray-300 rounded-sm p-3 text-sm"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
            />
          </div>

          {/* CONTENT */}
          <div className="mb-6">
            <h3 className="text-sm font-[600] mb-1 text-gray-800">
              Blog Content
            </h3>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="bg-white"
              style={{ height: "300px", marginBottom: "60px" }}
            />
          </div>

          {/* THUMBNAIL UPLOAD */}
          <div>
            <h3 className="text-sm font-[600] mb-2 text-gray-800">
              Thumbnail Image
            </h3>

            {thumbnailPreview && (
              <div className="relative w-[200px] h-[150px] mb-3">
                <img
                  src={thumbnailPreview}
                  alt="thumbnail"
                  className="w-full h-full object-cover rounded-md border"
                />

                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview(null);
                    setThumbnailFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <IoMdClose />
                </button>
              </div>
            )}

            <label className="uploadBox rounded-md overflow-hidden border border-dashed border-gray-400 h-[150px] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col">
              <FaCloudUploadAlt className="text-gray-500 text-[28px]" />
              <p className="text-[12px] mt-2 text-gray-600">Upload Thumbnail</p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setThumbnailFile(file);
                  setThumbnailPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="btn-blue btn-lg w-full flex gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 mt-4"
          disabled={isUploading}
        >
          <FaCloudUploadAlt className="text-[22px]" />
          {isUploading ? "Uploading..." : "Publish Blog"}
        </Button>
      </form>
    </section>
  );
};

export default AddBlog;
