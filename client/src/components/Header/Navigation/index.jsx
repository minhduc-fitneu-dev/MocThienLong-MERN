// components/Header/Nav/index.jsx
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";
import "../Navigation/style.css";
import { fetchDataFromApi } from "../../../utils/api";
const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);

  // ✅ state lưu tree category từ backend
  const [categories, setCategories] = useState([]);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  };

  // ✅ lấy category tree 1 lần khi load header
  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchDataFromApi("/api/category");
      if (!res?.error && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        console.error("Failed to load categories", res?.message);
      }
    };

    loadCategories();
  }, []);

  // ---- helper render submenu con (recursive nhẹ) ----
  const renderChildrenMenu = (children) => {
    if (!children || children.length === 0) return null;

    return (
      <div className="submenu absolute top-[120%] left-[0%] min-w-[200px] bg-white shadow-md opacity-0 transition-all">
        <ul>
          {children.map((child) => (
            <li
              key={child._id}
              className="list-none w-full relative group/submenu"
            >
              <Link to={`/category/${child._id}`} className="w-full">
                <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none hover:!bg-[#f7f7f7]">
                  {child.name}
                </Button>
              </Link>

              {/* nếu còn cấp con nữa thì lồng tiếp */}
              {child.children && child.children.length > 0 && (
                <div className="submenu absolute top-[0%] left-[100%] min-w-[200px] bg-white shadow-md opacity-0 transition-all">
                  <ul>
                    {child.children.map((subChild) => (
                      <li
                        key={subChild._id}
                        className="list-none w-full group/submenu2"
                      >
                        <Link
                          to={`/category/${subChild._id}`}
                          className="w-full"
                        >
                          <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none hover:!bg-[#f7f7f7]">
                            {subChild.name}
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-white z-[999] shadow-sm">
        <div className="container flex items-center justify-end gap-6">
          {/* CỘT 1: NÚT OPEN CATEGORY PANEL */}
          <div className="col_1 w-[18%]">
            <Button
              className="!text-black gap-6 w-full"
              onClick={openCategoryPanel}
            >
              <RiMenu2Line className="text-[18px]" />
              DANH MỤC
              <LiaAngleDownSolid className="text-[13px] ml-auto font-bold" />
            </Button>
          </div>

          {/* CỘT 2: NAV MAIN */}
          <div className="col_2 w-[60%] ">
            <ul className="flex items-center gap-4 nav">
              {/* Trang chủ */}
              <li className="list-none">
                <Link to="/" className="link transiton text-[14px] font-[500]">
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#eb8600] !py-4">
                    Trang chủ
                  </Button>
                </Link>
              </li>

              {/* ✅ DYNAMIC ROOT CATEGORIES */}
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className={`list-none relative ${
                    cat.children && cat.children.length > 0 ? "has-submenu" : ""
                  }`}
                >
                  <Link
                    to={`/category/${cat._id}`}
                    className="link transiton text-[14px] font-[500]"
                  >
                    <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#eb8600] !py-4">
                      {cat.name}
                    </Button>
                  </Link>

                  {/* Nếu có con thì render dropdown */}
                  {cat.children &&
                    cat.children.length > 0 &&
                    renderChildrenMenu(cat.children)}
                </li>
              ))}

              {/* Các menu tĩnh khác */}
              <li className="list-none">
                <Link
                  to="/about"
                  className="link transiton text-[14px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#eb8600] !py-4">
                    Về chúng tôi
                  </Button>
                </Link>
              </li>

              <li className="list-none">
                <Link
                  to="/blogs"
                  className="link transiton text-[14px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#eb8600] !py-4">
                    Bài viết
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: THÔNG TIN SHIP */}
          <div className="col_3 w-[20%]">
            <p className="text-[14px] font-[500] flex items-center gap-3 mb-0 mt-0">
              <GoRocket className="text-[18px]" />
              Miễn phí vận chuyển toàn quốc
            </p>
          </div>
        </div>
      </nav>

      {/* ✅ Truyền categories cho CategoryPanel */}
      <CategoryPanel
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel}
        categories={categories}
      />
    </>
  );
};

export default Navigation;
