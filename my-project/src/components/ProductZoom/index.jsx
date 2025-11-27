import React, { useRef, useState } from "react";
import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";

export const ProductZoom = ({ images = [] }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderSml.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };

  return (
    <>
      <br />
      <div className="flex gap-3">
        <div className="slider w-[15%]">
          <Swiper
            ref={zoomSliderSml}
            direction={"vertical"}
            slidesPerView={4}
            spaceBetween={0}
            modules={[Navigation]}
            navigation={true}
            className="zoomProductSliderThumbs h-[500px] overflow-hidden "
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div
                  className={`item rounded-md overflow-hidden cursor-pointer group  
                    ${slideIndex === i ? "opacity-1" : "opacity-30"}`}
                  onClick={() => goto(i)}
                >
                  <img
                    src={img.url}
                    className="w-full transition-all group-hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="zoomContainer w-[85%] h-[500px] overflow-hidden rounded-md">
          <Swiper
            ref={zoomSliderBig}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <InnerImageZoom zoomType="hover" zoomScale={1} src={img.url} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};
