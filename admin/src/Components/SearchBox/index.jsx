import React from "react";
import { IoSearch } from "react-icons/io5";

const SearchBox = ({ value, onChange }) => {
  return (
    <div className="w-full h-auto bg-[#f1f1f1] relative overflow-hidden">
      <IoSearch className="absolute top-[13px] left-[10px] z-50 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full h-[40px] border border-[rgba(0,0,0,0.1)] bg-[#f1f1f1] p-2 pl-8 
        focus:outline-none focus:border-[rgba(0,0,0,0.5)] 
        rounded-md text-[13px]"
        placeholder="Search here..."
      />
    </div>
  );
};
export default SearchBox;
