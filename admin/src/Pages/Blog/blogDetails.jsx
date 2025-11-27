import React from "react";
import { IoMdClose } from "react-icons/io";
import "react-inner-image-zoom/lib/styles.min.css";

const BlogDetails = ({ blog, onClose }) => {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[92%] h-[92vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col animate-scaleIn">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-[22px] font-[600]">Blog Details</h2>
          <button onClick={onClose} className="text-[26px] hover:text-red-600">
            <IoMdClose />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
          {/* TITLE */}
          <h1 className="text-[32px] font-[700] leading-snug">{blog.title}</h1>

          {/* META */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Slug:</strong> {blog.slug}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(blog.createdAt).toLocaleString("vi-VN")}
            </p>
            {blog.publishedAt && (
              <p>
                <strong>Published:</strong>{" "}
                {new Date(blog.publishedAt).toLocaleString("vi-VN")}
              </p>
            )}
          </div>

          {/* THUMBNAIL */}
          <div className="w-full flex justify-center">
            <img
              src={
                blog.thumbnail?.url ||
                "https://via.placeholder.com/800x400?text=No+Thumbnail"
              }
              alt="Blog Thumbnail"
              className="w-full max-w-[900px] rounded-lg shadow-md object-cover"
            />
          </div>

          {/* SHORT DESCRIPTION */}
          <div>
            <h3 className="text-[20px] font-[600] mb-2">Short Description</h3>
            <p className="text-gray-700 text-[16px] leading-relaxed">
              {blog.shortDescription || "—"}
            </p>
          </div>

          {/* CONTENT */}
          <div>
            <h3 className="text-[20px] font-[600] mb-3">Content</h3>

            <div
              className="prose max-w-none text-[16px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
