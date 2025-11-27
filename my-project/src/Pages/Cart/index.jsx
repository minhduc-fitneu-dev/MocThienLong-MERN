import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MyContext } from "../../App";
import CartItems from "./cartItems";

const CartPage = () => {
  const { cartItems, cartTotal, isLogin } = useContext(MyContext);

  // ❌ Chưa đăng nhập
  if (!isLogin) {
    return (
      <section className="section py-16">
        <div className="container w-[70%] text-center">
          <img
            src="/images/empty-cart.png"
            className="w-[220px] mx-auto mb-6"
          />
          <h1 className="text-[24px] font-[600] mb-2">Bạn chưa đăng nhập</h1>
          <p className="text-gray-500 mb-6">
            Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.
          </p>
          <Link to="/login">
            <Button className="btn-org btn-lg">Đăng nhập ngay</Button>
          </Link>
        </div>
      </section>
    );
  }

  // 🛒 Giỏ hàng trống
  if (!cartItems || cartItems.length === 0) {
    return (
      <section className="section py-16">
        <div className="container w-[70%] text-center">
          <img src="/public/nocart.png" className="w-[240px] mx-auto mb-6" />
          <h1 className="text-[24px] font-[600] mb-3">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-gray-500 mb-5">
            Hãy khám phá những sản phẩm đẹp nhất tại Mộc Thiên Long nhé.
          </p>
          <Link to="/">
            <Button className="btn-org btn-lg">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section py-14">
      <div className="container max-w-[85%] flex gap-8">
        {/* LEFT */}
        <div className="leftpart w-[70%]">
          <div className="shadow-md rounded-md bg-white overflow-hidden">
            <div className="py-4 px-5 border-b border-[rgba(0,0,0,0.1)] bg-[#fafafa]">
              <h1 className="text-[22px] font-[700] mb-1">Giỏ hàng của bạn</h1>
              <p className="text-gray-600">
                Có
                <span className="font-bold text-[#eb8600] mx-1">
                  {cartTotal.totalQty}
                </span>
                sản phẩm trong giỏ hàng
              </p>
            </div>

            {cartItems.map((item) => (
              <CartItems key={item._id} item={item} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rightPart w-[30%]">
          <div className="shadow-md rounded-md bg-white p-6 sticky top-[100px]">
            <h3 className="text-[20px] font-[600] mb-3">Tổng tiền giỏ hàng</h3>
            <hr />

            <p className="flex items-center justify-between mt-4">
              <span className="text-[15px] font-[500]">Tạm tính:</span>
              <span className="text-[#eb8600] font-bold text-[17px]">
                {cartTotal.total.toLocaleString("vi-VN")} đ
              </span>
            </p>

            <p className="flex items-center justify-between mt-2">
              <span className="text-[15px] font-[500]">Phí vận chuyển:</span>
              <span className="font-bold text-gray-500">
                Tính khi thanh toán
              </span>
            </p>

            <div className="my-5 border-t border-gray-200" />

            <p className="flex items-center justify-between">
              <span className="text-[16px] font-[600]">Tổng cộng:</span>
              <span className="text-[19px] font-[700] text-[#eb8600]">
                {cartTotal.total.toLocaleString("vi-VN")} đ
              </span>
            </p>

            <Link to="/checkout">
              <Button className="btn-org w-full flex gap-2 mt-6 py-3 text-[16px]">
                <BsFillBagCheckFill className="text-[20px]" /> Thanh toán ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
