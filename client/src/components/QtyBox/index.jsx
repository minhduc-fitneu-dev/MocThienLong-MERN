import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import "../QtyBox/style.css";

export const QtyBox = ({ value = 1, onChange }) => {
  const [qtyVal, setQtyVal] = useState(value);

  // 🔥 Mỗi khi qty thay đổi → gửi lên parent
  useEffect(() => {
    if (onChange) onChange(qtyVal);
  }, [qtyVal]);

  const plusQty = () => {
    setQtyVal((prev) => prev + 1);
  };

  const minusQty = () => {
    setQtyVal((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="qtyBox flex items-center relative">
      <input
        type="number"
        className="w-full h-[40px] p-2 text-[15px] focus:outline-none border
         border-[rgba(0,0,0,0.1)] rounded-md"
        value={qtyVal}
        readOnly // để tránh tự nhập số gây lỗi
      />

      <div className="flex items-center flex-col justify-between h-[40px] absolute top-0 right-0 z-50">
        <Button
          className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]"
          onClick={plusQty}
        >
          <FaAngleUp className="text-[12px] opacity-55" />
        </Button>

        <Button
          className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]"
          onClick={minusQty}
        >
          <FaAngleDown className="text-[12px] opacity-55" />
        </Button>
      </div>
    </div>
  );
};
