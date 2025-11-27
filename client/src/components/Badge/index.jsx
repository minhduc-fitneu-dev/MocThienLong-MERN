import React from "react";

const Badge = ({ status }) => {
  const map = {
    pending: "Đang xử lý",
    paid: "Đã thanh toán",
    failed: "Thanh toán lỗi",
    processing: "Đang chuẩn bị",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };

  const color = {
    pending: "bg-orange-500",
    paid: "bg-green-600",
    failed: "bg-red-500",
    processing: "bg-blue-500",
    shipping: "bg-blue-400",
    delivered: "bg-green-700",
    cancelled: "bg-red-500",
  };

  return (
    <span
      className={`inline-block px-3 py-[4px] rounded-full text-white text-[12px] font-medium whitespace-nowrap ${color[status]}`}
    >
      {map[status] || status}
    </span>
  );
};

export default Badge;
