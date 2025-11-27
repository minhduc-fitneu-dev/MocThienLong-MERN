import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp } from "react-icons/io5";
import CategoryCollapse from "../../CategoryCollapse";

const CategoryPanel = ({
  isOpenCatPanel,
  setIsOpenCatPanel,
  categories = [],
}) => {
  const toggleDrawer = (newOpen) => () => {
    setIsOpenCatPanel(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      className="
        categoryPanel 
        bg-white 
        h-full 
        shadow-xl 
        overflow-y-auto 
        animate-[slideIn_0.3s_ease]
      "
    >
      {/* HEADER */}
      <div
        className="
          sticky top-0 z-50 
          bg-white 
          p-4 
          border-b 
          flex items-center justify-between
        "
      >
        <h3 className="text-[17px] font-[600] text-[#333]">
          Danh mục sản phẩm
        </h3>

        <IoCloseSharp
          onClick={toggleDrawer(false)}
          className="
            cursor-pointer 
            text-[22px] 
            text-gray-600 
            hover:text-black 
            transition-all
          "
        />
      </div>

      {/* CATEGORY TREE */}
      <div className="px-2 py-3">
        <CategoryCollapse categories={categories} />
      </div>
    </Box>
  );

  return (
    <Drawer
      open={isOpenCatPanel}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          borderRadius: "0px 12px 12px 0px",
          zIndex: 99999, // thêm dòng này
        },
      }}
      sx={{ zIndex: 99999 }} // thêm luôn cho chắc chắn
    >
      {DrawerList}
    </Drawer>
  );
};

export default CategoryPanel;
