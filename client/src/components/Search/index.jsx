import React, { useState, useEffect, useRef } from "react";
import "../Search/style.css";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showBox, setShowBox] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (keyword.trim().length > 1) {
        loadSuggestions(keyword.trim());
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword]);

  // Gọi API autocomplete
  const loadSuggestions = async (kw) => {
    const res = await fetchDataFromApi(
      `/api/product/autocomplete?keyword=${encodeURIComponent(kw)}`
    );

    if (!res?.error) {
      setSuggestions(res.products || []);
      setShowBox(true);
    }
  };

  // Click ngoài để đóng box
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowBox(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}&page=1`);
    setShowBox(false);
  };

  return (
    <div className="relative w-[100%]" ref={wrapperRef}>
      <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <Button
          className="!absolute top-[8px] right-[5px] z-50 !w-[37px] !min-w-[37px] h-[35px] !rounded-full"
          onClick={handleSearch}
        >
          <IoSearch className="!text-[#2a2a2a] text-[22px]" />
        </Button>
      </div>

      {/* AUTOCOMPLETE BOX */}
      {showBox && suggestions.length > 0 && (
        <div className="absolute top-[52px] left-0 w-full bg-white shadow-md rounded-md max-h-[350px] overflow-auto z-50">
          {suggestions.map((item) => (
            <div
              key={item._id}
              className="flex items-center p-2 gap-3 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                navigate(`/product/${item._id}`);
                setShowBox(false);
              }}
            >
              <img
                src={item.images?.[0]?.url || "/no-image.png"}
                alt=""
                className="w-[45px] h-[45px] object-cover rounded"
              />
              <div className="flex flex-col">
                <span className="font-medium text-[14px]">{item.name}</span>
                <span className="text-[#c2783c] font-semibold text-[14px]">
                  {item.price.toLocaleString()}đ
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
