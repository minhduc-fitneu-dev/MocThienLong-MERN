import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { deleteData } from "../../utils/api";

const CartPanel = () => {
  const { isLogin, cartItems, cartTotal, refreshCart, openAlertBox } =
    useContext(MyContext);

  // ✅ 1. CHƯA ĐĂNG NHẬP
  if (!isLogin) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-6 px-4">
        <img
          src="/public/nocart.png"
          alt="Giỏ hàng trống"
          className="w-[180px] mb-4 opacity-90"
        />
        <p className="text-[15px] font-[500] mb-2 text-center">
          Bạn cần đăng nhập để xem và thêm sản phẩm vào giỏ hàng.
        </p>
        <Link to="/login" className="mt-2">
          <Button className="btn-org btn-lg">Đăng nhập ngay</Button>
        </Link>
      </div>
    );
  }

  // ✅ 2. ĐÃ LOGIN NHƯNG GIỎ HÀNG TRỐNG
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-6 px-4">
        <img
          src="/public/nocart.png"
          alt="Giỏ hàng trống"
          className="w-[180px] mb-4 opacity-90"
        />
        <p className="text-[15px] font-[500] mb-1 text-center">
          Giỏ hàng của bạn đang trống.
        </p>
        <p className="text-[13px] text-gray-500 mb-3 text-center">
          Hãy khám phá các sản phẩm Mộc Thiên Long và thêm vào giỏ nhé.
        </p>
        <Link to="/" className="mt-1">
          <Button className="btn-org btn-lg">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }
  const handleDeleteItem = async (cartItemId) => {
    try {
      const res = await deleteData("/api/cart/delete-cart-item", {
        _id: cartItemId,
      });

      if (res.success) {
        openAlertBox("success", "Đã xoá sản phẩm khỏi giỏ hàng");
        refreshCart(); // 🔥 load lại cart
      } else {
        openAlertBox("error", res.message || "Xoá thất bại!");
      }
    } catch {
      openAlertBox("error", "Có lỗi xảy ra!");
    }
  };

  // ✅ 3. CÓ SẢN PHẨM TRONG GIỎ
  return (
    <div className="p-4 w-full h-full flex flex-col overflow-hidden">
      <div className="scroll w-full max-h-[300px] overflow-y-auto overflow-x-hidden py-0 px-2">
        {cartItems.map((item) => {
          const product = item.productId || {};
          const img =
            product?.images?.[0]?.url ||
            "https://via.placeholder.com/150x150?text=No+Image";
          const productLink = `/product/${product._id}`;
          const price = product.price || 0;
          const discount = product.discount || 0;
          const finalPrice = price - (price * discount) / 100;

          return (
            <div
              key={item._id}
              className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] py-2 "
            >
              <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                <Link to={productLink} className="block group">
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all"
                  />
                </Link>
              </div>
              <div className="info w-[75%] pr-5 relative">
                <h4 className="text-[16px] font-[500]">
                  <Link to={productLink} className="link transition-all">
                    {product.name}
                  </Link>
                </h4>
                <p className="flex items-center gap-5 mt-1 mb-2 text-[14px]">
                  <span>
                    Số lượng: <span>{item.quantity}</span>
                  </span>
                  <span className="text-[#eb8600]">
                    Giá: {finalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </p>

                <MdDeleteOutline
                  className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all "
                  onClick={() => handleDeleteItem(item._id)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <br />

      <div className="bottomSec absolute bottom-[10px] left-[10px] w-full overflow-hidden pr-5">
        <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">
              {cartTotal.totalQty || 0} sản phẩm
            </span>
            <span className="text-[#eb8600] font-[600]">
              {cartTotal.total.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Phí vận chuyển</span>
            <span className="text-[13px] text-gray-500 font-[500]">
              Tính ở bước thanh toán
            </span>
          </div>
        </div>

        <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Tạm tính</span>
            <span className="text-[#eb8600] font-[600]">
              {cartTotal.total.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex items-center justify-between w-full gap-5 py-5">
            <Link to="/cart" className="w-[50%] d-block">
              <Button className="btn-org btn-lg w-full">Xem giỏ hàng</Button>
            </Link>
            <Link to="/checkout" className="w-[50%] d-block">
              <Button className="btn-org btn-lg w-full">Thanh toán</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
