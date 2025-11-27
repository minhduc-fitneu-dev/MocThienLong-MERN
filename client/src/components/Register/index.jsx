import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import IconButton from "@mui/material/IconButton";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name.trim() === "") {
      context.openAlertBox("error", "Vui lòng nhập họ và tên");
      setIsLoading(false);
      return;
    }

    if (formFields.email.trim() === "") {
      context.openAlertBox("error", "Vui lòng nhập email");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(formFields.email)) {
      context.openAlertBox("error", "Email không đúng định dạng");
      setIsLoading(false);
      return;
    }

    if (formFields.password.trim() === "") {
      context.openAlertBox("error", "Vui lòng nhập mật khẩu");
      setIsLoading(false);
      return;
    }

    if (formFields.password.length < 6) {
      context.openAlertBox("error", "Mật khẩu phải từ 6 ký tự trở lên");
      setIsLoading(false);
      return;
    }

    postData("/api/user/register", formFields).then((res) => {
      setIsLoading(false);

      if (res?.error) {
        context.openAlertBox("error", res?.message);
        return;
      }

      context.openAlertBox("success", "Đăng ký thành công!");

      localStorage.setItem("userEmail", formFields.email);

      setFormFields({ name: "", email: "", password: "" });

      navigate("/verify");
    });
  };

  // ===================== GOOGLE REGISTER / LOGIN =====================
  const authWithGoogle = async () => {
    try {
      setIsLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const payload = {
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        avatar: user.providerData[0].photoURL,
        mobile: user.providerData[0].phoneNumber,
        signUpWithGoogle: true,
      };

      const res = await postData("/api/user/authWithGoogle", payload);

      setIsLoading(false);

      if (res?.error) {
        context.openAlertBox("error", res.message);
        return;
      }

      // Lưu token vào localStorage
      if (res.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
      }

      // Cập nhật trạng thái login
      context.setIsLogin(true);
      context.setUserData(res.user || null);

      context.openAlertBox("success", "Đăng nhập bằng Google thành công!");

      // 👉 Google login không cần verify → vào thẳng tài khoản
      navigate("/my-account");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
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
          <h3 className="text-center text-[22px] font-semibold text-gray-800">
            Tạo tài khoản mới
          </h3>

          <p className="text-center text-gray-500 text-[14px] mb-6">
            Chỉ mất vài giây để bắt đầu ☘️
          </p>

          <form className="w-full" onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                name="name"
                label="Họ và tên"
                variant="outlined"
                className="w-full"
                value={formFields.name}
                onChange={onChangeInput}
                disabled={isLoading}
              />
            </div>

            {/* EMAIL */}
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                name="email"
                label="Email"
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
                name="password"
                label="Mật khẩu"
                variant="outlined"
                className="w-full"
                value={formFields.password}
                onChange={onChangeInput}
                disabled={isLoading}
              />

              <IconButton
                type="button"
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="
                  !absolute top-[10px] right-[10px] 
                  !w-[35px] !h-[35px] 
                  !min-w-[35px] rounded-full
                "
              >
                {isShowPassword ? (
                  <FaEyeSlash className="text-[15px] opacity-75" />
                ) : (
                  <FaEye className="text-[15px] opacity-75" />
                )}
              </IconButton>
            </div>

            {/* SUBMIT */}
            <div className="flex items-center w-full mt-3 mb-3">
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
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Đăng ký"
                )}
              </Button>
            </div>

            {/* LINK LOGIN */}
            <p className="text-center text-gray-700">
              Đã có tài khoản?
              <Link className="text-[#eb8600] font-[600] ml-1" to="/login">
                Đăng nhập ngay
              </Link>
            </p>

            {/* OR */}
            <div className="flex items-center gap-3 my-4">
              <div className="h-[1px] bg-gray-300 flex-1" />
              <span className="text-gray-500 text-[13px]">
                Hoặc tiếp tục với
              </span>
              <div className="h-[1px] bg-gray-300 flex-1" />
            </div>

            {/* GOOGLE */}
            <Button
              className="
                w-full flex gap-3 bg-gray-100 btn-lg text-black py-3 
                hover:bg-gray-200 transition-all duration-150 rounded-full
              "
              onClick={authWithGoogle}
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

export default Register;
