import React, { useContext, useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import Progress from "../../Components/Progress";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import {
  fetchDataFromApi,
  deleteData,
  deleteMultipleData,
} from "../../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  MenuItem,
  Button,
  Checkbox,
} from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaRegEye } from "react-icons/fa";

const Products = () => {
  const context = useContext(MyContext);

  // ========================= STATES =========================
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [backendTotal, setBackendTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedThird, setSelectedThird] = useState("");

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedProducts, setSelectedProducts] = useState([]);

  // ========================= DEBOUNCE SEARCH =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  // ========================= RESET MULTI-SELECT =========================
  useEffect(() => {
    setSelectedProducts([]);
  }, [
    page,
    debouncedSearch,
    selectedCat,
    selectedSub,
    selectedThird,
    products,
  ]);

  // ========================= GET PRODUCTS (WITH BACKEND PAGINATION) =========================
  const getProducts = async () => {
    try {
      const apiPage = page + 1;

      const url = `/api/product/getAllProducts?page=${apiPage}&perPage=${rowsPerPage}`;
      const res = await fetchDataFromApi(url);

      if (Array.isArray(res?.data)) {
        setProducts(res.data);
        setBackendTotal(res.totalPages * rowsPerPage);
      } else {
        setProducts([]);
        setBackendTotal(0);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setProducts([]);
    }
  };
  // Khi đổi page hoặc rowsPerPage mà không filter thì gọi API phân trang
  useEffect(() => {
    if (!selectedCat && !selectedSub && !selectedThird) {
      getProducts();
    }
  }, [page, rowsPerPage]);

  // ========================= AUTO RELOAD AFTER ADD/EDIT =========================
  useEffect(() => {
    if (!context.isOpenFullScreenPanel?.open) {
      setPage(0);
      getProducts();
    }
  }, [context.reloadFlag, context.isOpenFullScreenPanel?.open]);

  // ========================= FILTER CATEGORY / SUB / THIRD =========================
  useEffect(() => {
    setPage(0);

    async function fetchFilteredProducts() {
      if (!selectedCat && !selectedSub && !selectedThird) {
        getProducts();
        return;
      }

      let url = "";
      if (selectedThird)
        url = `/api/product/getAllProductsByThirdSubCatId/${selectedThird}`;
      else if (selectedSub)
        url = `/api/product/getAllProductsBySubCatId/${selectedSub}`;
      else url = `/api/product/getAllProductsByCatId/${selectedCat}`;

      const res = await fetchDataFromApi(url);

      if (Array.isArray(res?.products)) {
        setProducts(res.products);
        setBackendTotal(res.products.length);
      } else {
        setProducts([]);
        setBackendTotal(0);
      }
    }

    fetchFilteredProducts();
  }, [selectedCat, selectedSub, selectedThird]);

  // ========================= CATEGORY MAPPING =========================
  const { catNameById, subNameById, thirdNameById } = useMemo(() => {
    const catMap = {};
    const subMap = {};
    const thirdMap = {};

    (context?.categoryData || []).forEach((cat) => {
      catMap[cat._id] = cat.name;

      (cat.children || []).forEach((sub) => {
        subMap[sub._id] = sub.name;

        (sub.children || []).forEach((third) => {
          thirdMap[third._id] = third.name;
        });
      });
    });

    return {
      catNameById: catMap,
      subNameById: subMap,
      thirdNameById: thirdMap,
    };
  }, [context.categoryData]);

  // ========================= SEARCH FILTER (FE SIDE) =========================
  const visibleProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return products;

    const s = debouncedSearch.trim().toLowerCase();
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(s) ||
        (p.brand || "").toLowerCase().includes(s) ||
        (p.catName || "").toLowerCase().includes(s) ||
        (p.subCat || "").toLowerCase().includes(s) ||
        (p.thirdSubCat || "").toLowerCase().includes(s)
    );
  }, [products, debouncedSearch]);

  // ========================= MULTI SELECT =========================
  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageIds = visibleProducts.map((p) => p._id);

    const allSelected = currentPageIds.every((id) =>
      selectedProducts.includes(id)
    );

    if (allSelected) {
      setSelectedProducts((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedProducts((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  // ========================= DELETE FUNCTIONS =========================
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) return;

    const res = await deleteData(`/api/product/${id}`);
    if (res?.success) {
      context.alertBox("success", "Product deleted!");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      context.reloadProducts();
    }
  };

  const handleDeleteMultiple = async () => {
    if (!window.confirm("Bạn chắc muốn xóa các sản phẩm đã chọn?")) return;

    const res = await deleteMultipleData("/api/product/deleteMultiple", {
      ids: selectedProducts,
    });

    if (res?.success) {
      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p._id))
      );
      setSelectedProducts([]);
      context.reloadProducts();
      context.alertBox("success", "Xóa thành công!");
    }
  };

  // ========================= CATEGORY TREE =========================
  const subCategories =
    context.categoryData?.find((c) => c._id === selectedCat)?.children || [];

  const thirdCategories =
    subCategories.find((s) => s._id === selectedSub)?.children || [];

  // ========================= TABLE COLUMNS =========================
  const columns = [
    { id: "product", label: "PRODUCT" },
    { id: "category", label: "CATEGORY" },
    { id: "subcategory", label: "SUB CATEGORY" },
    { id: "price", label: "PRICE" },
    { id: "sales", label: "SALES & STOCK" },
    { id: "rating", label: "RATING" },
    { id: "action", label: "ACTION" },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[20px] font-[600]">
         Sản phẩm{" "}
          <span className="text-gray-500 font-[500] text-[14px]">
            (Mộc Thiên Long)
          </span>
        </h2>

        <div className="flex items-center gap-3 ml-auto">
          <Button className="btn !bg-green-500 !text-white btn-sm">
            Export
          </Button>

          <Button
            className="btn-blue !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              })
            }
          >
            <IoMdAdd className="mr-2" /> Add Product
          </Button>

          <Button
            disabled={selectedProducts.length === 0}
            onClick={handleDeleteMultiple}
            className="btn !bg-red-500 !text-white btn-sm"
          >
            Delete Selected ({selectedProducts.length})
          </Button>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="card my-4 shadow-md bg-white sm:rounded-lg">
        {/* FILTERS */}
        <div className="flex items-center w-full px-4 py-4 pb-7 gap-6">
          {/* Category */}
          <div className="w-[18%]">
            <h4 className="font-[700] text-[14px] pb-2">Category</h4>
            <Select
              size="small"
              className="w-full"
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value);
                setSelectedSub("");
                setSelectedThird("");
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {context.categoryData?.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Sub Category */}
          <div className="w-[18%]">
            <h4 className="font-[700] text-[14px] pb-2">Sub Category</h4>
            <Select
              size="small"
              disabled={!subCategories.length}
              className="w-full"
              value={selectedSub}
              onChange={(e) => {
                setSelectedSub(e.target.value);
                setSelectedThird("");
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {subCategories.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Third Category */}
          <div className="w-[18%]">
            <h4 className="font-[700] text-[14px] pb-2">Third Category</h4>
            <Select
              size="small"
              disabled={!thirdCategories.length}
              className="w-full"
              value={selectedThird}
              onChange={(e) => setSelectedThird(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {thirdCategories.map((third) => (
                <MenuItem key={third._id} value={third._id}>
                  {third.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Search */}
          <div className="w-[22%] ml-auto">
            <SearchBox
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    size="small"
                    checked={
                      visibleProducts.length > 0 &&
                      visibleProducts.every((p) =>
                        selectedProducts.includes(p._id)
                      )
                    }
                    onChange={toggleSelectAll}
                  />
                </TableCell>

                {columns.map((col) => (
                  <TableCell key={col.id}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-10">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                visibleProducts.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Checkbox
                        size="small"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleSelectProduct(product._id)}
                      />
                    </TableCell>

                    {/* IMAGE + NAME */}
                    <TableCell>
                      <div className="flex items-center gap-4 w-[300px]">
                        <div className="w-[65px] h-[65px] rounded-md overflow-hidden border border-gray-200">
                          <LazyLoadImage
                            alt={product.name}
                            effect="blur"
                            className="w-full h-full object-cover"
                            src={
                              product?.images?.[0]?.url ||
                              "https://via.placeholder.com/150?text=No+Image"
                            }
                          />
                        </div>
                        <div className="info w-[75%]">
                          <h3 className="font-[600] text-[13px] leading-4 hover:text-primary">
                            {product.name}
                          </h3>
                          <span className="text-[12px] text-gray-500">
                            {product.brand || "Mộc Thiên Long"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* CATEGORY */}
                    <TableCell>
                      {catNameById[product.catId] || product.catName || "—"}
                    </TableCell>

                    {/* SUB CATEGORY */}
                    <TableCell>
                      {subNameById[product.subCatId] || product.subCat || "—"}
                    </TableCell>

                    {/* PRICE */}
                    <TableCell>
                      <div className="flex flex-col">
                        {product.oldPrice > 0 && (
                          <span className="line-through text-gray-500 text-[13px]">
                            {product.oldPrice.toLocaleString()}₫
                          </span>
                        )}
                        <span className="text-primary text-[14px] font-[600]">
                          {Number(product.price || 0).toLocaleString()}₫
                        </span>
                      </div>
                    </TableCell>

                    {/* SALES & STOCK */}
                    <TableCell>
                      {(() => {
                        const sold = Number(product.sales || 0);
                        const stock = Number(product.countInStock || 0);

                        const soldPercent =
                          stock > 0 ? Math.min((sold / stock) * 100, 100) : 0;

                        return (
                          <div className="flex flex-col gap-[4px] w-[120px]">
                            <div className="flex justify-between text-[12px] text-gray-600">
                              <span>Sold:</span>
                              <span className="font-[600] text-blue-600">
                                {sold}
                              </span>
                            </div>
                            <div className="flex justify-between text-[12px] text-gray-600">
                              <span>Stock:</span>
                              <span
                                className={`font-[600] ${
                                  stock - sold <= 0
                                    ? "text-red-600"
                                    : "text-green-700"
                                }`}
                              >
                                {Math.max(stock - sold, 0)}
                              </span>
                            </div>
                            <Progress
                              value={soldPercent}
                              type={soldPercent >= 100 ? "success" : "warning"}
                            />
                          </div>
                        );
                      })()}
                    </TableCell>

                    {/* RATING */}
                    <TableCell>
                      <>
                        <p className="text-[13px] mb-1">
                          ⭐ {Number(product.rating || 0).toFixed(1)}
                        </p>
                        <Progress
                          value={Math.min(
                            Number(product.rating || 0) * 20,
                            100
                          )}
                          type="success"
                        />
                      </>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex items-center gap-0">
                        <Button
                          className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                          onClick={() => {
                            context.setEditProductData(product);
                            context.setEditProductId(product._id);
                            context.setIsOpenFullScreenPanel({
                              open: true,
                              model: "Edit Product",
                            });
                          }}
                        >
                          <AiOutlineEdit className="text-[18px] text-gray-700" />
                        </Button>

                        <Button
                          className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                          onClick={() => {
                            context.setViewProductData(product);
                            context.setIsOpenFullScreenPanel({
                              open: true,
                              model: "View Product",
                            });
                          }}
                          style={{ minWidth: 30 }}
                        >
                          <FaRegEye className="text-[17px] text-gray-700" />
                        </Button>

                        <Button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                          style={{ minWidth: 30 }}
                        >
                          <GoTrash className="text-[16px] text-gray-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={
            selectedCat || selectedSub || selectedThird
              ? visibleProducts.length
              : backendTotal
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </div>
    </>
  );
};

export default Products;
