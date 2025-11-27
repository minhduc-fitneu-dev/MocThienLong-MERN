import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const OrderSuccess = () => {
  return (
    <div className="w-full py-16 flex justify-center bg-[#fafafa] animate-fadeIn">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-[620px] w-[95%] text-center border border-gray-100 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-0 w-full h-[140px] bg-gradient-to-b from-[#eb8600]/20 to-transparent"></div>

        {/* Icon */}
        <img
          src="/order-success.png"
          alt="success"
          className="w-[120px] h-[120px] mx-auto mb-6 drop-shadow-lg animate-pop"
        />

        <h2 className="text-[28px] font-[700] text-[#2f7a36] mb-3 tracking-wide">
          Đặt hàng thành công!
        </h2>

        <p className="text-gray-700 text-[15.5px] leading-7 mt-3">
          Cảm ơn quý khách đã tin tưởng mua sắm tại{" "}
          <span className="font-semibold text-[#eb8600]">Mộc Thiên Long</span>.
          <br />
          Nhân viên sẽ liên hệ trong vòng{" "}
          <span className="font-semibold text-[#eb8600]">24 giờ</span> để xác
          nhận đơn hàng.
          <br />
          Thời gian giao hàng dự kiến:{" "}
          <span className="font-semibold text-blue-600">3 – 6 ngày</span>.
          <br />
          Nếu cần thay đổi thông tin, vui lòng gọi:
          <br />
          <span className="font-semibold text-[16px]">0972 892 105</span>.
          <br />
          Mộc Thiên Long xin chân thành cảm ơn và kính chúc quý khách thật nhiều
          thành công!
        </p>

        {/* Line Divider */}
        <div className="w-full h-[1px] bg-gray-200 my-6"></div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/my-orders">
            <Button className="!bg-[#eb8600] !text-white !px-6 !py-3 !rounded-lg !font-[600] hover:!bg-[#d97600] !shadow-md hover:!shadow-lg transition-all">
              Xem đơn hàng của tôi
            </Button>
          </Link>

          <Link to="/">
            <Button className="!bg-gray-100 !text-gray-700 !px-6 !py-3 !rounded-lg !font-[600] hover:!bg-gray-200 !shadow-sm hover:!shadow-md transition-all">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop { animation: pop .5s ease-out; }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn .6s ease-in-out; }
        `}
      </style>
    </div>
  );
};

export default OrderSuccess;
