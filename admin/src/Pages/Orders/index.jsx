import React, { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { MyContext } from "../../App";
import { fetchDataFromApi, editPATCH, deleteData } from "../../utils/api";
import Badge from "../../Components/Badge";
import SearchBox from "../../Components/SearchBox";

const Orders = () => {
  const context = useContext(MyContext);

  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10;
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);

  // ============================
  // FETCH ORDERS
  // ============================
  const loadOrders = async () => {
    setLoading(true);
    const res = await fetchDataFromApi(
      `/api/admin/orders?page=${page}&limit=${limit}&search=${search}&status=${status}&month=${month}&year=${year}&customerName=${customerName}&phone=${phone}`
    );

    if (res?.success) {
      setOrders(res.data);
      setTotalOrders(res.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [page, search]);

  const toggleOpen = (index) => {
    setIsOpen(isOpen === index ? null : index);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const res = await editPATCH(`/api/admin/orders/${id}`, {
      status: newStatus,
    });

    if (res?.success) {
      context.alertBox("success", "Cập nhật trạng thái thành công");
      loadOrders();
    } else {
      context.alertBox("error", res?.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá đơn này không?")) return;

    const res = await deleteData(`/api/admin/orders/${id}`);

    if (res?.success) {
      context.alertBox("success", "Đã xoá đơn hàng!");
      loadOrders();
    } else {
      context.alertBox("error", res?.message || "Không thể xoá đơn hàng");
    }
  };

  const vnd = (n) => n?.toLocaleString("vi-VN");

  return (
    <div className="card my-4 shadow-lg sm:rounded-xl bg-white border border-gray-200 transition-all duration-300 hover:shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-[#fafafa] to-white rounded-t-xl">
        <h2 className="text-[23px] font-[700] text-gray-700 tracking-wide">
          Đơn hàng
        </h2>
        <div className="w-[40%] animate-fadeIn">
          <SearchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 px-6 py-4 bg-[#fafafa] border-b">
        <input
          type="text"
          placeholder="Tên khách hàng"
          className="filterInput"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Số điện thoại"
          className="filterInput"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="filterInput"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Tháng</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          className="filterInput"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Năm</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <Button
          variant="contained"
          className="!bg-[#eb8600] !shadow !text-white"
          onClick={() => {
            setPage(1);
            loadOrders(); // reload dữ liệu
          }}
        >
          Lọc
        </Button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="p-10 text-center text-gray-500 italic animate-pulse">
          Đang tải dữ liệu...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-10 text-center text-gray-500 italic animate-fadeIn">
          Không có đơn hàng nào phù hợp
        </div>
      ) : (
        <div className="relative overflow-x-auto mt-5 pb-5 animate-fadeIn">
          <table className="w-full text-sm text-gray-700">
            <thead className="text-xs uppercase bg-[#f7f7f7] text-gray-600 border-y">
              <tr>
                <th className="px-6 py-3">&nbsp;</th>
                <th className="px-6 py-3">Order Id</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Số ĐT</th>
                <th className="px-6 py-3">Địa chỉ</th>
                <th className="px-6 py-3">Pincode</th>
                <th className="px-6 py-3">Tổng</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Ngày tạo</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <>
                  <tr
                    key={order._id}
                    className="bg-white border-b hover:bg-[#fafafa] transition-all duration-200 cursor-pointer"
                  >
                    {/* Expand */}
                    <td className="px-6 py-4">
                      <Button
                        className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-gray-100 hover:!bg-gray-200 transition-all"
                        onClick={() => toggleOpen(index)}
                      >
                        {isOpen === index ? (
                          <FaAngleDown className="text-[16px]" />
                        ) : (
                          <FaAngleUp className="text-[16px]" />
                        )}
                      </Button>
                    </td>

                    <td className="px-6 py-4 text-primary font-semibold">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4">{order.paymentId || "COD"}</td>
                    <td className="px-6 py-4 font-[500]">
                      {order.receiver.fullName}
                    </td>
                    <td className="px-6 py-4">{order.receiver.mobile}</td>

                    <td className="px-6 py-4 w-[300px]">
                      {order.delivery_snapshot.address_line1},{" "}
                      {order.delivery_snapshot.city}
                    </td>

                    <td className="px-6 py-4">
                      {order.delivery_snapshot.pincode}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {vnd(order.totalAmt)}đ
                    </td>

                    <td className="px-6 py-4">{order.receiver.email}</td>
                    <td className="px-6 py-4 text-primary">{order.userId}</td>

                    <td className="px-6 py-4">
                      <Badge status={order.delivery_status} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 flex gap-3 items-center whitespace-nowrap">
                      <select
                        className="border p-1 rounded-lg bg-white text-gray-700 shadow-sm hover:shadow transition"
                        value={order.delivery_status}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                      >
                        <option value="processing">Processing</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-600 hover:text-red-800 text-[13px] font-medium transition"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>

                  {/* =============== PRODUCT LIST =============== */}
                  {isOpen === index && (
                    <tr className="animate-slideDown">
                      <td colSpan="13" className="bg-gray-50 px-10 py-5">
                        <div className="border rounded-xl overflow-hidden shadow-md animate-fadeIn">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-200 text-gray-700 text-xs uppercase">
                              <tr>
                                <th className="px-6 py-3">Product Id</th>
                                <th className="px-6 py-3">Tên sản phẩm</th>
                                <th className="px-6 py-3">Ảnh</th>
                                <th className="px-6 py-3">SL</th>
                                <th className="px-6 py-3">Giá</th>
                                <th className="px-6 py-3">Tổng</th>
                              </tr>
                            </thead>

                            <tbody>
                              {order.products.map((p) => (
                                <tr
                                  key={p._id}
                                  className="bg-white border-b hover:bg-gray-100 transition"
                                >
                                  <td className="px-6 py-4 font-[500]">
                                    {p.productId?._id}
                                  </td>

                                  <td className="px-6 py-4">{p.name}</td>

                                  <td className="px-6 py-4">
                                    <img
                                      src={p.image}
                                      alt=""
                                      className="w-[50px] h-[50px] rounded-lg object-cover shadow-md"
                                    />
                                  </td>

                                  <td className="px-6 py-4">{p.quantity}</td>

                                  <td className="px-6 py-4 font-[500]">
                                    {vnd(p.finalPrice)}đ
                                  </td>

                                  <td className="px-6 py-4 font-[700] text-gray-900">
                                    {vnd(p.finalPrice * p.quantity)}đ
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex items-center justify-center gap-4 py-6 animate-fadeIn">
            <button
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40 shadow-sm"
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Trang {page} / {Math.ceil(totalOrders / limit)}
            </span>

            <button
              disabled={page >= totalOrders / limit}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40 shadow-sm"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
