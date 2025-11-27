import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import ProductItem from "../../components/ProductItem";
import ProductItemListView from "../../components/ProductItemListView";

import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";

import { useParams, Link as RouterLink } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const ProductListing = () => {
  const [itemView, setItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [sort, setSort] = useState("best-seller");

  const { id: categoryId } = useParams();

  const [categoryPath, setCategoryPath] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ⭐ FILTER STATE nhận từ Sidebar
  const [filters, setFilters] = useState({});

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // ====================== FIND PATH TRONG CATEGORY TREE ======================
  const findPathInTree = (nodes, targetId, path = []) => {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (String(node._id) === String(targetId)) return newPath;

      if (node.children?.length > 0) {
        const childPath = findPathInTree(node.children, targetId, newPath);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  // ====================== RESET PAGE KHI ĐỔI CATEGORY ======================
  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  // ====================== LOAD CATEGORY PATH ======================
  useEffect(() => {
    const loadPath = async () => {
      if (!categoryId) return setCategoryPath([]);

      const res = await fetchDataFromApi("/api/category");
      if (!res?.error && Array.isArray(res.data)) {
        const path = findPathInTree(res.data, categoryId);
        setCategoryPath(path || []);
      } else {
        setCategoryPath([]);
      }
    };
    loadPath();
  }, [categoryId]);
  // ====================== LOAD PRODUCTS (CORE FIXED LOGIC) ======================
  useEffect(() => {
    const loadProducts = async () => {
      let query = [];

      // --- Dùng filters từ Sidebar nếu có ---
      let finalCatId = filters.catId ?? null;
      let finalSubCatId = filters.subCatId ?? null;
      let finalThirdSubCatId = filters.thirdSubCatId ?? null;

      // --- Chỉ suy ra từ categoryPath khi Sidebar KHÔNG gửi filter ---
      if (!filters.catId && categoryPath.length > 0) {
        if (categoryPath.length === 1) {
          finalCatId = categoryPath[0]._id;
          finalSubCatId = null;
          finalThirdSubCatId = null;
        }

        if (categoryPath.length === 2) {
          finalCatId = categoryPath[0]._id;
          finalSubCatId = categoryPath[1]._id;
          finalThirdSubCatId = null;
        }

        if (categoryPath.length === 3) {
          finalCatId = categoryPath[0]._id;
          finalSubCatId = categoryPath[1]._id;
          finalThirdSubCatId = categoryPath[2]._id;
        }
      }

      // Trường hợp fallback
      if (!finalCatId && categoryId) finalCatId = categoryId;

      // --- Build query ---
      if (finalCatId) query.push(`catId=${finalCatId}`);
      if (finalSubCatId) query.push(`subCatId=${finalSubCatId}`);
      if (finalThirdSubCatId) query.push(`thirdSubCatId=${finalThirdSubCatId}`);

      if (filters.price) {
        query.push(`minPrice=${filters.price.min}`);
        query.push(`maxPrice=${filters.price.max}`);
      }

      if (filters.rating) {
        query.push(`minRating=${filters.rating.min}`);
        query.push(`maxRating=${filters.rating.max}`);
      }

      query.push(`page=${page}`);
      query.push(`perPage=12`);
      query.push(`sort=${sort}`);

      const url = `/api/product/getAllProductsByRating?${query.join("&")}`;
      const res = await fetchDataFromApi(url);

      if (res?.error) {
        setProducts([]);
        setTotalPages(1);
        return;
      }

      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
    };

    loadProducts();
  }, [categoryId, categoryPath, page, filters, sort]);

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

          {(!categoryId || categoryPath.length === 0) && (
            <MuiLink
              underline="hover"
              color="text.primary"
              component={RouterLink}
              to="/productListing"
              className="link transition"
            >
              Sản phẩm
            </MuiLink>
          )}

          {categoryPath.map((cat, index) => {
            const isLast = index === categoryPath.length - 1;
            return (
              <MuiLink
                key={cat._id}
                component={RouterLink}
                to={`/category/${cat._id}`}
                underline={isLast ? "none" : "hover"}
                color={isLast ? "text.primary" : "inherit"}
                className="link transition"
              >
                {cat.name}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      </div>

      <div className="bg-white p-2 mt-4">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <Sidebar onFilterChange={setFilters} />
          </div>

          <div className="rightContent w-[80%] py-3">
            {/* Bộ điều khiển layout + sort */}
            <div className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-md flex items-center justify-between">
              <div className="clo1 flex items-center itemViewActions">
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === "grid" && "active"
                  }`}
                >
                  <IoGridSharp
                    className="text-[rgba(0,0,0,0.7)]"
                    onClick={() => setItemView("grid")}
                  />
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
                  Có tất cả {products.length} sản phẩm
                </span>
              </div>

              <div className="col2 ml-auto flex items-center gap-2">
                <span className="text-[14px] font-medium text-gray-700">
                  Sắp xếp:
                </span>

                <Button
                  id="sort-button"
                  aria-controls={open ? "sort-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!bg-white !text-[13px] !text-[#333] !capitalize !border !border-gray-400 
               !px-4 !py-1 !rounded-md hover:!border-[#d29141] hover:!text-[#d29141]"
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
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "sort-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setSort("price-asc");
                      handleClose();
                    }}
                  >
                    Giá thấp → cao
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setSort("price-desc");
                      handleClose();
                    }}
                  >
                    Giá cao → thấp
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setSort("best-seller");
                      handleClose();
                    }}
                  >
                    Liên quan nhất
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setSort("name-asc");
                      handleClose();
                    }}
                  >
                    Tên A → Z
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setSort("name-desc");
                      handleClose();
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
                onChange={(e, value) => setPage(value)}
                showFirstButton
                showLastButton
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
