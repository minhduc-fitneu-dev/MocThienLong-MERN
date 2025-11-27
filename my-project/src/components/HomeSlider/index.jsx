import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";

const HomeSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const loadSlides = async () => {
      const res = await fetchDataFromApi("/api/homeslider");
      if (!res?.error) {
        setSlides(res.data);
      }
    };

    loadSlides();
  }, []);

  return (
    <div className="homeSlider py-4">
      <div className="container">
        <Swiper
          spaceBetween={70}
          navigation={true}
          modules={[Navigation, Autoplay, EffectFade]}
          className="sliderHome"
          // ⭐ Hiệu ứng fade mềm như Apple
          effect="fade"
          fadeEffect={{ crossFade: true }}
          // ⭐ Tốc độ chuyển 1.2s rất mượt, chuyên nghiệp
          speed={1200}
          // ⭐ Tự động chạy + không dừng khi người dùng tương tác
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          // ⭐ Loop vô cực — không khựng giữa các vòng
          loop={true}
          // ⭐ Easing mềm mượt tự nhiên
          easing="ease-in-out"
        >
          {/* Placeholder nếu chưa có ảnh */}
          {slides.length === 0 && (
            <SwiperSlide>
              <div className="item rounded-[20px] overflow-hidden">
                <img
                  src="/placeholder-slide.jpg"
                  className="w-full"
                  alt="placeholder"
                />
              </div>
            </SwiperSlide>
          )}

          {/* Danh sách slide từ backend */}
          {slides.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="item rounded-[20px] overflow-hidden shadow-lg">
                <img
                  src={item.image.url}
                  alt="banner slide"
                  className="w-full h-auto object-cover transition-all duration-[1200ms]"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
