import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import AOS from "aos";
import "aos/dist/aos.css";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  useEffect(() => {
    const loadBlog = async () => {
      const res = await fetchDataFromApi(`/api/blog/slug/${slug}`);
      if (res?.success) setBlog(res.blog);
    };
    loadBlog();
  }, [slug]);

  if (!blog)
    return (
      <div className="py-20 text-center text-gray-600 animate-pulse">
        Đang tải bài viết...
      </div>
    );

  return (
    <div className="bg-white pt-10 pb-20">
      <div className="container max-w-4xl">
        {/* ================== BACK BUTTON ================== */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-[15px] font-semibold 
          text-gray-700 hover:text-[#eb8600] transition mb-6"
          data-aos="fade-right"
        >
          ← Quay lại danh sách bài viết
        </Link>

        {/* ================== THUMBNAIL ================== */}
        <div
          className="w-full h-[540px] rounded-2xl overflow-hidden shadow-lg mb-8 relative"
          data-aos="zoom-in"
        >
          <img
            src={blog.thumbnail?.url}
            alt={blog.title}
            className="w-full h-full object-cover scale-105 hover:scale-110 transition-all duration-[1500ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* ================== TITLE ================== */}
        <h1
          className="text-4xl md:text-5xl font-[800] text-gray-800 mb-4 leading-tight tracking-wide"
          data-aos="fade-up"
        >
          {blog.title}
        </h1>

        {/* DATE + AUTHOR */}
        <div
          className="flex items-center gap-4 text-gray-500 text-[14px] mb-10"
          data-aos="fade-up"
        >
          <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
          <span>•</span>
          <span className="font-medium">{ "Mộc Thiên Long"}</span>
        </div>

        {/* ================== CONTENT ================== */}
        <div
          className="prose max-w-none prose-img:rounded-xl prose-img:shadow-md 
          prose-headings:text-gray-800 prose-li:marker:text-[#eb8600]
          text-gray-700 leading-relaxed"
          data-aos="fade-up"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>

        {/* ================== SHARE SECTION (OPTIONAL) ================== */}
        <div
          className="mt-12 pt-6 border-t border-gray-200 flex items-center gap-4"
          data-aos="fade-up"
        >
          <span className="font-semibold text-gray-700">Chia sẻ:</span>
          <div className="flex gap-3">
            <button className="px-3 py-1 text-white bg-[#1877F2] rounded-md text-sm shadow hover:opacity-90">
              Facebook
            </button>
            <button className="px-3 py-1 text-white bg-[#1DA1F2] rounded-md text-sm shadow hover:opacity-90">
              Twitter
            </button>
            <button className="px-3 py-1 text-white bg-[#25D366] rounded-md text-sm shadow hover:opacity-90">
              Zalo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
