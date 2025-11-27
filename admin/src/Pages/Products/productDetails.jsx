import React, { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Rating from "@mui/material/Rating";

const ProductDetails = ({ product, onClose }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const goto = (i) => {
    setSlideIndex(i);
    zoomSliderSml.current.swiper.slideTo(i);
    zoomSliderBig.current.swiper.slideTo(i);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[92%] h-[92vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col animate-scaleIn">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-[22px] font-[600]">Product Details</h2>
          <button onClick={onClose} className="text-[26px] hover:text-red-600">
            <IoMdClose />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 gap-8 px-6 py-5 overflow-y-auto custom-scrollbar">
          {/* LEFT: IMAGE GALLERY */}
          <div className="flex gap-4 w-[50%]">
            {/* Thumbnails */}
            <div className="w-[16%]">
              <Swiper
                ref={zoomSliderSml}
                direction="vertical"
                slidesPerView={4}
                spaceBetween={12}
                modules={[Navigation]}
                navigation
                className="h-[500px]"
              >
                {product.images?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div
                      onClick={() => goto(i)}
                      className={`rounded-md cursor-pointer overflow-hidden border ${
                        slideIndex === i
                          ? "border-black"
                          : "border-transparent opacity-60"
                      }`}
                    >
                      <img
                        src={
                          img?.url ||
                          "https://via.placeholder.com/500?text=No+Image"
                        }
                        className="w-full h-[95px] object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Main Image */}
            <div className="w-[84%] rounded-lg overflow-hidden h-[500px]">
              <Swiper ref={zoomSliderBig}>
                {product.images?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <InnerImageZoom
                      src={
                        img?.url ||
                        "https://via.placeholder.com/600?text=No+Image"
                      }
                      zoomScale={1.3}
                      zoomType="hover"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="w-[50%] pr-4">
            <h1 className="text-[28px] font-[600] leading-snug mb-3">
              {product.name}
            </h1>

            {/* BRAND */}
            <p className="text-gray-600 mb-1">
              <strong>Brand:</strong> {product.brand || "Mộc Thiên Long"}
            </p>

            {/* CATEGORY PATH */}
            <p className="text-gray-600 mb-3 text-sm">
              <strong>Category:</strong> {product.catName} → {product.subCat} →{" "}
              {product.thirdSubCat}
            </p>

            {/* PRICE */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-red-600 text-[26px] font-[700]">
                {Number(product.price || 0).toLocaleString()}₫
              </span>
              {product.oldPrice > 0 && (
                <span className="line-through text-gray-500 text-[16px]">
                  {Number(product.oldPrice || 0).toLocaleString()}₫
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-[600]">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* RATING */}
            <div className="flex items-center gap-2 mb-3">
              <Rating
                name="product-rating"
                value={Number(product.rating || 0)}
                precision={0.5}
                readOnly // Nếu muốn admin tự chỉnh → bỏ readOnly và thêm controller updateProduct
              />
              <span className="text-gray-500 text-sm">(Chưa có đánh giá)</span>
            </div>

            {/* STOCK */}
            <p className="text-gray-700 mb-4">
              <strong>In Stock:</strong> {product.countInStock}
            </p>
            <p>
              <strong>Sold:</strong>{" "}
              <span className="text-blue-600 font-[600]">
                {product.sales || 0}
              </span>
            </p>

            {/* SPECS */}
            <div className="p-4 bg-gray-50 rounded-md space-y-1 text-[14px]">
              <p>
                <strong>Material:</strong> {product.material || "—"}
              </p>
              <p>
                <strong>Color:</strong> {product.color || "—"}
              </p>
              <p>
                <strong>Size:</strong> {product.size || "—"}
              </p>
              <p>
                <strong>Weight:</strong> {product.productWeight || "—"}
              </p>
            </div>

            {/* DESCRIPTION */}
            <h3 className="mt-5 mb-1 font-[600] text-[18px]">
              Product Description
            </h3>
            <p className="text-gray-700 text-[14px] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
