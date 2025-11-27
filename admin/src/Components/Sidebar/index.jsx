import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import Button from "@mui/material/Button";
import { FaRegImages } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { IoBagCheck } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { Collapse } from "react-collapse";
import { MyContext } from "../../App";

const Sidebar = () => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const isOpenSubMenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  const context = useContext(MyContext);
  return (
    <>
      <div
        className={`sidebar fixed top-0 left-0 bg-[#fff] h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-4 w-[${
          context.isSidebarOpen === true ? "18%" : "0px"
        }]`}
      >
        <div className="py-2 w-full">
          <Link to="/">
            <img
              src="/public/logo-moc.png"
              className="w-[250x]"
            />
          </Link>
        </div>

        <ul className="mt-4">
          <li>
            <Link to="/">
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                <RxDashboard className="text-[20px]" />
                <span>Dashboard</span>
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(1)}
            >
              <FaRegImages className="text-[20px]" />
              <span>Home Slides</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                {" "}
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 1 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 1 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link to="/homeSlider/list">
                    <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[600] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Home Banners List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[600] !pl-9 flex gap-3"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Home Slide",
                      })
                    }
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                    Add Home Banner Slide
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>
          {/* ==================== ADS BANNER ==================== */}
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] 
               !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 
               hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(2)}
            >
              <FaRegImages className="text-[20px]" />
              <span>Ads Banner</span>

              {/* Icon mở rộng */}
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 2 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 2}>
              <ul className="w-full">
                {/* LIST */}
                <li className="w-full">
                  <Link to="/ads-banner">
                    <Button
                      className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start 
                             !w-full !text-[13px] !font-[600] !pl-9 flex gap-3"
                    >
                      <span
                        className="block w-[5px] h-[5px] rounded-full 
                             bg-[rgba(0,0,0,0.3)]"
                      ></span>
                      Ads Banner List
                    </Button>
                  </Link>
                </li>

                {/* ADD */}
                <li className="w-full">
                  <Button
                    className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start 
                     !w-full !text-[13px] !font-[600] !pl-9 flex gap-3"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Ads Banner",
                      })
                    }
                  >
                    <span
                      className="block w-[5px] h-[5px] rounded-full 
                           bg-[rgba(0,0,0,0.3)]"
                    ></span>
                    Add Ads Banner
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Link to="/users">
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                <FaUsers className="text-[20px]" />
                <span>Users</span>
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(3)}
            >
              <FaProductHunt className="text-[20px]" />
              <span>Products</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                {" "}
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 3 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 3 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link to="/products">
                    <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[600] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Product List
                    </Button>
                  </Link>
                </li>

                <li className="w-full">
                  <Button
                    className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 flex gap-3"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Product",
                      })
                    }
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    Product Upload
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(4)}
            >
              <MdOutlineCategory className="text-[20px]" />
              <span>Category</span>
              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                {" "}
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 4 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>
            <Collapse isOpened={submenuIndex === 4 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link to="/category/list">
                    <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[600] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Category List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[600] !pl-9 flex gap-3"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add New Category",
                      })
                    }
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                    Add a Category
                  </Button>
                </li>
                <li className="w-full">
                  <Link to="/subCategory/list">
                    <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[600] !pl-9 flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Sub Category List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start w-full !text-[13px] !font-[600] !pl-9 flex gap-3"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add New Sub Category",
                      })
                    }
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                    Add Sub Category
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Link to="/orders">
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1] ">
                <IoBagCheck className="text-[20px]" />
                <span>Orders</span>
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] 
        !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(5)}
            >
              <FaRegImages className="text-[20px]" />
              <span>Blogs</span>

              <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`transition-all ${
                    submenuIndex === 5 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 5}>
              <ul className="w-full">
                {/* BLOG LIST */}
                <li className="w-full">
                  <Link to="/blogs">
                    <Button
                      className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start 
                 !w-full !text-[13px] !font-[600] !pl-9 flex gap-3"
                    >
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                      Blog List
                    </Button>
                  </Link>
                </li>

                {/* ADD BLOG */}
                <li className="w-full">
                  <Button
                    className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start 
               !w-full !text-[13px] !font-[600] !pl-9 flex gap-3"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Blog",
                      })
                    }
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.3)]"></span>
                    Add Blog
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>

          <li>
            <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
              <IoMdLogOut className="text-[20px]" />
              <span>Logout</span>
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Sidebar;
