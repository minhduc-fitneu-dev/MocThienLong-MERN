import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import {
  editData,
  postData,
  fetchDataFromApi,
  deleteData,
} from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Collapse } from "react-collapse";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";

const Profile = () => {
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

  // ✅ Fill dữ liệu user
  // ✅ Fill dữ liệu user + tự đồng bộ nếu thiếu
  useEffect(() => {
    if (context?.userData) {
      setFormsFields({
        name: context.userData.name || "",
        email: context.userData.email || "",
        mobile: context.userData.mobile || "",
      });

      // ✅ Nếu thiếu mobile (hoặc name), fetch lại user-details
      if (!context.userData.mobile || !context.userData.name) {
        fetchDataFromApi(`/api/user/user-details`).then((res) => {
          if (res?.data) context.setUserData(res.data);
        });
      }

      // ✅ Lấy danh sách địa chỉ nếu có user id
      if (context?.userData?._id) {
        fetchDataFromApi(`/api/address/list`).then((res) => {
          if (!res.error) context.setAddressList(res.data);
        });
      }

      // ✅ Cập nhật email cho form đổi mật khẩu
      setChangePassword((prev) => ({
        ...prev,
        email: context.userData.email,
      }));
    }
  }, [context?.userData]);

  // ✅ Không login → out
  useEffect(() => {
    // ⏳ Chờ xác thực xong mới kiểm tra login
    if (!context.loadingUser && context.isLogin === false) {
      navigate("/", { replace: true });
    }
  }, [context.isLogin, context.loadingUser, navigate]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit Update Profile
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name.trim()) {
      context.alertBox("error", "Please enter your name");
      return setIsLoading(false);
    }

    if (!isValidPhone(formFields.mobile)) {
      context.alertBox(
        "error",
        "Phone number must be 10 digits and start with 0"
      );
      return setIsLoading(false);
    }

    editData(`/api/user/update`, formFields).then((res) => {
      setIsLoading(false);

      if (res?.error) return context.alertBox("error", res.message);

      context.alertBox("success", "Profile updated successfully!");

      fetchDataFromApi(`/api/user/user-details`).then((data) => {
        if (data?.data) context.setUserData(data.data);
      });
    });
  };

  // ✅ Submit Change Password
  const onChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (!changePassword.oldPassword.trim())
      return (
        context.alertBox("error", "Enter old password"), setIsLoading2(false)
      );

    if (!changePassword.newPassword.trim())
      return (
        context.alertBox("error", "Enter new password"), setIsLoading2(false)
      );

    if (changePassword.newPassword !== changePassword.confirmPassword)
      return (
        context.alertBox("error", "Passwords do not match"),
        setIsLoading2(false)
      );

    postData(`/api/user/reset-password`, changePassword).then((res) => {
      setIsLoading2(false);

      if (res?.error) return context.alertBox("error", res.message);

      context.alertBox("success", res.message);

      setChangePassword({
        email: context.userData.email,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsChangePasswordFormShow(false);
    });
  };
  const handleSetDefault = (id) => {
    postData(`/api/address/set-default`, { addressId: id }).then((res) => {
      if (!res.error) {
        context.alertBox("success", "Default address updated!");
        context.setAddressList(res.data); // ✅ cập nhật UI ngay
      } else {
        context.alertBox("error", res.message);
      }
    });
  };

  const handleDeleteAddress = (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    deleteData(`/api/address/delete/${id}`).then((res) => {
      if (!res.error) {
        context.alertBox("success", "Address deleted!");
        setAddressList((prev) => prev.filter((item) => item._id !== id));
      } else {
        context.alertBox("error", res.message);
      }
    });
  };

  // ✅ Avatar
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { addressList, setAddressList } = context;

  useEffect(() => {
    if (context?.userData?.avatar) setPreviews([context.userData.avatar]);
  }, [context?.userData]);

  const onChangeFile = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      if (
        !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file.type
        )
      ) {
        setUploading(false);
        return context.alertBox("error", "Invalid image format");
      }

      const formdata = new FormData();
      formdata.append("avatar", file);

      // ✅ Gửi kèm FormData
      const res = await editData("/api/user/user-avatar", formdata, true);

      setUploading(false);

      if (res?.error) return context.alertBox("error", res.message);

      setPreviews([res.user.avatar]);
      context.setUserData(res.user);
      context.alertBox("success", "Avatar updated!");
    } catch {
      setUploading(false);
      context.alertBox("error", "Upload failed!");
    }
  };

  return (
    <div className="card my-4 w-[60%] pt-5 shadow-md sm:rounded-lg bg-white px-5 pb-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-[600]">User Profile</h2>

        <Button
          className="ml-auto"
          onClick={() => setIsChangePasswordFormShow(!isChangePasswordFormShow)}
        >
          Change Password
        </Button>
      </div>
      <hr />
      <br />

      {/* Avatar */}
      <div className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group flex items-center justify-center bg-gray-200">
        {uploading ? (
          <CircularProgress color="inherit" />
        ) : previews.length > 0 ? (
          <img src={previews[0]} className="w-full h-full object-cover" />
        ) : (
          <img src="/user.png" className="w-full h-full object-cover" />
        )}

        <div className="overlay w-full h-full absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
          <FaCloudUploadAlt className="text-white text-[25px]" />
          <input
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0"
            accept="image/*"
            onChange={onChangeFile}
          />
        </div>
      </div>

      {/* Info Form */}
      <form className="form mt-8" onSubmit={handleSubmit}>
        <div className="flex items-center gap-5">
          <div className="w-[50%] mt-4">
            <input
              type="text"
              className=" w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              name="name"
              value={formFields.name}
              onChange={onChangeInput}
            />
          </div>
          <div className="w-[50%] mt-4">
            <input
              type="text"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              name="email"
              value={formFields.email}
              disabled
            />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-[48.7%] mt-4">
            <input
              type="text"
              className="w-full h-[40px] border border-gray-300 rounded-sm p-3 text-sm"
              placeholder="Phone number"
              name="mobile"
              value={formFields.mobile}
              onChange={onChangeInput}
            />
          </div>
        </div>

        <br />
        <div
          className="flex items-center justify-center p-5 border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer"
          onClick={() =>
            context.setIsOpenFullScreenPanel({
              open: true,
              model: "Add New Address",
            })
          }
        >
          <span className="text-[14px] font-[500]">Add Address</span>
        </div>
        {/* Address List */}
        <div className="mt-6">
          <h3 className="text-[16px] font-[600] mb-3">Saved Addresses</h3>

          {addressList.length === 0 && (
            <p className="text-gray-500 text-sm">No addresses yet.</p>
          )}

          {addressList.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-md mb-3 bg-white shadow-sm flex justify-between items-start hover:shadow-md transition-all"
            >
              <div className="flex gap-3">
                <HiOutlineLocationMarker className="text-blue-500 text-xl mt-1" />

                <div>
                  <p className="font-[600] text-[15px]">{item.address_line1}</p>
                  <p className="text-sm text-gray-600">
                    {item.city}, {item.state}, {item.country} - {item.pincode}
                  </p>
                  <p className="text-sm text-gray-600">📞 {item.mobile}</p>

                  {item.isDefault ? (
                    <span className="flex items-center text-green-600 text-xs font-[600] mt-1">
                      <FaStar className="mr-1" /> Default Address
                    </span>
                  ) : (
                    <button
                      className="flex items-center text-blue-600 text-xs mt-1 hover:underline"
                      onClick={() => handleSetDefault(item._id)}
                    >
                      <FaRegStar className="mr-1" /> Set as Default
                    </button>
                  )}
                </div>
              </div>

              <button
                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                onClick={() => handleDeleteAddress(item._id)}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center mt-4 gap-4">
          <Button type="submit" className="btn-blue btn-lg w-full">
            {isLoading ? <CircularProgress size={22} /> : "Update Profile"}
          </Button>
        </div>
      </form>

      {/* Change Password */}
      <Collapse isOpened={isChangePasswordFormShow}>
        <div className="my-6">
          <hr className="border-gray-300" />
        </div>

        <h3 className="text-[18px] font-[600] mb-3">Change Password</h3>

        <form onSubmit={handleSubmitChangePassword} className="space-y-3">
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-gray-500"
            value={changePassword.oldPassword}
            onChange={onChangePasswordInput}
            disabled={isLoading2}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-gray-500"
            value={changePassword.newPassword}
            onChange={onChangePasswordInput}
            disabled={isLoading2}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-gray-500"
            value={changePassword.confirmPassword}
            onChange={onChangePasswordInput}
            disabled={isLoading2}
          />

          <Button type="submit" className="btn-blue w-full">
            {isLoading2 ? <CircularProgress size={22} /> : "Change Password"}
          </Button>
        </form>
      </Collapse>
    </div>
  );
};

export default Profile;
