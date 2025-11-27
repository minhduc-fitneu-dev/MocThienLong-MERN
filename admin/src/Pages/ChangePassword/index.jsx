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
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const ChangePassword = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isPasswordShow2, setIsPasswordShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormsFields] = useState({
    email: localStorage.getItem("userEmail"),
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword === "") {
      context.alertBox("error", "Please enter confirm password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.alertBox(
        "error",
        "New password and confirm password must be same"
      );
      setIsLoading(false);
      return false;
    }

    postData(`/api/user/reset-password`, formFields).then((res) => {
      console.log(res);
      if (res?.error === false) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        context.alertBox("success", res?.message);
        setIsLoading(false);
        history("/login");
      } else {
        context.alertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <section className="bg-white w-full ">
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
          <img src="/icon.svg" className="m-auto" alt="Icon" />
        </div>

        <h1 className="text-center text-[35px] font-[800] mt-4">
          Welcome Back!
          <br />
          <span className="text-primary">
            You can change your password from here.
          </span>
        </h1>

        <br />

        <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">New Password</h4>
            <div className="relative w-full">
              <input
                type={isPasswordShow ? "text" : "password"}
                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                   focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                placeholder="Password"
                name="newPassword"
                value={formFields.newPassword}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />

              <Button
                type="button"
                className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px]
                   !min-w-[35px] !text-gray-600 flex items-center justify-center"
                onClick={() => setIsPasswordShow((prev) => !prev)}
                aria-label={isPasswordShow ? "Hide password" : "Show password"}
              >
                {isPasswordShow ? (
                  <FaEyeSlash className="text-[18px]" />
                ) : (
                  <FaRegEye className="text-[18px]" />
                )}
              </Button>
            </div>
          </div>

          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Confirm Password</h4>
            <div className="relative w-full">
              <input
                type={isPasswordShow2 ? "text" : "password"}
                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                   focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                placeholder="Password"
                name="confirmPassword"
                value={formFields.confirmPassword}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />

              <Button
                type="button"
                className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px]
                   !min-w-[35px] !text-gray-600 flex items-center justify-center"
                onClick={() => setIsPasswordShow2((prev) => !prev)}
                aria-label={isPasswordShow2 ? "Hide password" : "Show password"}
              >
                {isPasswordShow2 ? (
                  <FaEyeSlash className="text-[18px]" />
                ) : (
                  <FaRegEye className="text-[18px]" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              isLoading ||
              formFields.newPassword.trim() === "" ||
              formFields.confirmPassword.trim() === ""
            }
            className="btn-blue btn-lg w-full"
          >
            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
