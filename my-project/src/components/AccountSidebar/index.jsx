import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaRegHeart, FaRegUser } from "react-icons/fa";
import { IoBagCheckSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { editData, fetchDataFromApi } from "../../utils/api";
import { LuMapPinCheck } from "react-icons/lu";

const AccountSidebar = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ✅ Hiển thị avatar ban đầu
  useEffect(() => {
    if (context?.userData?.avatar) {
      setPreviews([context.userData.avatar]);
    } else {
      setPreviews([]);
    }
  }, [context?.userData]);

  const onChangeFile = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
      ) {
        setUploading(false);
        context.openAlertBox(
          "error",
          "Please select a valid JPG, PNG, WEBP image."
        );
        return;
      }

      const formdata = new FormData();
      formdata.append("avatar", file);

      const res = await editData(`/api/user/user-avatar`, formdata);

      setUploading(false);

      if (res?.error) {
        context.openAlertBox("error", res.message);
        return;
      }

      // ✅ Cập nhật avatar mới vào UI
      setPreviews([res.user?.avatar]);
      context.setUserData(res.user);

      context.openAlertBox("success", "Avatar updated successfully!");
    } catch (error) {
      setUploading(false);
      context.openAlertBox("error", "Something went wrong!");
    }
  };

  // ✅ Logout đúng chuẩn
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    context.setIsLogin(false);
    context.setUserData(null);

    navigate("/", { replace: true });
    context.openAlertBox("success", "Logged out successfully!");
  };

  return (
    <div className="card bg-white shadow-md rounded-md sticky top-[10px]">
      <div className="w-full p-3 flex items-center justify-center flex-col">
        <div className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group flex items-center justify-center bg-gray-200">
          {uploading ? (
            <CircularProgress color="inherit" />
          ) : previews.length > 0 ? (
            <img src={previews[0]} className="w-full h-full object-cover" />
          ) : (
            <img src="/user.png" className="w-full h-full object-cover" />
          )}

          {/* Upload Overlay */}
          <div className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
            <FaCloudUploadAlt className="text-[#fff] text-[25px]" />
            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0"
              accept="image/*"
              onChange={onChangeFile}
            />
          </div>
        </div>

        <h3>{context?.userData?.name}</h3>
        <h6 className="text-[13px] font-[500]">{context?.userData?.email}</h6>
      </div>

      {/* Menu */}
      <ul className="list-none pb-5 bg-[#f1f1f1] myAccountTabs">
        <li className="w-full">
          <NavLink to="/my-account">
            <Button className="w-full !py-2 !text-left !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <FaRegUser className="text-[15px]" /> My Profile
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/address">
            <Button className="w-full !py-2 !text-left !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <LuMapPinCheck className="text-[15px]" /> My Address
            </Button>
          </NavLink>
        </li>

        <li className="w-full">
          <NavLink to="/my-list">
            <Button className="w-full !py-2 !text-left !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <FaRegHeart className="text-[15px]" /> My List
            </Button>
          </NavLink>
        </li>

        <li className="w-full">
          <NavLink to="/my-orders">
            <Button className="w-full !py-2 !text-left !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
              <IoBagCheckSharp className="text-[15px]" /> My Order
            </Button>
          </NavLink>
        </li>

        <li className="w-full">
          <Button
            onClick={logout}
            className="w-full !py-2 !text-left !px-5 !justify-start !capitalize !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2"
          >
            <MdLogout className="text-[15px]" /> Logout
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default AccountSidebar;
