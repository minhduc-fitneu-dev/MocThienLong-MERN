import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaEyeSlash, FaRegEye, FaRegUser } from "react-icons/fa6";
import SendIcon from "@mui/icons-material/Send";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import OtpBox from "../../Components/OtpBox";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();

  const handleOtpChange = (value) => {
    setOtp(value);
  };
  const verityOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      context.alertBox("error", "Please enter OTP");
      return;
    }

    setIsLoading(true);

    const email = localStorage.getItem("userEmail");
    const actionType = localStorage.getItem("actionType");

    try {
      if (actionType !== "forgot-password") {
        // ✅ VERIFY FOR SIGNUP
        const res = await postData(`/api/user/verifyEmail`, { email, otp });

        if (res?.error === false) {
          context.alertBox(
            "success",
            res?.message || "Account verified successfully!"
          );
          localStorage.removeItem("userEmail");
          localStorage.removeItem("actionType");
          history("/login"); // ✅ chuyển về login như m muốn
        } else {
          context.alertBox("error", res?.message || "Invalid OTP");
        }
      } else {
        // ✅ VERIFY FOR FORGOT PASSWORD
        const res = await postData(`/api/user/verify-forgot-password-otp`, {
          email,
          otp,
        });

        if (res?.error === false) {
          context.alertBox("success", "OTP verified!");
          history("/change-password");
        } else {
          context.alertBox("error", res?.message || "Invalid OTP");
        }
      }
    } catch (err) {
      context.alertBox("error", "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white w-full h-[100vh] ">
      <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50">
        <Link to="/">
          <img src="logo-moc.png" className="w-[200px]" alt="Logo" />
        </Link>

        <div className="flex items-center gap-8">
          <NavLink to="/login" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <CgLogIn className="text-[18px]" /> Login
            </Button>
          </NavLink>

          <NavLink to="/sign-up" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <FaRegUser className="text-[15px]" /> Sign Up
            </Button>
          </NavLink>
        </div>
      </header>

      <img
        src="/patern.webp"
        className="w-full fixed top-0 left-0 opacity-5"
        alt=""
      />

      <div className="loginBox card w-[600px] pb-52 h-[auto] mx-auto pt-20 relative z-50">
        <div className="text-center">
          <img src="/verify1.png" className="w-[100px] m-auto" alt="verify" />
        </div>

        <h1 className="text-center text-[35px] font-[800] mt-4 mb-4">
          Welcome Back!
          <br />
          <span className="text-primary">Please Verify Your Account.</span>
        </h1>

        <p className="text-center text-[15px]">
          OTP sent to &nbsp;
          <span className="text-primary font-bold">
            {localStorage.getItem("userEmail")}
          </span>
        </p>

        <br />
        <form onSubmit={verityOTP}>
          <div className="text-center flex items-center justify-center flex-col">
            <OtpBox length={6} onChange={handleOtpChange} />
          </div>

          <br />

          <div className="w-[300px] m-auto">
            <Button
              type="submit"
              className="btn-blue w-full"
              disabled={isLoading || otp.trim().length !== 6}
            >
              {isLoading ? <CircularProgress color="inherit" /> : "Verify OTP"}
            </Button>
          </div>
        </form>

        <br />
      </div>
    </section>
  );
};

export default VerifyAccount;
