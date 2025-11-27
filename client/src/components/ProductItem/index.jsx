import React, { useContext } from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdZoomOutMap } from "react-icons/md";
import { MyContext } from "../../App";

const ProductItem = ({ data }) => {
  const context = useContext(MyContext);

  const img1 = data?.images?.[0]?.url || "/no-image.png";
  const img2 = data?.images?.[1]?.url || img1;

  const shortDesc =
    data?.description?.length > 45
      ? data.description.slice(0, 45) + "..."
      : data?.description;

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <Link to={`/product/${data._id}`}>
          <img src={img1} className="main-img" alt="" />
          <img src={img2} className="hover-img" alt="" />
        </Link>

        {data.discount > 0 && (
          <span className="badge-discount">-{data.discount}%</span>
        )}

        <div className="product-actions">
          <Button
            className="action-btn"
            onClick={() => {
              context.setCurrentProduct(data); // 👈 Lưu sản phẩm
              context.setOpenProductDetailsModal(true); // 👈 Mở modal
            }}
          >
            <MdZoomOutMap />
          </Button>


          <Button
            className="action-btn"
            onClick={() => {
              if (!context.isLogin) {
                return context.openAlertBox(
                  "error",
                  "Bạn cần đăng nhập để lưu sản phẩm."
                );
              }
              context.toggleMyList(data._id);
            }}
          >
            <FaRegHeart />
          </Button>
        </div>
      </div>

      <div className="product-info">
        <Link to={`/product/${data._id}`} className="product-name">
          {data.name}
        </Link>

        <p className="product-desc">{shortDesc}</p>

        <Rating
          name="size-small"
          value={data.rating || 0}
          size="small"
          readOnly
        />

        <div className="product-price">
          {data.oldPrice > 0 && (
            <span className="old-price">{data.oldPrice.toLocaleString()}đ</span>
          )}

          <span className="new-price">{data.price.toLocaleString()}đ</span>
        </div>

        {/* ⭐ BUTTON THÊM VÀO GIỎ HÀNG ⭐ */}
        <Button
          className="add-cart-btn"
          onClick={() => context.addToCart(data)}
        >
          Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
