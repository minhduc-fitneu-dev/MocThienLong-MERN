import React, { useContext } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { GiReturnArrow } from "react-icons/gi";
import { LiaWalletSolid } from "react-icons/lia";
import { AiOutlineGift } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PiChats } from "react-icons/pi";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { CiYoutube } from "react-icons/ci";
import { SiZalo } from "react-icons/si";
import Drawer from "@mui/material/Drawer";
import CartPanel from "../CartPanel";
import { MyContext } from "../../App";
import { IoCloseSharp } from "react-icons/io5";

const Footer = () => {
  const context = useContext(MyContext);

  return (
    <>
      {/* ================= TOP SERVICE STRIP ================= */}
      <footer className="py-8 bg-[#fafafa] border-t border-[rgba(0,0,0,0.1)]">
        <div className="container">
          <div className="grid grid-cols-5 gap-5 text-center pb-8">
            {[
              {
                icon: <LiaShippingFastSolid className="text-[46px]" />,
                title: "Miễn phí vận chuyển",
                desc: "Áp dụng đơn hàng từ 1.000.000đ",
              },
              {
                icon: <GiReturnArrow className="text-[46px]" />,
                title: "Đổi trả trong 30 ngày",
                desc: "Hỗ trợ đổi nếu sản phẩm lỗi",
              },
              {
                icon: <LiaWalletSolid className="text-[46px]" />,
                title: "Thanh toán an toàn",
                desc: "Hỗ trợ COD & chuyển khoản",
              },
              {
                icon: <AiOutlineGift className="text-[46px]" />,
                title: "Quà tặng hấp dẫn",
                desc: "Dành cho khách hàng mới",
              },
              {
                icon: <BiSupport className="text-[46px]" />,
                title: "Hỗ trợ 24/7",
                desc: "Liên hệ bất cứ lúc nào",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group flex flex-col items-center transition-all"
              >
                <div className="text-[#333] group-hover:text-[#eb8600] transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-[16px] font-[600] mt-3">{item.title}</h3>
                <p className="text-[13px] text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          {/* ================= MAIN FOOTER ================= */}
          <div className="grid grid-cols-3 gap-8 py-6">
            {/* ----- CỘT 1 ----- */}
            <div className="pr-10 border-r border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[18px] font-[700] mb-3">Liên hệ</h2>
              <p className="text-[14px] text-gray-700 leading-6 mb-2">
                <b>Mộc Thiên Long</b> <br />
                Làng nghề Chuyên Mỹ – Hà Nội
              </p>
              <p className="text-[14px] mb-1">
                Email:{" "}
                <Link
                  to="mailto:mocthienlong@gmail.com"
                  className="text-[#eb8600] hover:underline"
                >
                  mocthienlong@gmail.com
                </Link>
              </p>

              <span className="text-[20px] font-[700] text-[#eb8600] block my-4">
                0972 892 104
              </span>

              <div className="flex items-center gap-3 mt-4 p-3 bg-white rounded-md shadow-sm border border-[rgba(0,0,0,0.08)]">
                <PiChats className="text-[38px] text-[#eb8600]" />
                <div>
                  <h4 className="text-[15px] font-[600]">Chat trực tuyến</h4>
                  <p className="text-[13px] text-gray-600">
                    Phản hồi trong 1 phút
                  </p>
                </div>
              </div>
            </div>

            {/* ----- CỘT 2 ----- */}
            <div className="grid grid-cols-2 gap-8 pl-5">
              <div>
                <h2 className="text-[18px] font-[700] mb-4">Danh mục</h2>
                <ul className="space-y-2 text-[14px]">
                  {[
                    "Giảm giá",
                    "Sản phẩm mới",
                    "Bán chạy",
                    "Liên hệ",
                    "Bản đồ",
                    "Cửa hàng",
                  ].map((item, i) => (
                    <li key={i}>
                      <Link className="link hover:text-[#eb8600] transition-all">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-[18px] font-[700] mb-4">Chính sách</h2>
                <ul className="space-y-2 text-[14px]">
                  {[
                    "Chính sách vận chuyển",
                    "Chính sách bảo hành",
                    "Điều khoản dịch vụ",
                    "Về cửa hàng",
                    "Bảo mật thanh toán",
                    "Đăng nhập",
                  ].map((item, i) => (
                    <li key={i}>
                      <Link className="link hover:text-[#eb8600] transition-all">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ----- CỘT 3 ----- */}
            <div className="pl-8">
              <h2 className="text-[18px] font-[700] mb-3">
                Đăng ký nhận ưu đãi
              </h2>
              <p className="text-[13px] text-gray-600 mb-4">
                Nhận thông báo về sản phẩm mới & khuyến mãi độc quyền.
              </p>

              <input
                type="text"
                placeholder="Email của bạn"
                className="w-full h-[40px] border border-gray-300 rounded px-3 text-[14px] outline-none focus:border-[#eb8600]"
              />

              <Button className="btn-org w-full !mt-3 ">Đăng ký</Button>

              <FormControlLabel
                control={<Checkbox defaultChecked size="small" />}
                label={
                  <span className="text-[13px] text-gray-700">
                    Tôi đồng ý với các điều khoản.
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </footer>

      {/* ================= BOTTOM STRIP ================= */}
      <div className="border-t bg-white py-3">
        <div className="container flex items-center justify-between">
          <ul className="flex items-center gap-3">
            {[
              { icon: <FaFacebookF />, link: "/" },
              { icon: <CiYoutube />, link: "/" },
              { icon: <SiZalo />, link: "/" },
              { icon: <FaInstagram />, link: "/" },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className="w-[38px] h-[38px] flex items-center justify-center rounded-full border border-gray-300 group hover:bg-[#eb8600] transition-all"
                >
                  <span className="text-[18px] text-gray-600 group-hover:text-white">
                    {item.icon}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-[13px] text-gray-600">
            © 2025 - Thiết kế & phát triển bởi <b>Etienne Đức</b>
          </p>

          <div className="flex items-center gap-2">
            <img src="/visa.png" alt="" className="h-[22px]" />
            <img src="/master_card.png" alt="" className="h-[22px]" />
          </div>
        </div>
      </div>

      {/* ================= CART PANEL ================= */}
      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor="right"
        PaperProps={{
          sx: {
            width: "400px", // hoặc 380px / 420px tùy ý
            maxWidth: "90vw",
          },
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-[600] text-[16px]">
            Giỏ hàng ({context.cartCount})
          </h4>
          <IoCloseSharp
            className="text-[22px] cursor-pointer"
            onClick={context.toggleCartPanel(false)}
          />
        </div>

        <CartPanel />
      </Drawer>
    </>
  );
};

export default Footer;
