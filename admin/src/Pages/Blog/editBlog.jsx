import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { editData } from "../../utils/api";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditBlog = () => {
  const context = useContext(MyContext);
  const blog = context.viewBlogData;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");

  const [thumbnail, setThumbnail] = useState(null); // ảnh hiện có
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setSlug(blog.slug);
      setShortDesc(blog.shortDescription);
      setContent(blog.content);
      setThumbnail(blog.thumbnail);
    }
  }, [blog]);

  // Generate slug
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  // Upload thumbnail mới
  const uploadNewThumbnail = async () => {
    if (!newThumbnailFile) return thumbnail;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("images", newThumbnailFile);

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
        context.alertBox("success", "Thumbnail updated!");
        return res.data.images[0];
      } else {
        context.alertBox("error", "Thumbnail upload failed");
        return thumbnail;
      }
    } catch (err) {
      console.error("Upload error:", err);
      return thumbnail;
    } finally {
      setIsUploading(false);
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return context.alertBox("error", "Enter title");
    if (!shortDesc.trim())
      return context.alertBox("error", "Enter short description");
    if (!content.trim())
      return context.alertBox("error", "Content cannot be empty");

    const finalThumbnail = await uploadNewThumbnail();

    const payload = {
      title,
      slug,
      shortDescription: shortDesc,
      content,
      thumbnail: finalThumbnail,
    };

    const res = await editData(`/api/blog/${blog._id}`, payload);

    if (res?.success) {
      context.alertBox("success", "Blog updated successfully!");
      context.reloadProducts();
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", res?.message || "Update failed");
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

          {/* SHORT DESC */}
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
            <h3 className="text-sm font-[600] mb-1 text-gray-800">Content</h3>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="bg-white"
              style={{ height: "300px", marginBottom: "60px" }}
            />
          </div>

          {/* CURRENT THUMBNAIL */}
          <div className="mb-3">
            <h3 className="text-sm font-[600] mb-1 text-gray-800">
              Current Thumbnail
            </h3>
            {thumbnail?.url && (
              <div className="w-[200px] h-[150px] mb-3">
                <img
                  src={thumbnail.url}
                  className="w-full h-full object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* NEW THUMBNAIL UPLOAD */}
          <div className="mb-4">
            <h3 className="text-sm font-[600] mb-2 text-gray-800">
              Change Thumbnail (optional)
            </h3>

            {newThumbnailPreview && (
              <div className="relative w-[200px] h-[150px] mb-3">
                <img
                  src={newThumbnailPreview}
                  className="w-full h-full object-cover rounded-md border"
                />

                <button
                  type="button"
                  onClick={() => {
                    setNewThumbnailPreview(null);
                    setNewThumbnailFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <IoMdClose />
                </button>
              </div>
            )}

            <label className="uploadBox rounded-md overflow-hidden border border-dashed border-gray-400 h-[150px] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col">
              <FaCloudUploadAlt className="text-gray-500 text-[28px]" />
              <p className="text-[12px] mt-2 text-gray-600">
                Upload New Thumbnail
              </p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewThumbnailFile(file);
                  setNewThumbnailPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="btn-blue btn-lg w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 mt-4"
          disabled={isUploading}
        >
          {isUploading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </section>
  );
};

export default EditBlog;
