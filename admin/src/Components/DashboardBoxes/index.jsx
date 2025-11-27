import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import {
  AiTwotoneGift,
  AiTwotonePieChart,
  AiTwotoneBank,
} from "react-icons/ai";
import { IoStatsChartSharp } from "react-icons/io5";
import { SiProducthunt } from "react-icons/si";

import { fetchDataFromApi } from "../../utils/api";

const DashboardBoxes = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // ============================
      // 1️⃣ Tổng User
      // ============================
      const userRes = await fetchDataFromApi("/api/admin/users");
      if (userRes?.success) {
        setTotalUsers(userRes.data.length);
      }

      // ============================
      // 2️⃣ Tổng đơn hàng + doanh thu
      // ============================
      const orderRes = await fetchDataFromApi("/api/admin/orders?limit=99999");

      if (orderRes?.success) {
        setTotalOrders(orderRes.total);

        const revenue = orderRes.data
          .filter((o) => o.delivery_status === "delivered")
          .reduce((sum, item) => sum + item.totalAmt, 0);

        setTotalRevenue(revenue);
      }

      // ============================
      // 3️⃣ Tổng sản phẩm
      // ============================
      const productRes = await fetchDataFromApi(
        "/api/product/getProductsCount"
      );

      if (productRes?.success) {
        setTotalProducts(productRes.productCount);
      }
    } catch (err) {
      console.error("DashboardBoxes Load Error:", err);
    }
  };

  const vnd = (n) => n?.toLocaleString("vi-VN", { maximumFractionDigits: 0 });

  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={15}
      navigation
      modules={[Navigation]}
      className="dashboardBoxesSlider"
    >
      {/* BOX 1 – Tổng đơn hàng */}
      <SwiperSlide>
        <div className="group box p-5 bg-white cursor-pointer rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <AiTwotoneGift className="text-[42px] text-[#3872fa] group-hover:scale-110 transition" />
          <div className="info flex-1">
            <h3 className="text-[15px] font-[500] text-gray-600">
              Tổng đơn hàng
            </h3>
            <b className="text-[22px] font-[700] text-gray-800">
              {vnd(totalOrders)}
            </b>
          </div>
          <IoStatsChartSharp className="text-[48px] text-[#3872fa] opacity-80 transition" />
        </div>
      </SwiperSlide>

      {/* BOX 2 – Tổng user */}
      <SwiperSlide>
        <div className="group box p-5 bg-white cursor-pointer rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <AiTwotonePieChart className="text-[48px] text-[#10b981] group-hover:scale-110 transition" />
          <div className="info flex-1">
            <h3 className="text-[15px] font-[500] text-gray-600">Tổng user</h3>
            <b className="text-[22px] font-[700] text-gray-800">
              {vnd(totalUsers)}
            </b>
          </div>
          <IoStatsChartSharp className="text-[48px] text-[#10b981] opacity-80 transition" />
        </div>
      </SwiperSlide>

      {/* BOX 3 – Tổng doanh thu */}
      <SwiperSlide>
        <div className="group box p-5 bg-white cursor-pointer rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <AiTwotoneBank className="text-[42px] text-[#7928ca] group-hover:scale-110 transition" />
          <div className="info flex-1">
            <h3 className="text-[15px] font-[500] text-gray-600">
              Tổng doanh thu
            </h3>
            <b className="text-[22px] font-[700] text-gray-800">
              {vnd(totalRevenue)}đ
            </b>
          </div>
          <IoStatsChartSharp className="text-[48px] text-[#7928ca] opacity-80 transition" />
        </div>
      </SwiperSlide>

      {/* BOX 4 – Tổng sản phẩm */}
      <SwiperSlide>
        <div className="group box p-5 bg-white cursor-pointer rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <SiProducthunt className="text-[42px] text-[#cd940e] group-hover:scale-110 transition" />
          <div className="info flex-1">
            <h3 className="text-[15px] font-[500] text-gray-600">
              Tổng sản phẩm
            </h3>
            <b className="text-[22px] font-[700] text-gray-800">
              {vnd(totalProducts)}
            </b>
          </div>
          <IoStatsChartSharp className="text-[48px] text-[#cd940e] opacity-80 transition" />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default DashboardBoxes;
