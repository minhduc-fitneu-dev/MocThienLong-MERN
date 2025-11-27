import React, { useEffect, useState } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";

import ProductItem from "../../components/ProductItem";
import ProductItemListView from "../../components/ProductItemListView";

import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";

import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { fetchDataFromApi } from "../../utils/api";

const SearchPage = () => {
  const [itemView, setItemView] = useState("grid");
  const [products, setProducts] = useState([]);

  const [sort, setSort] = useState("best-seller");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [params] = useSearchParams();
  const keyword = params.get("keyword") || "";
  const urlPage = parseInt(params.get("page")) || 1;

  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  useEffect(() => {
    const loadProducts = async () => {
      const url = `/api/product/search?keyword=${keyword}&page=${page}&perPage=12&sort=${sort}`;
      const res = await fetchDataFromApi(url);

      if (!res?.error) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
      }
    };

    loadProducts();
  }, [keyword, page, sort]);

  return (
    <section className="py-5 pb-0">
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/"
            className="link transition"
          >
            Trang chủ
          </MuiLink>

          <MuiLink underline="none" color="text.primary">
            Kết quả tìm kiếm
          </MuiLink>
        </Breadcrumbs>
      </div>

      <div className="bg-white p-2 mt-4">
        <div className="container">
          {/* Bộ điều khiển layout + sort */}
          <div className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-md flex items-center justify-between">
            <div className="clo1 flex items-center itemViewActions">
              <Button
                className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                  itemView === "grid" && "active"
                }`}
                onClick={() => setItemView("grid")}
              >
                <IoGridSharp className="text-[rgba(0,0,0,0.7)]" />
              </Button>

              <Button
                className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                  itemView === "list" && "active"
                }`}
                onClick={() => setItemView("list")}
              >
                <LuMenu className="text-[rgba(0,0,0,0.7)]" />
              </Button>

              <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                Có {products.length} sản phẩm
              </span>
            </div>

            {/* SORT */}
            <div className="col2 ml-auto flex items-center gap-2">
              <span className="text-[14px] font-medium text-gray-700">
                Sắp xếp:
              </span>

              <Button
                id="sort-button"
                aria-controls={open ? "sort-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                className="!bg-white !text-[13px] !text-[#333] 
                       !border !border-gray-400 !px-4 !py-1 
                       !rounded-md hover:!border-[#d29141] hover:!text-[#d29141]"
              >
                {sort === "best-seller" && "Liên quan nhất"}
                {sort === "price-asc" && "Giá thấp → cao"}
                {sort === "price-desc" && "Giá cao → thấp"}
                {sort === "name-asc" && "Tên A → Z"}
                {sort === "name-desc" && "Tên Z → A"}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setSort("best-seller");
                    setAnchorEl(null);
                  }}
                >
                  Liên quan nhất
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setSort("price-asc");
                    setAnchorEl(null);
                  }}
                >
                  Giá thấp → cao
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setSort("price-desc");
                    setAnchorEl(null);
                  }}
                >
                  Giá cao → thấp
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setSort("name-asc");
                    setAnchorEl(null);
                  }}
                >
                  Tên A → Z
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setSort("name-desc");
                    setAnchorEl(null);
                  }}
                >
                  Tên Z → A
                </MenuItem>
              </Menu>
            </div>
          </div>

          {/* Grid sản phẩm */}
          <div
            className={`grid ${
              itemView === "grid"
                ? "grid-cols-4 md:grid-cols-4"
                : "grid-cols-1 md:grid-cols-1"
            } gap-4`}
          >
            {products.map((item) =>
              itemView === "grid" ? (
                <ProductItem key={item._id} data={item} />
              ) : (
                <ProductItemListView key={item._id} data={item} />
              )
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-10">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => {
                setPage(value);
                window.history.pushState(
                  null,
                  "",
                  `/search?keyword=${keyword}&page=${value}`
                );
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              showFirstButton
              showLastButton
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
