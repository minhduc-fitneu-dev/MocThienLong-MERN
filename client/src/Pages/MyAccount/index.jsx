import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import AccountSidebar from "../../components/AccountSidebar";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { editData, fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import { FiLock } from "react-icons/fi";

const MyAccount = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isChangePasswordFormShow, setIsChangePasswordFormShow] =
    useState(false);

  const [formFields, setFormsFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isValidPhone = (mobile) => /^(0[0-9]{9})$/.test(mobile);

  // 🟩 Fill thông tin user vào form
  useEffect(() => {
    if (context?.userData) {
      setFormsFields({
        name: context.userData.name || "",
        email: context.userData.email || "",
        mobile: context.userData.mobile || "",
      });

      setChangePassword((prev) => ({
        ...prev,
        email: context.userData.email,
      }));
    }
  }, [context?.userData]);

  // 🟩 Nếu chưa login → về home
  useEffect(() => {
    if (!context.isLogin) navigate("/", { replace: true });
  }, [context.isLogin, navigate]);

  if (!context.isLogin || !context.userData) return null;

  // 🟧 Change input
  const onChangeInput = (e) => {
    const { name, value } = e.target;

    // Form chính
    if (name === "name" || name === "mobile") {
      setFormsFields((prev) => ({ ...prev, [name]: value }));
    }

    // Change password form
    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  // 🟩 Update profile
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name.trim()) {
      context.openAlertBox("error", "Please enter your name");
      return setIsLoading(false);
    }

    if (!isValidPhone(formFields.mobile)) {
      context.openAlertBox(
        "error",
        "Invalid phone number — must be 10 digits and start with 0"
      );
      return setIsLoading(false);
    }

    editData(`/api/user/update`, formFields).then((res) => {
      setIsLoading(false);

      if (res?.error) return context.openAlertBox("error", res.message);

      context.openAlertBox("success", "Profile updated successfully!");

      // Lấy lại user data
      fetchDataFromApi(`/api/user/user-details`).then((data) => {
        if (data?.data) context.setUserData(data.data);
      });
    });
  };

  // 🟩 Change password
  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    const isGoogleUser = context.userData?.signUpWithGoogle;

    // Disable oldPassword requirement for Google users
    if (!isGoogleUser && !changePassword.oldPassword.trim()) {
      context.openAlertBox("error", "Please enter old password");
      return setIsLoading2(false);
    }

    if (!changePassword.newPassword.trim()) {
      context.openAlertBox("error", "Please enter new password");
      return setIsLoading2(false);
    }

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      context.openAlertBox(
        "error",
        "Password and confirm password do not match"
      );
      return setIsLoading2(false);
    }

    postData(`/api/user/reset-password`, {
      ...changePassword,
      googleChangePassword: isGoogleUser,
    }).then((res) => {
      setIsLoading2(false);

      if (res?.error) return context.openAlertBox("error", res.message);

      context.openAlertBox("success", res.message);

      // Sau khi đổi thành công → user có password mới → không còn Google-only nữa
      context.setUserData({
        ...context.userData,
        signUpWithGoogle: false,
      });

      // Reset form password
      setChangePassword({
        email: context.userData.email,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsChangePasswordFormShow(false);
    });
  };

  return (
    <section className="py-10 w-full">
      <div className="container flex gap-5">
        <div className="col1 w-[20%]">
          <AccountSidebar />
        </div>

        <div className="col2 w-[50%]">
          <div className="card bg-white p-5 shadow-md rounded-md">
            <div className="flex items-center pb-3">
              <h2>My Profile</h2>

              <Button
                onClick={() =>
                  setIsChangePasswordFormShow(!isChangePasswordFormShow)
                }
                className="!ml-auto flex items-center gap-2 !normal-case !text-[14px] !font-medium border border-gray-300 !text-[#eb8600] !bg-white !px-4 !py-2 !rounded-lg hover:!bg-gray-100 hover:shadow-sm transition-all duration-200"
              >
                <FiLock className="text-[16px]" />
                CHANGE PASSWORD
              </Button>
            </div>

            <hr />

            {/* 🟩 PROFILE FORM */}
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="flex items-center gap-5">
                <TextField
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  value={formFields.name}
                  onChange={onChangeInput}
                  disabled={isLoading}
                />

                <TextField
                  label="Email"
                  name="email"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  value={formFields.email}
                  disabled
                />
              </div>

              <div className="flex items-center mt-4 gap-5">
                <TextField
                  label="Phone Number"
                  name="mobile"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  value={formFields.mobile}
                  onChange={onChangeInput}
                  disabled={isLoading}
                />
              </div>

              <br />

              <Button type="submit" className="btn-org btn-sm w-[150px]">
                {isLoading ? <CircularProgress size={22} /> : "Update Profile"}
              </Button>
            </form>
          </div>

          {/* 🟩 CHANGE PASSWORD FORM */}
          <Collapse in={isChangePasswordFormShow}>
            <div className="card bg-white mt-5 p-5 shadow-md rounded-md">
              <h2 className="pb-3">Change Password</h2>
              <hr />

              <form className="mt-5" onSubmit={handleSubmitChangePassword}>
                <div className="flex items-center gap-5">
                  {/* ẨN OLD PASSWORD nếu là Google user */}
                  {!context.userData?.signUpWithGoogle && (
                    <TextField
                      label="Old Password"
                      name="oldPassword"
                      variant="outlined"
                      size="small"
                      type="password"
                      className="w-full"
                      value={changePassword.oldPassword}
                      onChange={onChangeInput}
                      disabled={isLoading2}
                    />
                  )}

                  <TextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    value={changePassword.newPassword}
                    onChange={onChangeInput}
                  />
                </div>

                <div className="flex items-center mt-4 gap-5">
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    value={changePassword.confirmPassword}
                    onChange={onChangeInput}
                  />
                </div>

                <br />

                <Button type="submit" className="btn-org btn-sm w-[200px]">
                  {isLoading2 ? (
                    <CircularProgress size={22} />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </div>
          </Collapse>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
