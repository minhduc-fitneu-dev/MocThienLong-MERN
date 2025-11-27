import React, { useContext } from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { MdZoomOutMap } from "react-icons/md";
import { MyContext } from "../../App";

const ProductItemListView = ({ data }) => {
  const context = useContext(MyContext);

  const img1 = data?.images?.[0]?.url || "/no-image.png";
  const img2 = data?.images?.[1]?.url || img1;

  return (
    <div
      className="
      productItem listViewItem
      bg-white border border-[#e6d9c9]
      rounded-2xl shadow-sm 
      hover:shadow-lg hover:-translate-y-[2px]
      transition-all duration-300
      flex overflow-hidden
    "
    >
      {/* IMAGE */}
      <div className="group relative w-[20%] h-full overflow-hidden">
        <Link to={`/product/${data?._id}`}>
          <img
            src={img1}
            className="w-full h-full object-cover rounded-l-2xl transition-all duration-500 group-hover:scale-105"
          />
          <img
            src={img2}
            className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
          />
        </Link>

        {data.discount > 0 && (
          <span
            className="
            absolute top-3 left-3
            bg-[#c2783c] text-white
            px-2 py-[2px] 
            rounded-md text-sm font-semibold shadow-md
          "
          >
            -{data.discount}%
          </span>
        )}

        {/* ACTION BUTTONS */}
        <div
          className="
          absolute right-3 top-3
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          flex flex-col gap-2
        "
        >
          <Button
            className="action-btn"
            onClick={() => {
              context.setCurrentProduct(data);
              context.setOpenProductDetailsModal(true);
            }}
          >
            <MdZoomOutMap />
          </Button>

          <Button
            className="action-btn"
            onClick={() => {
              if (!context.isLogin) {
                return context.openAlertBox(
                  "error",
                  "Bạn cần đăng nhập để lưu sản phẩm."
                );
              }
              context.toggleMyList(data._id);
            }}
          >
            <FaRegHeart />
          </Button>
        </div>
      </div>

      {/* INFO */}
      <div className="p-6 w-[68%] flex flex-col justify-between">
        <div>
          {/* NAME */}
          <h2 className="text-[19px] font-semibold text-[#4a3628] mb-2 leading-snug">
            <Link
              to={`/product/${data?._id}`}
              className="hover:text-[#c2783c] transition-colors"
            >
              {data?.name}
            </Link>
          </h2>

          {/* DESCRIPTION */}
          <p className="text-[14px] text-[#7a6a55] mb-2 leading-relaxed">
            {data?.description?.slice(0, 250)}...
          </p>

          {/* RATING */}
          <Rating
            name="size-small"
            value={data.rating || 0}
            size="small"
            readOnly
            className="!mb-2"
          />
        </div>

        {/* PRICE + BUTTON */}
        <div className="!mt-0">
          <div className="flex items-center gap-4">
            {data.oldPrice > 0 && (
              <span className="line-through text-gray-500 text-[15px]">
                {data.oldPrice.toLocaleString()}đ
              </span>
            )}

            <span className="text-[20px] font-bold text-[#c2783c]">
              {data.price.toLocaleString()}đ
            </span>
          </div>

          <Button
            className="btn-org !mt-2 w-[180px] !h-[42px] !text-[15px]"
            onClick={() => context.addToCart(data)}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItemListView;
