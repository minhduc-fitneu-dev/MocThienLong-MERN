import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchDataFromApi("/api/category");
      if (!res?.error && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    };
    loadCategories();
  }, []);

  const fallbackImg = "https://cdn-icons-png.flaticon.com/512/751/751463.png";

  return (
    <div className="homeCatSlider py-5" style={{ background: "#F8F3EE" }}>
      <div className="container">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          modules={[Navigation]}
          navigation
          breakpoints={{
            0: { slidesPerView: 2 },
            620: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <Link to={`/category/${cat._id}`}>
                <div
                  className="
                  item bg-white rounded-xl
                  py-8 px-5
                  shadow-sm hover:shadow-md
                  transition-all duration-300
                  flex flex-col items-center justify-center
                  border border-[#e8e2d9]
                  hover:-translate-y-1
                "
                >
                  <div className="w-[80px] h-[80px] flex items-center justify-center mb-4">
                    <img
                      src={cat.images?.[0]?.url || fallbackImg}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h3 className="text-[16px] font-[600] text-[rgba(0,0,0,0.85)] tracking-wide">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
