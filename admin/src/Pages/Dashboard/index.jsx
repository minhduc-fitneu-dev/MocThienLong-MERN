import React, { useState, useContext, useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import DashboardBoxes from "../../Components/DashboardBoxes";
import { FaPlus } from "react-icons/fa";
import Button from "@mui/material/Button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { MyContext } from "../../App";
import Products from "../Products";
import Orders from "../Orders";

const Dashboard = () => {
  const context = useContext(MyContext);

  const [statsData, setStatsData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const res = await fetchDataFromApi("/api/admin/stats");
      if (res?.success) {
        setStatsData(res.data);
      }
      setLoadingChart(false);
    };
    loadStats();
  }, []);

  return (
    <>
      {/* ======== HEADER WELCOME ======== */}
      <div className="w-full py-6 px-6 bg-white border border-gray-200 flex items-center justify-between rounded-xl shadow-sm mb-8">
        <div className="info">
          <h1 className="text-[32px] font-bold leading-[42px] mb-3 text-gray-800">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-600 text-[15px]">
            Dưới đây là tổng quan tình hình cửa hàng của bạn hôm nay.
          </p>

          <Button
            className="btn-blue !capitalize !mt-6 shadow-md hover:shadow-lg"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              })
            }
          >
            <FaPlus /> Thêm sản phẩm
          </Button>
        </div>

        <img
          src="/shop-illustration.webp"
          className="w-[240px] drop-shadow-sm"
          alt=""
        />
      </div>

      {/* ========= DASHBOARD BOXES ========= */}
      <DashboardBoxes />

      {/* ========= PRODUCT LIST ========= */}
      <div className="my-8">
        <Products />
      </div>

      {/* ========= CHART ========= */}
      <div className="card my-4 shadow-md sm:rounded-lg bg-white border border-gray-200">
        <div className="flex items-center justify-between px-6 py-5 pb-1">
          <h2 className="text-[18px] font-[600] text-gray-700">
            Thống kê người dùng & doanh số
          </h2>
        </div>

        <div className="flex items-center gap-6 px-6 py-4">
          <span className="flex items-center gap-2 text-[14px] text-gray-700">
            <span className="block w-[10px] h-[10px] rounded-full bg-green-600"></span>
            Người dùng mới
          </span>

          <span className="flex items-center gap-2 text-[14px] text-gray-700">
            <span className="block w-[10px] h-[10px] rounded-full bg-primary"></span>
            Sản phẩm bán ra
          </span>
        </div>

        {loadingChart && (
          <div className="w-full py-20 text-center text-gray-500">
            Đang tải biểu đồ...
          </div>
        )}

        {!loadingChart && statsData.length > 0 && (
          <div className="flex justify-center pb-6">
            <LineChart
              width={1000}
              height={450}
              data={statsData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="sold"
                stroke="#3b82f6"
                strokeWidth={3}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </div>
        )}
      </div>

      {/* ========= RECENT ORDERS ========= */}
      <Orders />
    </>
  );
};

export default Dashboard;
