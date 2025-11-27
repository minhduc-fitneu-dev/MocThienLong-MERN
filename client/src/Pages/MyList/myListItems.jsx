import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { deleteData } from "../../utils/api";

const MyListItems = ({ data }) => {
  const context = useContext(MyContext);

  const product = data.productId;
  const img = product?.images?.[0]?.url || "/no-image.png";

  // Xoá item
  const removeItem = async () => {
    const res = await deleteData(`/api/myList/${data._id}`);
    if (res?.success) {
      context.openAlertBox("success", "Đã xoá khỏi danh sách!");
      context.refreshMyList();
    } else {
      context.openAlertBox("error", res?.message || "Không thể xoá.");
    }
  };

  return (
    <div
      className="
      group 
      w-full 
      p-4 
      flex 
      items-center 
      gap-5
      transition-all 
      hover:bg-[#fafafa]
    "
    >
      {/* IMAGE */}
      <div className="w-[15%] rounded-md overflow-hidden shadow-sm">
        <Link to={`/product/${product._id}`} className="block">
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </Link>
      </div>

      {/* INFO */}
      <div className="w-[85%] relative">
        {/* DELETE ICON */}
        <IoCloseSharp
          className="
            cursor-pointer 
            absolute 
            top-[0] 
            right-[0] 
            text-[22px] 
            text-gray-500 
            hover:text-red-500 
            transition 
            duration-200 
            hover:scale-125
          "
          onClick={removeItem}
        />

        <span className="text-[13px] text-gray-500">{product.brand}</span>

        <h3 className="text-[16px] font-[600] mt-1">
          <Link
            className="hover:text-[#eb8600] transition"
            to={`/product/${product._id}`}
          >
            {product.name}
          </Link>
        </h3>

        <Rating
          name="size-small"
          value={product.rating || 0}
          size="small"
          readOnly
        />

        {/* PRICES */}
        <div className="flex items-center gap-4 mt-2 mb-2">
          <span className="text-[16px] text-black font-[700]">
            {product.price.toLocaleString()}đ
          </span>

          {product.oldPrice > 0 && (
            <span className="text-gray-500 text-[14px] line-through">
              {product.oldPrice.toLocaleString()}đ
            </span>
          )}

          {product.discount > 0 && (
            <span className="text-[#eb8600] text-[14px] font-[600]">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* ADD TO CART */}
        <Button
          className="
            btn-org 
            btn-sm
            !py-[6px]
            !px-4
            !rounded-md
            !text-white
            !bg-[#eb8600]
            hover:!bg-[#d67300]
            transition-all
          "
          onClick={() => context.addToCart(product)}
        >
          Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default MyListItems;
