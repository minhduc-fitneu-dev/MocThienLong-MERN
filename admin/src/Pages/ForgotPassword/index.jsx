import { Button } from "@mui/material";
import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      context.alertBox("error", "Please enter your email");
      return;
    }

    const res = await postData("/api/user/forgot-password", { email });

    if (res?.error === false) {
      context.alertBox("success", "OTP sent to your email!");

      // ✅ Lưu email vào localStorage để verify OTP
      localStorage.setItem("userEmail", email);
      localStorage.setItem("actionType", "forgot-password");

      navigate("/verify-account");
    } else {
      context.alertBox("error", res?.message || "Something went wrong");
    }
  };

  return (
    <section className="bg-white w-full h-[100vh]">
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
          <img src="/logo-moc.png" className="m-auto" alt="Icon" />
        </div>

        <h1 className="text-center text-[35px] font-[800] mt-4">
          Having trouble to sign in?
          <br />
          <span className="text-primary">Reset your password.</span>
        </h1>
        <br />

        <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Email</h4>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[45px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                 focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
            />
          </div>

          <Button type="submit" className="btn-blue btn-lg w-full">
            Reset Password
          </Button>

          <br />
          <br />
          <div className="text-center flex items-center justify-center gap-4">
            <span>Don't want to reset?</span>
            <Link
              to="/login"
              className="text-primary font-[700] text-[15px] hover:underline hover:text-gray-700"
            >
              Sign In?
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
