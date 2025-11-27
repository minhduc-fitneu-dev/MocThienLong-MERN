import React, { useEffect, useState } from "react";

import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/HomeCatSlider";
import ProductsSlider from "../../components/ProductsSlider";
import HomeSliderV2 from "../../components/HomSliderV2";
import BannerBoxV2 from "../../components/BannerBoxV2";
import BlogItem from "../../components/BlogItem";

import { fetchDataFromApi } from "../../utils/api";
import { TbTruckDelivery } from "react-icons/tb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const Home = () => {
  /* =============================
        STATE
  ============================= */
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);

  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [sliderBanners, setSliderBanners] = useState([]);
  const [sideBanners, setSideBanners] = useState([]);

  /* =============================
        LOAD CATEGORY (ROOT)
  ============================= */
  useEffect(() => {
    const loadCats = async () => {
      const res = await fetchDataFromApi("/api/category");

      if (res?.success && Array.isArray(res.data)) {
        setCategories(res.data);
        setActiveCat(res.data[0]?._id || null);
      }
    };
    loadCats();
  }, []);

  /* =============================
        LOAD PRODUCTS BY CATEGORY
  ============================= */
  useEffect(() => {
    if (!activeCat) return;
    loadProducts(activeCat);
  }, [activeCat]);

  const loadProducts = async (catId) => {
    const res = await fetchDataFromApi(
      `/api/product/getAllProductsByCatId/${catId}`
    );
    setProducts(res?.success ? res.products : []);
  };

  /* =============================
        LOAD ALL OTHER DATA
        (latest products, featured, banners)
        → tối ưu bằng Promise.all()
  ============================= */
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [latest, featured, slider, side] = await Promise.all([
          fetchDataFromApi("/api/product/getLatestProducts?limit=10"),
          fetchDataFromApi("/api/product/getAllFeaturedProducts"),
          fetchDataFromApi("/api/ads-banner/active?position=slider"),
          fetchDataFromApi("/api/ads-banner/active?position=side"),
        ]);

        if (latest?.success) setLatestProducts(latest.products);
        if (featured?.success) setFeaturedProducts(featured.products);
        if (slider?.success) setSliderBanners(slider.data);
        if (side?.success) setSideBanners(side.data);
      } catch (error) {
        console.log("Error loading homepage data:", error);
      }
    };

    loadAll();
  }, []);

  /* =============================
        UI RENDER
  ============================= */
  return (
    <>
      {/* Hero Banner */}
      <HomeSlider />
      <HomeCatSlider />

      {/* ============================================
                SẢN PHẨM PHỔ BIẾN
      ============================================ */}
      <Section
        title="Sản phẩm phổ biến"
        subtitle="Ưu đãi hấp dẫn – chỉ áp dụng đến cuối tháng 3!"
      >
        <CategoryTabs
          categories={categories}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
        />

        <ProductsSlider items={4} data={products} />
      </Section>

      {/* ============================================
                SLIDER + BANNER NHỎ
      ============================================ */}
      <section className="py-5">
        <div className="container flex gap-4">
          {/* LEFT SLIDER */}
          <div className="w-[80%]">
            <HomeSliderV2 banners={sliderBanners} />
          </div>

          {/* RIGHT SMALL BANNERS */}
          <div className="w-[20%] flex flex-col gap-5">
            {sideBanners.map((b, i) => (
              <BannerBoxV2
                key={i}
                image={b.image?.url}
                title={b.title}
                price={b.price}
                categoryId={b.categoryId}
                info={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
                SẢN PHẨM MỚI NHẤT
      ============================================ */}
      <Section
        title="Sản phẩm mới nhất"
        subtitle="Tuyển chọn những sản phẩm gỗ tinh mỹ nhất – mang vẻ đẹp tự nhiên vào không gian sống."
      >
        <ProductsSlider items={5} data={latestProducts} />
      </Section>

      {/* ============================================
                FREESHIP BANNER
      ============================================ */}
      <FreeShippingBox />

      {/* ============================================
                SẢN PHẨM NỔI BẬT
      ============================================ */}
      <Section
        title="Sản phẩm nổi bật"
        subtitle="Bộ sưu tập tinh tuyển – thiết kế thủ công sắc sảo được yêu thích nhất."
      >
        <ProductsSlider items={5} data={featuredProducts} />
      </Section>

      {/* ============================================
                BLOG
      ============================================ */}
      <BlogSection />
    </>
  );
};

export default Home;

/* ========================================================
            REUSABLE COMPONENTS
======================================================== */

// Title section
const Section = ({ title, subtitle, children }) => (
  <section className="bg-white py-8">
    <div className="container">
      <div className="mb-5">
        <h2 className="text-[22px] font-[700] text-gray-800">{title}</h2>
        <p className="text-[14px] text-gray-600 mt-1">{subtitle}</p>
        <div className="w-14 h-[3px] bg-[#eb8600] rounded-full mt-2"></div>
      </div>

      {children}
    </div>
  </section>
);

// Tabs category
const CategoryTabs = ({ categories, activeCat, setActiveCat }) => (
  <div className="w-full flex gap-3 overflow-x-auto no-scrollbar mb-5">
    {categories.map((cat) => (
      <button
        key={cat._id}
        onClick={() => setActiveCat(cat._id)}
        className={`px-4 py-2 text-[15px] font-[500] rounded-md transition-all whitespace-nowrap border
          ${
            activeCat === cat._id
              ? "text-white bg-[#eb8600] border-amber-700 shadow"
              : "text-gray-600 bg-white border-gray-300 hover:bg-gray-100"
          }
        `}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

// Freeship section
const FreeShippingBox = () => (
  <section className="py-3 bg-white">
    <div className="container">
      <div className="freeShipping w-[85%] m-auto py-5 px-6 border-2 border-amber-600 flex items-center justify-between rounded-xl bg-amber-50/30">
        <div className="col1 flex items-center gap-4">
          <TbTruckDelivery className="text-[50px] text-amber-700" />
          <div>
            <span className="text-[20px] font-[700] uppercase text-amber-800">
              Miễn phí vận chuyển
            </span>
            <p className="text-[13px] text-gray-600 mt-1">
              Giao nhanh – Đóng gói an toàn – Bảo đảm nguyên vẹn.
            </p>
          </div>
        </div>

        <div className="col2 text-right">
          <p className="mb-0 font-[500] text-gray-700">
            Áp dụng cho đơn hàng đầu tiên và đơn trên 2.000.000đ
          </p>
        </div>

        <p className="font-bold text-[22px] text-amber-700">
          – Trên 2.000.000đ
        </p>
      </div>
    </div>
  </section>
);

// Blog
const BlogSection = () => {
  const [blogs, setBlogs] = React.useState([]);

  React.useEffect(() => {
    const loadBlogs = async () => {
      const res = await fetchDataFromApi("/api/blog?limit=6");
      if (res?.success) {
        setBlogs(res.blogs);
      }
    };
    loadBlogs();
  }, []);

  return (
    <section className="py-8 bg-white">
      <div className="container">
        <div className="mb-5">
          <h2 className="text-[22px] font-[700] text-gray-800 tracking-wide">
            Bài viết mới nhất
          </h2>
          <p className="text-[14px] text-gray-600 mt-1">
            Khám phá câu chuyện đằng sau từng sản phẩm – cảm hứng và bí quyết
            trang trí.
          </p>
          <div className="w-14 h-[3px] bg-[#eb8600] rounded-full mt-2"></div>
        </div>

        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          modules={[Navigation]}
          navigation
          className="blogSlider"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <BlogItem blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
