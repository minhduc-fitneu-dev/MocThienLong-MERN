import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const HomeSliderV2 = ({ banners = [] }) => {
  if (banners.length === 0) return null;

  return (
    <Swiper
      loop={true}
      spaceBetween={30}
      effect={"fade"}
      navigation={true}
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      className="homeSliderV2"
    >
      {banners.map((item) => (
        <SwiperSlide key={item._id}>
          <div className="item w-full rounded-md overflow-hidden relative">
            <img src={item.image.url} className="w-full" alt={item.title} />

            {/* INFO AREA */}
            <div
              className="
                info absolute top-0 -right-[100%] w-[35%] z-50 p-8 h-full 
                flex items-center flex-col justify-center opacity-0 
                transition-all duration-700 pointer-events-none
              "
            >
              <h4 className="text-[18px] font-[500] w-full text-left mb-3 relative -right-[100%] opacity-0 pointer-events-auto">
                {item.subtitle || "Siêu ưu đãi khủng"}
              </h4>

              <h2 className="text-[35px] font-[700] w-full relative -right-[100%] opacity-0 leading-tight pointer-events-auto">
                {item.title}
              </h2>

              {item.price && (
                <h3 className="text-[18px] font-[500] w-full text-left mb-3 mt-3 flex items-center gap-3 relative -right-[100%] opacity-0 pointer-events-auto">
                  Giá chỉ từ
                  <span className="text-[#eb8600] text-[30px] font-[700]">
                    {item.price}
                  </span>
                </h3>
              )}

              <div className="w-full relative -right-[100%] opacity-0 btn_ pointer-events-auto">
                <Link to={`/category/${item.categoryId}`}>
                  <Button className="btn-org">
                    {item.buttonText || "XEM NGAY"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSliderV2;
