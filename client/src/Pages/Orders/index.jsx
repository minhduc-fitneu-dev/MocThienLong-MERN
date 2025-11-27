import React, { useState, useEffect, useContext } from "react";
import AccountSidebar from "../../components/AccountSidebar";
import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Badge from "../../components/Badge";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const { openAlertBox } = useContext(MyContext);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const loadOrders = async () => {
    const res = await fetchDataFromApi("/api/order/my-orders");
    if (!res.error) setOrders(res.data);
    else openAlertBox("error", res.message);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;
    const res = await postData("/api/order/cancel", { orderId });

    if (res.success) {
      openAlertBox("success", "Hủy đơn hàng thành công!");
      loadOrders();
    } else openAlertBox("error", res.message);
  };

  return (
    <section className="py-10 w-full">
      <div className="container flex gap-6">
        <div className="w-[20%]">
          <AccountSidebar />
        </div>

        <div className="w-[80%]">
          <div className="shadow-md bg-white rounded-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="py-6 px-6 border-b bg-[#fafafa]">
              <h2 className="text-[22px] font-[700]">Đơn hàng của tôi</h2>
              <p className="text-gray-600 text-[14px] mt-1">
                Bạn có{" "}
                <span className="font-bold text-[#eb8600]">
                  {orders.length}
                </span>{" "}
                đơn hàng
              </p>
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 min-w-[1100px]">
                <thead className="text-xs uppercase bg-gray-50 border-b">
                  <tr className="text-left">
                    <th className="px-6 py-4"></th>
                    <th className="px-6 py-4">Mã đơn</th>
                    <th className="px-6 py-4">Tổng tiền</th>
                    <th className="px-6 py-4">Thanh toán</th>
                    <th className="px-6 py-4">Giao hàng</th>
                    <th className="px-6 py-4">Địa chỉ</th>
                    <th className="px-6 py-4">Ngày tạo</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, index) => {
                    const address = order.delivery_snapshot;
                    const isOpen = openIndex === index;

                    return (
                      <React.Fragment key={order._id}>
                        <tr className="bg-white border-b hover:bg-[#fff5e8] transition">
                          <td className="px-6 py-4">
                            <Button
                              className="!w-[34px] !h-[34px] !min-w-[34px] !rounded-full !bg-[#eee]"
                              onClick={() => toggleOpen(index)}
                            >
                              {isOpen ? (
                                <FaAngleDown className="text-[16px]" />
                              ) : (
                                <FaAngleUp className="text-[16px]" />
                              )}
                            </Button>
                          </td>

                          <td className="px-6 py-4 font-[600] text-[#eb8600]">
                            {order.orderId}
                          </td>

                          <td className="px-6 py-4 font-[600]">
                            {order.totalAmt.toLocaleString("vi-VN")} đ
                          </td>

                          {/* Thanh toán */}
                          <td className="px-6 py-4">
                            <Badge status={order.payment_status} />
                          </td>

                          {/* Giao hàng */}
                          <td className="px-6 py-4">
                            <Badge status={order.delivery_status} />
                          </td>

                          {/* Địa chỉ – hạn 1 dòng */}
                          <td className="px-6 py-4 max-w-[200px] truncate">
                            {address?.address_line1}, {address?.city},{" "}
                            {address?.state}
                          </td>

                          <td className="px-6 py-4">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>

                          <td className="px-6 py-4 text-center">
                            {order.delivery_status === "processing" && (
                              <Button
                                className="!bg-red-500 !text-white !px-5 !py-[6px] !rounded-md hover:!bg-red-600 !text-[13px]"
                                onClick={() => handleCancelOrder(order.orderId)}
                              >
                                Hủy đơn
                              </Button>
                            )}
                          </td>
                        </tr>

                        {/* DETAILS */}
                        {isOpen && (
                          <tr>
                            <td
                              colSpan="12"
                              className="bg-[#fefaf6] px-10 py-6"
                            >
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[900px]">
                                  <thead className="bg-gray-100 text-xs uppercase border">
                                    <tr>
                                      <th className="px-5 py-3">ID</th>
                                      <th className="px-5 py-3">Sản phẩm</th>
                                      <th className="px-5 py-3">Ảnh</th>
                                      <th className="px-5 py-3">SL</th>
                                      <th className="px-5 py-3">Giá</th>
                                      <th className="px-5 py-3">Thành tiền</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {order.products.map((p) => (
                                      <tr
                                        key={p.productId}
                                        className="border-b bg-white"
                                      >
                                        <td className="px-5 py-3">
                                          {p.productId}
                                        </td>
                                        <td className="px-5 py-3">{p.name}</td>
                                        <td className="px-5 py-3">
                                          <img
                                            src={p.image}
                                            className="w-[50px] h-[50px] rounded-md object-cover border"
                                          />
                                        </td>
                                        <td className="px-5 py-3">
                                          {p.quantity}
                                        </td>
                                        <td className="px-5 py-3">
                                          {p.finalPrice.toLocaleString("vi-VN")}{" "}
                                          đ
                                        </td>
                                        <td className="px-5 py-3 font-[600] text-[#eb8600]">
                                          {(
                                            p.quantity * p.finalPrice
                                          ).toLocaleString("vi-VN")}{" "}
                                          đ
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
