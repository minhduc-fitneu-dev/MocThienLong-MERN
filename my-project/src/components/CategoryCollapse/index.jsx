import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMinusSquare } from "react-icons/fi";
import Button from "@mui/material/Button";

const CategoryCollapse = ({ categories = [], onFilterChange }) => {
  const [openRootIndex, setOpenRootIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState(null);

  const navigate = useNavigate();

  const toggleRoot = (index) => {
    setOpenRootIndex(openRootIndex === index ? null : index);
    setOpenSubIndex(null);
  };

  const toggleSub = (index) => {
    setOpenSubIndex(openSubIndex === index ? null : index);
  };

  // ⭐ CLICK ROOT CATEGORY
  const handleRootClick = (rootId) => {
    onFilterChange({
      catId: rootId,
      subCatId: null,
      thirdSubCatId: null,
    });

    navigate(`/category/${rootId}`);
  };

  // ⭐ CLICK SUB CATEGORY
  const handleSubClick = (rootId, subId) => {
    onFilterChange({
      catId: rootId,
      subCatId: subId,
      thirdSubCatId: null,
    });

    navigate(`/category/${subId}`);
  };

  // ⭐ CLICK THIRD CATEGORY
  const handleThirdClick = (rootId, subId, thirdId) => {
    onFilterChange({
      catId: rootId,
      subCatId: subId,
      thirdSubCatId: thirdId,
    });

    navigate(`/category/${thirdId}`);
  };

  return (
    <div className="scroll">
      <ul className="w-full">
        {categories.map((cat, i) => (
          <li key={cat._id} className="list-none flex flex-col relative">
            {/* ⭐ ROOT LEVEL */}
            <Button
              onClick={() => handleRootClick(cat._id)}
              className="w-full !text-left !justify-start !px-3 !text-[17px] !text-[#d38f10]"
            >
              {cat.name}
            </Button>

            {/* ➕ / ➖ icon */}
            {cat.children?.length > 0 && (
              <>
                {openRootIndex === i ? (
                  <FiMinusSquare
                    className="absolute top-[10px] right-[15px] cursor-pointer !text-[#d38f10]"
                    onClick={() => toggleRoot(i)}
                  />
                ) : (
                  <FaRegSquarePlus
                    className="absolute top-[10px] right-[15px] cursor-pointer !text-[#d38f10]"
                    onClick={() => toggleRoot(i)}
                  />
                )}
              </>
            )}

            {/* ⭐ SUB LEVEL */}
            {openRootIndex === i && cat.children?.length > 0 && (
              <ul className="submenu w-full pl-4">
                {cat.children.map((sub, j) => (
                  <li key={sub._id} className="list-none relative">
                    <Button
                      onClick={() => handleSubClick(cat._id, sub._id)}
                      className="w-full !text-left !justify-start !px-3 !text-[16px] !text-[#794505]"
                    >
                      {sub.name}
                    </Button>

                    {/* icon */}
                    {sub.children?.length > 0 && (
                      <>
                        {openSubIndex === j ? (
                          <FiMinusSquare
                            className="absolute top-[10px] right-[15px] cursor-pointer !text-[#794505]"
                            onClick={() => toggleSub(j)}
                          />
                        ) : (
                          <FaRegSquarePlus
                            className="absolute top-[10px] right-[15px] cursor-pointer !text-[#794505]"
                            onClick={() => toggleSub(j)}
                          />
                        )}
                      </>
                    )}

                    {/* ⭐ THIRD LEVEL */}
                    {openSubIndex === j && sub.children?.length > 0 && (
                      <ul className="inner_submenu w-full pl-4">
                        {sub.children.map((third) => (
                          <li key={third._id} className="list-none mb-1">
                            <Button
                              onClick={() =>
                                handleThirdClick(cat._id, sub._id, third._id)
                              }
                              className="!text-left !justify-start !px-1 !text-[15px] !text-[#5e482b]"
                            >
                              {third.name}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryCollapse;
