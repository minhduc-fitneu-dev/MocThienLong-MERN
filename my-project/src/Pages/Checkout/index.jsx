// src/Pages/Checkout/index.jsx

import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { IoBagCheck } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Button from "@mui/material/Button";
import { postData } from "../../utils/api";

const Checkout = () => {
  const {
    isLogin,
    cartItems,
    cartTotal,
    addressList,
    setIsAddAddressPopupOpen,
    openAlertBox,
    refreshCart,
  } = useContext(MyContext);

  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ NEW: phương thức thanh toán & ghi chú
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "online"
  const [orderNote, setOrderNote] = useState("");

  // ✅ Chọn default address mỗi khi addressList thay đổi
  useEffect(() => {
    if (!addressList || addressList.length === 0) {
      setSelectedAddressId("");
      return;
    }

    const defaultAddr = addressList.find((a) => a.isDefault);
    if (defaultAddr) setSelectedAddressId(defaultAddr._id);
    else setSelectedAddressId(addressList[0]._id);
  }, [addressList]);

  // ❌ Chưa đăng nhập
  if (!isLogin) {
    return (
      <section className="py-10">
        <div className="container w-[80%] text-center">
          <img
            src="/images/empty-cart.png"
            className="w-[200px] mx-auto mb-4"
            alt="Đăng nhập để thanh toán"
          />
          <h2 className="mb-2 text-[20px] font-[600]">
            Bạn cần đăng nhập để tiến hành thanh toán
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng đăng nhập để xem giỏ hàng và đặt mua sản phẩm.
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
      <section className="py-10">
        <div className="container w-[80%] text-center">
          <img
            src="/images/nocart.png"
            className="w-[220px] mx-auto mb-4"
            alt="Giỏ hàng trống"
          />
          <h2 className="mb-2 text-[20px] font-[600]">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-600 mb-4">
            Hãy khám phá các sản phẩm gỗ tinh tế tại Mộc Thiên Long và thêm vào
            giỏ nhé.
          </p>
          <Link to="/">
            <Button className="btn-org btn-lg">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      </section>
    );
  }

  // 🧾 Đặt hàng
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      openAlertBox("error", "Vui lòng chọn địa chỉ nhận hàng.");
      return;
    }

    setLoading(true);
    try {
      const res = await postData("/api/order/create", {
        addressId: selectedAddressId,
        paymentMethod, // ⭐ gửi luôn phương thức thanh toán
        orderNote, // ⭐ gửi ghi chú đơn hàng
      });

      if (res?.success) {
        openAlertBox("success", "Đặt hàng thành công!");
        await refreshCart();
        navigate("/order-success");
      } else {
        openAlertBox(
          "error",
          res?.message || "Không thể tạo đơn hàng, vui lòng thử lại."
        );
      }
    } catch (error) {
      openAlertBox("error", "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // ⚙️ Tính tiền từng dòng
  const getItemFinalPrice = (item) => {
    const product = item.productId || {};
    const price = product.price || 0;
    const discount = product.discount || 0;
    const finalPrice = price - (price * discount) / 100;
    return finalPrice;
  };

  return (
    <section className="py-10">
      <div className="container flex gap-6">
        {/* LEFT: Địa chỉ giao hàng */}
        <div className="leftCol w-[65%]">
          <div className="bg-white shadow-md p-5 rounded-md">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineLocationMarker className="text-[#eb8600] text-[22px]" />
              <h1 className="text-[20px] font-[600]">Thông tin giao hàng</h1>
            </div>

            {/* Không có địa chỉ nào */}
            {(!addressList || addressList.length === 0) && (
              <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                <p className="mb-3 text-gray-600 text-[14px]">
                  Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ trước khi
                  đặt hàng.
                </p>
                <Button
                  className="btn-org"
                  onClick={() => setIsAddAddressPopupOpen(true)}
                >
                  + Thêm địa chỉ mới
                </Button>
              </div>
            )}

            {/* Danh sách địa chỉ */}
            {addressList && addressList.length > 0 && (
              <div className="space-y-3">
                {addressList.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                    <label
                      key={addr._id}
                      className={`flex gap-3 border rounded-md p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#eb8600] bg-[#fff7ec]"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <p className="font-[600] text-[15px]">
                          {addr.address_line1}
                        </p>
                        <p className="text-[13px] text-gray-600">
                          {addr.city}, {addr.state}, {addr.country} -{" "}
                          {addr.pincode}
                        </p>
                        <p className="text-[13px] text-gray-600 mt-1">
                          📞 {addr.mobile}
                        </p>
                        {addr.isDefault && (
                          <span className="inline-block mt-2 px-2 py-[2px] text-[11px] rounded-full bg-green-100 text-green-700 font-[600]">
                            Địa chỉ mặc định
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}

                <div className="pt-2">
                  <Button
                    className="!text-[#eb8600] !bg-transparent hover:!bg-[#fff3e1]"
                    onClick={() => setIsAddAddressPopupOpen(true)}
                  >
                    + Thêm địa chỉ khác
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Tóm tắt đơn hàng + thanh toán */}
        <div className="rightCol w-[35%]">
          <div className="bg-white shadow-md p-5 rounded-md">
            <h2 className="mb-4 text-[18px] font-[600]">Đơn hàng của bạn</h2>

            {/* Header */}
            <div className="flex items-center justify-between py-3 border-y border-[rgba(0,0,0,0.08)] text-[13px] font-[600] text-gray-700">
              <span>Sản phẩm</span>
              <span>Tạm tính</span>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="mb-5 scroll max-h-[260px] overflow-y-auto overflow-x-hidden pr-1 mt-1">
              {cartItems.map((item) => {
                const product = item.productId || {};
                const finalPrice = getItemFinalPrice(item);
                const lineTotal = finalPrice * item.quantity;

                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.03)]"
                  >
                    <div className="flex items-center gap-3 w-[70%]">
                      <div className="w-[52px] h-[52px] overflow-hidden rounded-md group cursor-pointer border border-gray-100">
                        <img
                          src={product?.images?.[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all"
                        />
                      </div>
                      <div className="info">
                        <h4 className="text-[13px] font-[500] line-clamp-2">
                          {product.name}
                        </h4>
                        <span className="text-[12px] text-gray-500">
                          Số lượng: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <span className="text-[13px] font-[500] whitespace-nowrap">
                      {lineTotal.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tổng tiền */}
            <div className="space-y-2 text-[14px]">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-[600]">
                  {cartTotal.total.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(0,0,0,0.08)] mt-1">
                <span className="font-[600] text-[15px]">Tổng thanh toán</span>
                <span className="font-[700] text-[17px] text-[#eb8600]">
                  {cartTotal.total.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            {/* ⭐ PHƯƠNG THỨC THANH TOÁN */}
            <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.08)]">
              <h3 className="text-[15px] font-[600] mb-2">
                Phương thức thanh toán
              </h3>

              <div className="space-y-2 text-[13px]">
                {/* COD */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-[3px]"
                  />
                  <div>
                    <p className="font-[600]">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-gray-500">
                      Bạn sẽ thanh toán tiền mặt cho đơn vị vận chuyển khi nhận
                      hàng.
                    </p>
                  </div>
                </label>

                {/* ONLINE (Disabled, để sau nâng cấp) */}
                <label className="flex items-start gap-2 opacity-60 cursor-not-allowed">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    disabled
                    className="mt-[3px]"
                  />
                  <div>
                    <p className="font-[600]">Thanh toán trực tuyến</p>
                    <p className="text-gray-500">
                      Tính năng sẽ được Mộc Thiên Long ra mắt trong thời gian
                      tới.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ⭐ GHI CHÚ ĐƠN HÀNG */}
            <div className="mt-4">
              <h3 className="text-[15px] font-[600] mb-2">
                Ghi chú cho đơn hàng (tuỳ chọn)
              </h3>
              <textarea
                rows={3}
                className="w-full text-[13px] border border-gray-300 rounded-md p-2 outline-none focus:border-[#eb8600] focus:ring-1 focus:ring-[#eb8600] resize-none"
                placeholder="VD: Giao giờ hành chính, gọi trước khi giao, để hàng trước cửa..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>

            <Button
              className="btn-org w-full btn-lg flex gap-3 mt-5 justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={
                loading ||
                !selectedAddressId ||
                !cartItems ||
                cartItems.length === 0
              }
            >
              <IoBagCheck className="text-[20px]" />
              {loading ? "Đang xử lý..." : "Đặt hàng ngay"}
            </Button>

            <p className="mt-3 text-[12px] text-gray-500 text-center">
              Bằng việc bấm &quot;Đặt hàng ngay&quot;, bạn đồng ý với chính sách
              mua hàng của Mộc Thiên Long.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
