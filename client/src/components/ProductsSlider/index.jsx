import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import ProductItem from "../ProductItem";

const ProductsSlider = ({ items = 4, data = [] }) => {
  return (
    <div className="productsSlider py-3">
      <Swiper
        slidesPerView={items}
        spaceBetween={20}
        modules={[Navigation]}
        navigation={true}
        className="mySwiper"
      >
        {/* ❌ Nếu không có sản phẩm → hiển thị placeholder */}
        {data.length === 0 && (
          <SwiperSlide>
            <div className="p-4 text-center text-gray-500">
              Không có sản phẩm
            </div>
          </SwiperSlide>
        )}

        {/* ✔ Map sản phẩm */}
        {data.map((item) => (
          <SwiperSlide key={item._id}>
            <ProductItem data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
