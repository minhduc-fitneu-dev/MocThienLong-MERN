import { Button, CircularProgress } from "@mui/material";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaRegEye } from "react-icons/fa6";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const context = useContext(MyContext);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

    if (!formFields.name.trim()) {
      context.alertBox("error", "Vui lòng nhập họ và tên");
      return;
    }

    if (!formFields.email.trim()) {
      context.alertBox("error", "Vui lòng nhập email");
      return;
    }

    if (!emailRegex.test(formFields.email.trim())) {
      context.alertBox("error", "Email không hợp lệ");
      return;
    }

    if (formFields.password.length < 6) {
      context.alertBox("error", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsLoading(true);

      const res = await postData(`/api/user/register`, formFields);

      if (!res?.error) {
        context.alertBox("success", res?.message || "Đăng ký thành công!");
        localStorage.setItem("userEmail", formFields.email);

        setFormFields({ name: "", email: "", password: "" });

        navigate("/verify-account");
      } else {
        context.alertBox("error", res?.message || "Đăng ký thất bại!");
      }
    } catch {
      context.alertBox("error", "Lỗi hệ thống!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white w-full min-h-screen relative">
      {/* HEADER */}
      <header className="w-full fixed top-0 left-0 px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between z-50">
        <Link to="/">
          <img src="/logo-moc.png" className="w-[180px]" alt="Logo" />
        </Link>
      </header>

      {/* BACKGROUND */}
      <img
        src="/patern.webp"
        className="w-full fixed top-0 left-0 opacity-5 pointer-events-none"
        alt=""
      />

      {/* SIGNUP CARD */}
      <div className="w-[600px] mx-auto pt-32 pb-24 relative z-50">
        <div className="bg-white shadow-xl border border-gray-100 rounded-2xl px-10 py-10 backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center">
            <img src="/logo-moc.png" className="m-auto w-[160px]" alt="Icon" />
          </div>

          {/* Title */}
          <h1 className="text-center text-[32px] font-[800] mt-4 leading-tight">
            Tạo tài khoản mới
            <br />
            <span className="text-primary text-[20px] font-[600]">
              Nhận ưu đãi và cập nhật mới nhất
            </span>
          </h1>

          {/* Divider */}
          <div className="w-full flex items-center justify-center gap-3 my-7">
            <span className="flex items-center w-[100px] h-[1px] bg-gray-300"></span>
            <span className="text-[14px] font-[500] text-gray-700">
              Thông tin cá nhân
            </span>
            <span className="flex items-center w-[100px] h-[1px] bg-gray-300"></span>
          </div>

          {/* FORM */}
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="mb-5">
              <h4 className="text-[14px] font-[600] mb-1">Họ và tên</h4>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
                placeholder="Nhập họ và tên"
                className="w-full h-[48px] border border-gray-300 rounded-lg focus:border-primary px-3 transition-all"
                disabled={isLoading}
              />
            </div>

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
                disabled={isLoading}
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
                  disabled={isLoading}
                />

                <Button
                  type="button"
                  onClick={() => setIsPasswordShow((prev) => !prev)}
                  className="!absolute top-[6px] right-[10px] !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                >
                  {isPasswordShow ? <FaEyeSlash /> : <FaRegEye />}
                </Button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center mb-6">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Ghi nhớ đăng nhập"
              />
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full !bg-primary !text-white !h-[48px] !rounded-full !text-[17px] !font-[600] hover:!opacity-90"
              disabled={
                isLoading ||
                !formFields.name.trim() ||
                !formFields.email.trim() ||
                formFields.password.length < 6
              }
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center mt-7 text-[15px] text-gray-700">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-primary font-[600] hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
