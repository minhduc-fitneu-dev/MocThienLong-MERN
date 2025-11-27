import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import BannerBox from "../BannerBox";
const AdsBannerSlider = (props) => {
  return (
    <div className="py-5 w-full">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        modules={[Navigation]}
        navigation={true}
        className="smlBtn"
      >
        <SwiperSlide>
          <BannerBox img={"/banner1.jpg"} Link="/" />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox img={"/banner1.jpg"} Link="/" />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox img={"/banner1.jpg"} Link="/" />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox img={"/banner1.jpg"} Link="/" />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox img={"/banner1.jpg"} Link="/" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AdsBannerSlider;
