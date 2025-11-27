import React, { useContext, useState } from "react";
import { MyContext } from "../../App";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { Button } from "@mui/material"; // ✅ Thêm import

const SubCategoryList = () => {
  const context = useContext(MyContext);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Render tree UI (recursive)
  const renderTree = (list, level = 0) => {
    return list.map((cat) => {
      const isExpandable = cat.children && cat.children.length > 0;
      const isOpen = expanded[cat._id];

      return (
        <div key={cat._id} className="border-b border-gray-100">
          <div
            className="flex items-center py-2 px-3 hover:bg-gray-50 transition cursor-pointer"
            style={{ paddingLeft: `${level * 22 + 10}px` }}
          >
            {isExpandable ? (
              <Button
                size="small"
                className="!min-w-[28px] !text-gray-600 !text-xs"
                onClick={() => toggleExpand(cat._id)}
              >
                {isOpen ? "▼" : "▶"}
              </Button>
            ) : (
              <span className="w-[15px] mr-2" />
            )}

            <span className="font-medium text-gray-800">{cat.name}</span>

            {/* Label cấp */}
            <span className="ml-2 text-[11px] px-2 py-[1px] rounded-full bg-gray-200 text-gray-600">
              {level === 0 ? "Root" : level === 1 ? "Sub" : "Third"}
            </span>

            <div className="ml-auto flex items-center gap-2">
              {/* Edit Button */}
              <Button
                size="small"
                className="!w-[30px] !h-[30px] !rounded-full border border-gray-300 !p-0 !min-w-[30px] hover:bg-gray-200"
                onClick={() =>
                  context.setIsOpenFullScreenPanel({
                    open: true,
                    model: "Edit Sub Category",
                    id: cat._id,
                  })
                }
              >
                <AiOutlineEdit size={15} />
              </Button>

              {/* Delete Button */}
              <Button
                size="small"
                className="!w-[30px] !h-[30px] !rounded-full border border-gray-300 !p-0 !min-w-[30px] hover:bg-red-100 !text-red-600"
                onClick={() => context.deleteSubCategory(cat._id)}
              >
                <GoTrash size={14} />
              </Button>
            </div>
          </div>

          {/* Render children */}
          {isOpen && cat.children && cat.children.length > 0 && (
            <div>{renderTree(cat.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-[600]">Sub Category List</h2>

        <Button
          variant="contained"
          className="btn-blue !text-white"
          onClick={() =>
            context.setIsOpenFullScreenPanel({
              open: true,
              model: "Add New Sub Category",
            })
          }
        >
          ADD NEW SUB CATEGORY
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        {Array.isArray(context.categoryData) &&
        context.categoryData.length > 0 ? (
          renderTree(context.categoryData)
        ) : (
          <p className="text-center py-6 text-gray-500">No Categories Found</p>
        )}
      </div>
    </div>
  );
};

export default SubCategoryList;
