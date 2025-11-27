// src/components/AddAddressPopup/index.jsx (hoặc file hiện tại)

import React, { useContext, useState } from "react";
import { MyContext } from "../../App";
import { postData, fetchDataFromApi } from "../../utils/api";
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Button from "@mui/material/Button";

const AddAddressPopup = () => {
  const { setIsAddAddressPopupOpen, setAddressList, openAlertBox } =
    useContext(MyContext);

  const [form, setForm] = useState({
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: true,
  });

  const [loading, setLoading] = useState(false);

  const isValidPhone = (mobile) => /^(0[0-9]{9})$/.test(mobile);

  const onChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();

    if (!isValidPhone(form.mobile)) {
      openAlertBox(
        "error",
        "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0."
      );
      return;
    }

    setLoading(true);
    const res = await postData(`/api/address/add`, form);

    if (!res.error) {
      openAlertBox("success", "Thêm địa chỉ thành công!");
      setIsAddAddressPopupOpen(false);

      const data = await fetchDataFromApi(`/api/address/list`);
      if (!data.error) setAddressList(data.data);
    } else {
      openAlertBox("error", res.message || "Không thể thêm địa chỉ.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex justify-center items-center px-3">
      <div className="bg-white w-[500px] rounded-lg shadow-xl p-6 animate-fadeIn relative border border-gray-200">
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={() => setIsAddAddressPopupOpen(false)}
        >
          <IoCloseSharp size={22} />
        </button>

        <div className="flex justify-center mb-4">
          <HiOutlineLocationMarker className="text-[#eb8600] text-4xl" />
        </div>

        <h2 className="text-center text-xl font-semibold mb-4 text-[#333]">
          Thêm địa chỉ mới
        </h2>

        <form onSubmit={submit} className="space-y-3">
          <input
            className="addr-input"
            name="address_line1"
            placeholder="Địa chỉ (số nhà, đường...)"
            onChange={onChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="addr-input"
              name="city"
              placeholder="Thành phố / Thị xã"
              onChange={onChange}
              required
            />
            <input
              className="addr-input"
              name="state"
              placeholder="Quận / Huyện"
              onChange={onChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              className="addr-input"
              name="pincode"
              placeholder="Mã bưu chính"
              onChange={onChange}
              required
            />
            <input
              className="addr-input"
              name="country"
              placeholder="Quốc gia"
              onChange={onChange}
              required
            />
          </div>

          <input
            className="addr-input"
            name="mobile"
            placeholder="Số điện thoại"
            onChange={onChange}
            required
          />

          <div className="flex gap-3 mt-4 text-sm">
            <Button
              type="submit"
              className="w-full !py-2 !bg-[#eb8600] !text-white hover:!bg-[#d87100]"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu địa chỉ"}
            </Button>
            <Button
              type="button"
              className="w-full !py-2 !border !border-[#eb8600] !text-[#eb8600] hover:!bg-[#fff6ed]"
              onClick={() => setIsAddAddressPopupOpen(false)}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .addr-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
        }
        .addr-input:focus {
          border-color: #eb8600;
          box-shadow: 0 0 0 2px rgba(235, 134, 0, 0.2);
        }
        .animate-fadeIn {
          animation: fadeIn .25s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AddAddressPopup;
