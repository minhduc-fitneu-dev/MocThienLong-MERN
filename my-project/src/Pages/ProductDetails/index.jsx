import Breadcrumbs from "@mui/material/Breadcrumbs";
import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductZoom } from "../../components/ProductZoom";
import { MyContext } from "../../App";
import ProductsSlider from "../../components/ProductsSlider";
import { ProductDetailsComponent } from "../../components/ProductDetails";
import { fetchDataFromApi } from "../../utils/api";

export const ProductDetails = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // ⭐ LOAD SẢN PHẨM LIÊN QUAN (ĐÃ TỐI ƯU)
  const loadRelatedProducts = async (product) => {
    try {
      let related = [];

      // 1. ưu tiên cùng thirdSubCatId
      if (product.thirdSubCatId) {
        const res = await fetchDataFromApi(
          `/api/product/getAllProductsByThirdSubCatId/${product.thirdSubCatId}`
        );

        if (res?.products?.length > 0) {
          related = res.products.filter((p) => p._id !== product._id);
        }
      }

      // 2. nếu còn thiếu → lấy thêm cùng subCatId
      if (product.subCatId) {
        const subRes = await fetchDataFromApi(
          `/api/product/getAllProductsBySubCatId/${product.subCatId}`
        );

        if (subRes?.products?.length > 0) {
          const filtered = subRes.products.filter(
            (p) =>
              p._id !== product._id &&
              !related.some((item) => item._id === p._id)
          );
          related = [...related, ...filtered];
        }
      }

      setRelatedProducts(related);
    } catch (err) {
      console.error("Error loading related products:", err);
      setRelatedProducts([]);
    }
  };

  // ⭐ LOAD SẢN PHẨM HIỆN TẠI
  useEffect(() => {
    const loadProduct = async () => {
      const res = await fetchDataFromApi(`/api/product/get/${id}`);

      if (!res?.error && res.product) {
        setProduct(res.product);
        await loadRelatedProducts(res.product);
      } else {
        setProduct(null);
        setRelatedProducts([]);
      }
    };
    loadProduct();
  }, [id]);

  if (!product)
    return <div className="container py-10">Đang tải sản phẩm...</div>;

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link className="link transition" to="/">
              Trang chủ
            </Link>
            <Link className="link transition" to="/">
              Sản phẩm
            </Link>
            <span className="text-gray-600">{product.name}</span>
          </Breadcrumbs>
        </div>
      </div>

      <section className="bg-white py-5">
        <div className="container flex gap-8 items-start">
          {/* LEFT IMAGE */}
          <div className="productZoomContainer w-[40%]">
            <ProductZoom images={product.images} />
          </div>

          {/* RIGHT CONTENT */}
          <div className="productContent w-[60%] pr-10 pl-10">
            <ProductDetailsComponent data={product} />
          </div>
        </div>

        {/* TAB MÔ TẢ */}
        <div className="container pt-10">
          <div className="flex items-center gap-8 mb-5">
            <span
              className={`link text-[17px] cursor-pointer font-[500] ${
                activeTab === 0 && "text-[#eb8600]"
              }`}
              onClick={() => setActiveTab(0)}
            >
              Mô tả
            </span>

            <span
              className={`link text-[17px] cursor-pointer font-[500] ${
                activeTab === 1 && "text-[#eb8600]"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Chi tiết sản phẩm
            </span>
          </div>

          {activeTab === 0 && (
            <div className="shadow-md w-full py-5 px-8 rounded-md">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 1 && (
            <div className="shadow-md w-full py-5 px-8 rounded-md">
              <p>
                <b>Chất liệu:</b> {product.material}
              </p>
              <p>
                <b>Kích thước:</b> {product.size}
              </p>
              <p>
                <b>Màu sắc:</b> {product.color}
              </p>
            </div>
          )}
        </div>

        {/* SẢN PHẨM LIÊN QUAN */}
        <div className="container pt-12 pb-10">
          <h2 className="text-[22px] font-[700] mb-4 text-[#d29141] tracking-wide flex items-center gap-3">
            <span className="w-2 h-6 bg-[#d29141] rounded-full"></span>
            Sản phẩm liên quan
          </h2>

          <ProductsSlider items={5} data={relatedProducts} />
        </div>
      </section>
    </>
  );
};
