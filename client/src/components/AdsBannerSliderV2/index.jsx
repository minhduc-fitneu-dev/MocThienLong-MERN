import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import BannerBoxV2 from "../BannerBoxV2";
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
          <BannerBoxV2
            info="left"
            image={
              "https://serviceapi.spicezgold.com/download/1757183705017_1737020250515_New_Project_47.jpg"
            }
            link={"/"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="right"
              image={
                "https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg"
              }
            link={"/"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image={
              "https://serviceapi.spicezgold.com/download/1757183705017_1737020250515_New_Project_47.jpg"
            }
            link={"/"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image={
              "https://serviceapi.spicezgold.com/download/1757183705017_1737020250515_New_Project_47.jpg"
            }
            link={"/"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="right"
            image={
              "https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg"
            }
            link={"/"}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AdsBannerSlider;
