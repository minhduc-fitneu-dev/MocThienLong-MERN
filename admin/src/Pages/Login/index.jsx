import { Button, CircularProgress } from "@mui/material";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaRegEye } from "react-icons/fa6";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";

const Login = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  // ================= FORGOT PASSWORD =================
  const forgotPassword = () => {
    if (!formFields.email.trim()) {
      context.alertBox("error", "Vui lòng nhập email trước!");
      return;
    }

    postData("/api/user/forgot-password", { email: formFields.email }).then(
      (res) => {
        if (!res?.error) {
          context.alertBox("success", "Mã OTP đã được gửi về email!");
          localStorage.setItem("userEmail", formFields.email);
          localStorage.setItem("actionType", "forgot-password");
          navigate("/verify-account");
        } else {
          context.alertBox("error", res?.message || "Lỗi hệ thống!");
        }
      }
    );
  };

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formFields.email.trim()) {
      context.alertBox("error", "Vui lòng nhập email!");
      return;
    }

    if (!formFields.password.trim()) {
      context.alertBox("error", "Vui lòng nhập mật khẩu!");
      return;
    }

    setIsLoading(true);

    const res = await postData(`/api/user/login`, formFields);

    if (!res || res?.error) {
      context.alertBox("error", res?.message || "Đăng nhập thất bại!");
      setIsLoading(false);
      return;
    }

    // Lưu token
    localStorage.setItem("accessToken", res?.accessToken);
    localStorage.setItem("role", res?.user?.role);
    localStorage.setItem("isLogin", "true");

    // Tải thông tin user
    try {
      const userRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/user-details`,
        {
          headers: { Authorization: `Bearer ${res?.accessToken}` },
        }
      );

      const userData = await userRes.json();

      if (userData?.data) {
        context.setUserData(userData.data);
        context.setIsLogin(true);
      }

      // ========== KIỂM TRA QUYỀN ==========
      if (userData?.data?.role !== "ADMIN") {
        // ❌ Không phải admin → chỉ hiển thị lỗi, KHÔNG hiển thị "đăng nhập thành công"
        context.alertBox("error", "Bạn không có quyền truy cập Admin!");
        navigate("/login");
        setIsLoading(false);
        return;
      }

      // ✔ ADMIN → Hiển thị success + redirect
      context.alertBox("success", "Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      context.alertBox("error", "Không thể lấy thông tin người dùng!");
    }

    setFormFields({ email: "", password: "" });
    setIsLoading(false);
  };

  return (
    <section className="bg-white w-full min-h-screen relative">
      {/* ------------------- HEADER ------------------- */}
      <header className="w-full fixed top-0 left-0 px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between z-50">
        <Link to="/">
          <img src="/logo-moc.png" className="w-[180px]" alt="Logo" />
        </Link>
      </header>

      {/* ---------------- BACKGROUND ---------------- */}
      <img
        src="/patern.webp"
        className="w-full fixed top-0 left-0 opacity-5 pointer-events-none"
        alt=""
      />

      {/* ------------------- LOGIN CARD ------------------- */}
      <div className="w-[600px] mx-auto pt-32 pb-24 relative z-50">
        <div className="bg-white shadow-xl border border-gray-100 rounded-2xl px-10 py-10 backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center">
            <img src="/logo-moc.png" className="m-auto w-[160px]" alt="Icon" />
          </div>

          {/* Title */}
          <h1 className="text-center text-[32px] font-[800] mt-4 leading-tight">
            Chào mừng quay lại!
            <br />
            <span className="text-primary text-[20px] font-[600]">
              Đăng nhập để tiếp tục quản lý
            </span>
          </h1>

          {/* Divider */}
          <div className="w-full flex items-center justify-center gap-3 my-7">
            <span className="flex items-center w-[100px] h-[1px] bg-gray-300"></span>
            <span className="text-[14px] font-[500] text-gray-700">
              Tài khoản của bạn
            </span>
            <span className="flex items-center w-[100px] h-[1px] bg-gray-300"></span>
          </div>

          {/* ------------------- FORM ------------------- */}
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <h4 className="text-[14px] font-[600] mb-1">Email</h4>
              <input
                type="email"
                name="email"
                value={formFields.email}
                onChange={onChangeInput}
                placeholder="Nhập email"
                className="w-full h-[48px] border border-gray-300 rounded-lg focus:border-primary px-3 transition-all"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <h4 className="text-[14px] font-[600] mb-1">Mật khẩu</h4>
              <div className="relative">
                <input
                  type={isPasswordShow ? "text" : "password"}
                  name="password"
                  value={formFields.password}
                  onChange={onChangeInput}
                  placeholder="Nhập mật khẩu"
                  className="w-full h-[48px] border border-gray-300 rounded-lg focus:border-primary px-3 transition-all"
                />

                <Button
                  type="button"
                  className="!absolute top-[6px] right-[10px] !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                  onClick={() => setIsPasswordShow((prev) => !prev)}
                >
                  {isPasswordShow ? <FaEyeSlash /> : <FaRegEye />}
                </Button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Ghi nhớ đăng nhập"
              />

              <span
                onClick={forgotPassword}
                className="text-primary font-[600] text-[15px] hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </span>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full !bg-primary !text-white !h-[48px] !rounded-full !text-[17px] !font-[600] hover:!opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          {/* ------------------- SIGN UP LINK ------------------- */}
          <p className="text-center mt-7 text-[16px] text-gray-800 font-medium flex items-center justify-center gap-2">
            <span className="text-primary text-[20px]">⚡</span>
            Quản lý cửa hàng với các tính năng ưu việt
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
