import React from "react";
import "../BannerBoxV2/style.css";
import { Link } from "react-router-dom";

const BannerBoxV2 = ({ image, info = "left", title, price, categoryId }) => {
  return (
    <div className="bannerBoxV2">
      {/* IMAGE */}
      <img src={image} alt="" className="bannerImg" />

      {/* OVERLAY */}
      <div className="bannerOverlay"></div>

      {/* TEXT */}
      <div className={`bannerContent ${info === "left" ? "left" : "right"}`}>
        <h2 className="bannerTitle">{title}</h2>
        <span className="bannerPrice">{price}</span>

        {/* 👉 Luôn dẫn về category */}
        <Link
          to={categoryId ? `/category/${categoryId}` : "/"}
          className="bannerBtn"
        >
          MUA NGAY
        </Link>
      </div>
    </div>
  );
};

export default BannerBoxV2;
