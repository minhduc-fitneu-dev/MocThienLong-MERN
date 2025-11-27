import React, { useState, useContext } from "react";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { QtyBox } from "../../components/QtyBox";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MyContext } from "../../App";

export const ProductDetailsComponent = ({ data }) => {
  if (!data) return null;

  const [productActionIndex, setProductActionIndex] = useState(null);
  const [qty, setQty] = useState(1);

  const context = useContext(MyContext);
  const { addToCart } = context;

  return (
    <>
      <h1 className="text-[24px] font-[600] mb-2">{data.name}</h1>

      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-[13px]">
          Chất liệu:{" "}
          <span className="font-[500] text-black opacity-75">
            {data.material}
          </span>
        </span>

        <Rating
          name="size-small"
          value={data.rating || 0}
          size="small"
          readOnly
        />

        <span className="text-[13px] cursor-pointer ">
          Review({data.numReviews || 0})
        </span>
      </div>

      <div className="flex items-center gap-4 mt-4">
        {data.oldPrice > 0 && (
          <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
            {data.oldPrice.toLocaleString()}đ
          </span>
        )}

        <span className="price text-[#eb8600] text-[20px] font-[600]">
          {data.price.toLocaleString()}đ
        </span>

        <span className="text-[14px]">
          Có sẵn trong kho:{" "}
          <span className="text-green-600 font-bold">{data.countInStock}</span>
        </span>
      </div>

      <p className="mt-2 pr-10 mb-5">{data.description}</p>

      <div className="flex items-center gap-3">
        <span className="text-[16px]">Kích thước: </span>
        <div className="flex items-center gap-1 actions">
          {data.size?.split(",").map((s, i) => (
            <Button
              key={i}
              className={`${
                productActionIndex === i ? "!bg-[#eb8600] !text-white" : " "
              }`}
              onClick={() => setProductActionIndex(i)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-[14px] mt-5 mb-2 text-[#000]">
        Miễn phí vận chuyển (Nhận hàng trong 2-3 ngày)
      </p>

      <div className="flex items-center gap-4 py-4">
        <div className="qtyBoxWrapper w-[70px]">
          <QtyBox value={1} onChange={(v) => setQty(v)} />
        </div>

        <Button
          className="btn-org flex gap-2"
          onClick={() => addToCart(data, qty)}
        >
          <MdOutlineShoppingCart className="text-[22px]" />
          Thêm vào giỏ
        </Button>
      </div>

      {/* ⭐ NÚT YÊU THÍCH hoạt động thật */}
      <div
        className="flex items-center gap-2 text-[14px] cursor-pointer"
        onClick={() =>
          context.isLogin
            ? context.toggleMyList(data._id)
            : context.openAlertBox(
                "error",
                "Bạn cần đăng nhập để lưu sản phẩm."
              )
        }
      >
        <FaRegHeart className="text-[18px]" />
        Thêm vào yêu thích
      </div>
    </>
  );
};
