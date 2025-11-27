import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import CircularProgress from "@mui/material/CircularProgress";

import { MyContext } from "../../App";
import { postData } from "../../utils/api";

// Firebase Auth
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [formFields, setFormsFields] = useState({
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();

  // =============== FORGOT PASSWORD ===============
  // =============== FORGOT PASSWORD ===============
  const forgotPassword = async () => {
    const email = formFields.email.trim();

    if (!email) {
      context.openAlertBox("error", "Vui lòng nhập email trước khi tiếp tục");
      return;
    }

    try {
      // Gửi OTP
      const res = await postData("/api/user/forgot-password", { email });

      if (res?.error) {
        context.openAlertBox("error", res.message);
        return;
      }

      // Thành công → lưu vào localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("actionType", "forgot-password");

      context.openAlertBox("success", "Mã OTP đã được gửi đến email của bạn!");

      // Điều hướng sang verify
      navigate("/verify");
    } catch (err) {
      context.openAlertBox("error", "Không thể gửi OTP, vui lòng thử lại!");
    }
  };

  // =============== INPUT HANDLER ===============
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============== LOGIN WITH EMAIL/PASSWORD ===============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.email || !formFields.password) {
      context.openAlertBox("error", "Vui lòng nhập đầy đủ thông tin");
      return setIsLoading(false);
    }

    try {
      const res = await postData("/api/user/login", formFields, {
        withCredentials: true,
      });

      setIsLoading(false);

      if (res?.error) {
        context.openAlertBox("error", res.message);
        return;
      }

      context.openAlertBox("success", res.message || "Đăng nhập thành công!");

      // Token
      const accessToken =
        res?.accessToken || res?.accesstoken || res?.data?.accesstoken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      // User info
      const userData = res?.user || res?.data?.user || null;

      context.setUserData(userData);
      context.setIsLogin(true);

      navigate("/my-account");
    } catch (error) {
      setIsLoading(false);
      context.openAlertBox("error", "Đăng nhập thất bại!");
    }
  };

  // ================= GOOGLE LOGIN =================
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true); // <-- khóa nút Google

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const payload = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        mobile: user.phoneNumber,
        signUpWithGoogle: true,
      };

      const res = await postData("/api/user/authWithGoogle", payload);

      setIsLoading(false);

      if (res?.error) {
        context.openAlertBox("error", res.message);
        return;
      }

      // === TOKEN ===
      const accessToken =
        res?.accessToken ||
        res?.accesstoken || // phòng trường hợp backend viết sai chữ
        res?.data?.accesstoken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      // === USER INFO ===
      const userData = res?.user || res?.data?.user || null;

      if (!userData) {
        console.warn("⚠️ Server không trả user, nhưng vẫn login Google OK");
      }

      context.setUserData(userData);
      context.setIsLogin(true);

      context.openAlertBox("success", "Đăng nhập bằng Google thành công!");

      navigate("/my-account");
    } catch (error) {
      setIsLoading(false);
      console.error("Google Login Error:", error);
      context.openAlertBox("error", "Đăng nhập Google thất bại!");
    }
  };

  return (
    <section className="section py-12">
      <div className="container">
        <div
          className="
            max-w-[480px] mx-auto bg-white rounded-2xl shadow-lg 
            p-8 px-10 animate-[fadeIn_0.4s_ease]
          "
        >
          <h3 className="text-center text-[22px] font-semibold text-gray-800 mb-1">
            Đăng nhập tài khoản
          </h3>

          <p className="text-center text-gray-500 text-[14px] mb-6">
            Chào mừng bạn quay trở lại 👋
          </p>

          <form className="w-full" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email"
                name="email"
                variant="outlined"
                className="w-full"
                value={formFields.email}
                onChange={onChangeInput}
                disabled={isLoading}
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isShowPassword ? "text" : "password"}
                id="password"
                label="Mật khẩu"
                name="password"
                variant="outlined"
                className="w-full"
                value={formFields.password}
                onChange={onChangeInput}
                disabled={isLoading}
              />

              <Button
                type="button"
                className="
                  !absolute top-[10px] right-[10px] 
                  !w-[35px] !h-[35px] !min-w-[35px] 
                  !rounded-full !bg-transparent !text-black
                "
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? (
                  <FaEyeSlash className="text-[15px] opacity-75" />
                ) : (
                  <FaEye className="text-[15px] opacity-75" />
                )}
              </Button>
            </div>

            {/* FORGOT PASSWORD */}
            <span
              className="cursor-pointer text-[14px] font-[600] text-[#eb8600] hover:underline"
              onClick={forgotPassword}
            >
              Quên mật khẩu?
            </span>

            {/* LOGIN BUTTON */}
            <div className="flex items-center w-full mt-5 mb-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="
                  w-full btn-lg flex justify-center gap-3 
                  !bg-[#eb8600] !text-white !font-semibold !py-3 
                  hover:opacity-90 transition-all duration-200 
                  rounded-full shadow-md
                "
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </div>

            {/* SIGN UP REDIRECT */}
            <p className="text-center text-gray-700 mb-2">
              Chưa có tài khoản?
              <Link className="text-[#eb8600] font-[600] ml-1" to="/register">
                Đăng ký ngay
              </Link>
            </p>

            {/* OR */}
            <div className="flex items-center gap-3 my-4">
              <div className="h-[1px] bg-gray-300 flex-1" />
              <span className="text-gray-500 text-[13px]">
                Hoặc đăng nhập bằng
              </span>
              <div className="h-[1px] bg-gray-300 flex-1" />
            </div>

            {/* GOOGLE LOGIN */}
            <Button
              onClick={loginWithGoogle}
              className="
                w-full flex gap-3 bg-gray-100 btn-lg text-black py-3 
                hover:bg-gray-200 transition-all duration-150 rounded-full
              "
            >
              <FcGoogle className="text-[22px]" />
              Đăng nhập với Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
