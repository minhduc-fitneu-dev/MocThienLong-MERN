import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { postData } from "../../utils/api";
import { fetchDataFromApi } from "../../utils/api";

const AddAddress = () => {
  const context = useContext(MyContext);
  const userId = context?.userData?._id;

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(true);

  const [formFields, setFormsFields] = useState({
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: true,
    userId: userId,
  });

  useEffect(() => {
    if (context?.userData?._id) {
      setFormsFields((prev) => ({
        ...prev,
        userId: context.userData._id,
      }));
    }
  }, [context?.userData]);

  const isValidPhone = (mobile) => /^(0[0-9]{9})$/.test(mobile);

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setFormsFields((prev) => ({
      ...prev,
      status: event.target.value,
    }));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.address_line1.trim())
      return (
        context.alertBox("error", "Please enter Address Line 1"),
        setIsLoading(false)
      );

    if (!formFields.city.trim())
      return (
        context.alertBox("error", "Please enter City"), setIsLoading(false)
      );

    if (!formFields.state.trim())
      return (
        context.alertBox("error", "Please enter State"), setIsLoading(false)
      );

    if (!formFields.pincode.trim())
      return (
        context.alertBox("error", "Please enter Pincode"), setIsLoading(false)
      );

    if (!formFields.country.trim())
      return (
        context.alertBox("error", "Please enter Country"), setIsLoading(false)
      );

    if (!isValidPhone(formFields.mobile))
      return (
        context.alertBox("error", "Phone must be 10 digits and start with 0"),
        setIsLoading(false)
      );

    postData(`/api/address/add`, formFields).then((res) => {
      setIsLoading(false);

      if (!res.error) {
        context.alertBox("success", "Address added successfully!");
        context.setIsOpenFullScreenPanel({ open: false });
        // ✅ Thêm dòng này để cập nhật UI ngay
        fetchDataFromApi(`/api/address/list`).then((res) => {
          if (!res.error) context.setAddressList(res.data);
        });
      } else {
        context.alertBox("error", res.message);
      }
    });
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-8" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-2 mb-3 gap-4 w-[90%]">
            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Address Line 1
              </h3>
              <input
                type="text"
                name="address_line1"
                value={formFields.address_line1}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 p-3 text-sm rounded-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">City</h3>
              <input
                type="text"
                name="city"
                value={formFields.city}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 p-3 text-sm rounded-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 mb-3 gap-4 w-[90%]">
            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">State</h3>
              <input
                type="text"
                name="state"
                value={formFields.state}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 p-3 text-sm rounded-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Pincode
              </h3>
              <input
                type="text"
                name="pincode"
                value={formFields.pincode}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 p-3 text-sm rounded-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Country
              </h3>
              <input
                type="text"
                name="country"
                value={formFields.country}
                onChange={onChangeInput}
                className="w-full h-[40px] border border-gray-300 p-3 text-sm rounded-sm"
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">Mobile</h3>
              <TextField
                name="mobile"
                variant="outlined"
                size="small"
                fullWidth
                value={formFields.mobile}
                onChange={onChangeInput}
              />
            </div>

            <div>
              <h3 className="text-[14px] font-[500] mb-1 text-black">Status</h3>
              <Select
                value={status}
                onChange={handleChangeStatus}
                size="small"
                className="w-full"
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>
          </div>
        </div>

        <div className="w-[250px] mt-4">
          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                <FaCloudUploadAlt className="text-white text-[22px]" /> Publish
                and View
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddAddress;
