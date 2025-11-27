import Rating from "@mui/material/Rating";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../App";
import { editData, deleteData } from "../../utils/api";

const CartItems = ({ item }) => {
  const { refreshCart, openAlertBox } = useContext(MyContext);

  const product = item.productId || {};
  const price = product.price || 0;
  const discount = product.discount || 0;
  const finalPrice = price - (price * discount) / 100;

  const [qty, setQty] = useState(item.quantity);

  // =========================
  //  UPDATE QTY (+ / -)
  // =========================
  const updateQty = async (newQty) => {
    if (newQty < 1) return;

    setQty(newQty);

    try {
      const res = await editData("/api/cart/update-qty", {
        _id: item._id,
        qty: newQty,
      });

      if (res.success) {
        refreshCart();
      } else {
        openAlertBox("error", res.message || "Không thể cập nhật số lượng");
      }
    } catch {
      openAlertBox("error", "Không thể cập nhật số lượng");
    }
  };

  // =========================
  //  DELETE ITEM
  // =========================
  const deleteItem = async () => {
    try {
      const res = await deleteData("/api/cart/delete-cart-item", {
        _id: item._id,
      });

      if (res.success) {
        openAlertBox("success", "Đã xoá sản phẩm");
        refreshCart();
      } else {
        openAlertBox("error", res.message || "Xoá thất bại");
      }
    } catch {
      openAlertBox("error", "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="cartItem flex p-4 gap-6 border-b border-gray-200 items-start relative">
      {/* IMAGE */}
      <div className="w-[18%] rounded-md overflow-hidden shadow-sm">
        <Link to={`/product/${product._id}`} className="block group">
          <img
            src={product?.images?.[0]?.url}
            alt={product.name}
            className="w-full h-[120px] object-cover group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      {/* INFO */}
      <div className="w-[82%] relative">
        <IoCloseSharp
          className="absolute top-0 right-0 text-[24px] cursor-pointer opacity-70 hover:opacity-100 transition"
          onClick={deleteItem}
        />

        <h3 className="text-[16px] font-[600] leading-5">
          <Link to={`/product/${product._id}`} className="link">
            {product.name}
          </Link>
        </h3>

        <Rating size="small" value={product.rating || 4} readOnly />

        {/* QTY */}
        <div className="flex items-center gap-4 mt-4">
          <button
            className="w-[32px] h-[32px] flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => updateQty(qty - 1)}
          >
            –
          </button>

          <span className="min-w-[32px] text-center font-[600]">{qty}</span>

          <button
            className="w-[32px] h-[32px] flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => updateQty(qty + 1)}
          >
            +
          </button>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-4 mt-3">
          <span className="text-[16px] font-[700] text-[#eb8600]">
            {finalPrice.toLocaleString("vi-VN")} đ
          </span>

          {discount > 0 && (
            <>
              <span className="line-through text-gray-500 text-[14px]">
                {price.toLocaleString("vi-VN")} đ
              </span>
              <span className="text-[#eb8600] font-[600]">{discount}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
