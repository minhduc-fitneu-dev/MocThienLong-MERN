import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowPassword2, setIsShowPassword2] = useState(false);

  const [formFields, setFormsFields] = useState({
    email: localStorage.getItem("userEmail") || "",
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    setFormsFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email
    if (!formFields.email) {
      context.openAlertBox("error", "Please enter your email");
      setIsLoading(false);
      return;
    }

    // Validate new password
    if (!formFields.newPassword) {
      context.openAlertBox("error", "Please enter new password");
      setIsLoading(false);
      return;
    }

    // Validate confirm password
    if (!formFields.confirmPassword) {
      context.openAlertBox("error", "Please enter confirm password");
      setIsLoading(false);
      return;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.openAlertBox(
        "error",
        "Password and confirm password do not match"
      );
      setIsLoading(false);
      return;
    }
    postData("/api/user/reset-password", formFields).then((res) => {
      setIsLoading(false);

      if (res?.error === false) {
        context.openAlertBox("success", res?.message);

        // ⭐ THÊM 3 DÒNG NÀY ĐỂ XOÁ TOKEN CŨ ⭐
        localStorage.removeItem("accessToken");
        context.setIsLogin(false);
        context.setUserData(null);

        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");

        navigate("/login");
      } else {
        context.openAlertBox("error", res?.message);
      }
    });
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto bg-white p-5 px-12">
          <h3 className="text-center text-[18px] text-black">
            Forgot Password
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                className="w-full"
                name="email"
                value={formFields.email}
                onChange={onChangeInput}
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isShowPassword ? "text" : "password"}
                id="newPassword"
                label="New Password"
                variant="outlined"
                className="w-full"
                name="newPassword"
                value={formFields.newPassword}
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] rounded-full !text-black"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? (
                  <FaEyeSlash className="text-[15px] opacity-75" />
                ) : (
                  <FaEye className="text-[15px] opacity-75" />
                )}
              </Button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isShowPassword2 ? "text" : "password"}
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                className="w-full"
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] rounded-full !text-black"
                onClick={() => setIsShowPassword2(!isShowPassword2)}
              >
                {isShowPassword2 ? (
                  <FaEyeSlash className="text-[15px] opacity-75" />
                ) : (
                  <FaEye className="text-[15px] opacity-75" />
                )}
              </Button>
            </div>

            {/* SUBMIT */}
            <div className="flex items-center w-full mt-3 mb-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-org btn-lg w-full flex justify-center gap-3"
              >
                {isLoading ? <CircularProgress size={24} /> : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
