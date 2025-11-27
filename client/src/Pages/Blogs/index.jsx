import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      const res = await fetchDataFromApi("/api/blog");
      if (res?.success) setBlogs(res.blogs);
    };
    loadBlogs();
  }, []);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container">
        {/* ================== PAGE TITLE ================== */}
        <div className="text-center mb-14" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-[800] text-gray-800 tracking-wide drop-shadow-sm">
            Bài viết mới nhất
          </h1>
          <p className="text-gray-600 text-[16px] mt-3 max-w-2xl mx-auto leading-relaxed">
            Khám phá những câu chuyện, cảm hứng và bí quyết từ Mộc Thiên Long –
            nơi nghệ thuật thủ công gỗ Việt được thăng hoa.
          </p>
          <div className="w-24 h-[4px] bg-[#eb8600] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* ================== BLOG GRID ================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              data-aos="zoom-in-up"
              data-aos-delay={index * 100}
              className="
                group bg-white rounded-2xl overflow-hidden border shadow-md 
                hover:shadow-2xl transition-all duration-500 
                relative cursor-pointer
              "
            >
              {/* IMAGE WRAPPER */}
              <div className="relative h-[240px] overflow-hidden">
                <img
                  src={blog.thumbnail?.url}
                  alt={blog.title}
                  className="
                    w-full h-full object-cover 
                    transition-all duration-[900ms] 
                    group-hover:scale-110 
                    group-hover:rotate-[1deg]
                  "
                />

                {/* OVERLAY GRADIENT WHEN HOVER */}
                <div
                  className="
                    absolute inset-0 bg-gradient-to-t 
                    from-black/40 to-transparent 
                    opacity-0 group-hover:opacity-100 
                    transition-all duration-500
                  "
                ></div>

                {/* DATE BADGE */}
                <span
                  className="
                    absolute top-4 left-4 px-3 py-1 rounded-full 
                    text-white text-[12px] font-semibold 
                    bg-[#eb8600] shadow-md backdrop-blur-sm
                  "
                >
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-6 pb-7">
                <h2
                  className="
                    text-[20px] font-[700] text-gray-800 mb-3 line-clamp-2 
                    group-hover:text-[#eb8600] transition-colors duration-300
                  "
                >
                  {blog.title}
                </h2>

                <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-3">
                  {blog.shortDescription}
                </p>

                {/* READ MORE */}
                <div
                  className="
                    mt-5 text-[#eb8600] font-semibold text-[15px] 
                    flex items-center gap-1 transition-all
                    group-hover:translate-x-1
                  "
                >
                  Đọc tiếp →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ================== NO BLOG ================== */}
        {blogs.length === 0 && (
          <p className="text-center text-gray-600 mt-12 text-[16px]">
            Hiện chưa có bài viết nào được đăng.
          </p>
        )}
      </div>
    </div>
  );
}
