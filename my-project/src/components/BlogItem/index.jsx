import React from "react";
import { IoMdTime } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const BlogItem = ({ blog }) => {
  if (!blog) return null;

  return (
    <div className="blogItem group">
      <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
        <img
          src={blog.thumbnail?.url}
          alt={blog.title}
          className="w-full h-[180px] object-cover transition-all group-hover:scale-105 group-hover:rotate-1"
        />

        <span className="flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-[#eb8600] rounded-md p-1 text-[11px] font-[500] gap-1">
          <IoMdTime className="text-[14px]" />
          {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </div>

      <div className="info py-4">
        <h2 className="text-[15px] font-[600] text-black line-clamp-2">
          <Link to={`/blog/${blog.slug}`} className="link">
            {blog.title}
          </Link>
        </h2>

        <p className="text-[13px] font-[400] text-[rgba(0,0,0,0.8)] mb-4 line-clamp-2">
          {blog.shortDescription}
        </p>

        <Link
          to={`/blog/${blog.slug}`}
          className="link font-[500] text-[14px] flex items-center gap-1 text-[#eb8600]"
        >
          Đọc thêm <IoIosArrowForward />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
