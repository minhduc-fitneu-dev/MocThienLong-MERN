import React, { useContext, useEffect, useState } from "react";
import AccountSidebar from "../../components/AccountSidebar";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData, deleteData } from "../../utils/api";
import { FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Button from "@mui/material/Button";

const Address = () => {
  const context = useContext(MyContext);
  const { addressList, setAddressList } = context;

  useEffect(() => {
    fetchDataFromApi(`/api/address/list`).then((res) => {
      if (!res.error) setAddressList(res.data);
    });
  }, []);

  const handleSetDefault = (id) => {
    postData(`/api/address/set-default`, { addressId: id }).then((res) => {
      if (!res.error) {
        context.openAlertBox("success", "Default address updated!");
        fetchDataFromApi(`/api/address/list`).then((data) =>
          setAddressList(data.data)
        );
      }
    });
  };

  const handleDeleteAddress = (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    deleteData(`/api/address/delete/${id}`).then((res) => {
      if (!res.error) {
        context.openAlertBox("success", "Address deleted!");

        // ✅ Update list từ server trả về
        setAddressList(res.data);
      } else {
        context.openAlertBox("error", res.message);
      }
    });
  };

  const openAddAddressPopup = () => {
    context.setIsAddAddressPopupOpen(true);
  };

  return (
    <section className="py-10 w-full">
      <div className="container flex gap-5">
        <div className="col1 w-[20%]">
          <AccountSidebar />
        </div>

        <div className="col2 w-[50%]">
          <div className="card bg-white p-5 shadow-md rounded-md">
            <div className="flex items-center pb-3 justify-between">
              <h2 className="text-[18px] font-[600]">My Addresses</h2>
              <Button onClick={openAddAddressPopup} className="btn-org btn-sm">
                + Add Address
              </Button>
            </div>

            <hr />

            <div className="mt-5">
              {addressList.length === 0 && (
                <p className="text-gray-500">No saved addresses yet.</p>
              )}

              {addressList.map((item) => (
                <div
                  key={item._id}
                  className="border p-4 rounded-md mb-3 bg-white shadow-sm flex justify-between items-start hover:shadow-md transition-all"
                >
                  <div className="flex gap-3">
                    <HiOutlineLocationMarker className="text-blue-500 text-xl mt-1" />

                    <div>
                      <p className="font-[600] text-[15px]">
                        {item.address_line1}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.city}, {item.state}, {item.country} -{" "}
                        {item.pincode}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Address;
