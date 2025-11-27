// Pages/AdsBanner/index.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import { MyContext } from "../../App";
import {
  Button,
  Checkbox,
  Switch,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { fetchDataFromApi, deleteData, editData } from "../../utils/api";

const AdsBanner = () => {
  const context = useContext(MyContext);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const label = { inputProps: { "aria-label": "select-row" } };

  // Map position -> label + color
  const positionConfig = useMemo(
    () => ({
      slider: { label: "Slider chính", color: "primary" },
      side: { label: "Banner bên cạnh", color: "default" },
      both: { label: "Slider + Side", color: "success" },
    }),
    []
  );

  // ================= LOAD LIST =================
  const loadBanners = async () => {
    setLoading(true);
    const res = await fetchDataFromApi("/api/ads-banner/admin");

    if (res?.success && Array.isArray(res.data)) {
      setBanners(res.data);
    } else {
      setBanners([]);
      context.alertBox("error", res?.message || "Failed to load ads banners");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // reload khi thêm / sửa / xoá (dùng chung reloadFlag)
  useEffect(() => {
    loadBanners();
  }, [context.reloadFlag]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this ads banner?")) return;

    const res = await deleteData(`/api/ads-banner/${id}`);

    if (res?.success) {
      context.alertBox("success", "Ads banner deleted!");
      context.reloadProducts();
    } else {
      context.alertBox("error", res?.message || "Delete failed");
    }
  };

  // ================= TOGGLE ACTIVE =================
  const handleToggleActive = async (banner) => {
    const nextActive = !banner.isActive;

    // Optimistic UI
    setBanners((prev) =>
      prev.map((b) =>
        b._id === banner._id ? { ...b, isActive: nextActive } : b
      )
    );

    const res = await editData(`/api/ads-banner/${banner._id}`, {
      isActive: nextActive,
    });

    if (!res?.success) {
      // rollback nếu lỗi
      setBanners((prev) =>
        prev.map((b) =>
          b._id === banner._id ? { ...b, isActive: banner.isActive } : b
        )
      );
      context.alertBox("error", res?.message || "Update status failed");
    }
  };

  // ================= PAGINATION =================
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const columns = [
    { id: "image", label: "IMAGE", minWidth: 180 },
    { id: "content", label: "CONTENT", minWidth: 260 },
    { id: "position", label: "POSITION", minWidth: 120 },
    { id: "sortOrder", label: "ORDER", minWidth: 80 },
    { id: "active", label: "ACTIVE", minWidth: 90 },
    { id: "action", label: "ACTION", minWidth: 120 },
  ];

  return (
    <>
      {/* ========= HEADER ========= */}
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[20px] font-[600] ">
          Ads Banners
          <span className="font-[500] text-[14px] text-gray-500 ml-1">
            (Mộc Thiên Long)
          </span>
        </h2>

        <Button
          className="btn-blue !text-white btn-sm"
          onClick={() =>
            context.setIsOpenFullScreenPanel({
              open: true,
              model: "Add Ads Banner",
            })
          }
        >
          Add Ads Banner
        </Button>
      </div>

      {/* ========= TABLE ========= */}
      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={60}>
                  <Checkbox {...label} size="small" />
                </TableCell>

                {columns.map((col) => (
                  <TableCell key={col.id} width={col.minWidth}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {/* No data */}
              {!loading && banners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-8">
                    No ads banners found.
                  </TableCell>
                </TableRow>
              )}

              {banners
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => {
                  const posCfg =
                    positionConfig[item.position] || positionConfig.slider;

                  return (
                    <TableRow key={item._id} hover>
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox {...label} size="small" />
                      </TableCell>

                      {/* IMAGE */}
                      <TableCell>
                        <div className="w-[220px] rounded-md overflow-hidden group border border-gray-200">
                          <img
                            src={item?.image?.url}
                            alt={item.title || "Ads banner"}
                            className="w-full h-[90px] object-cover group-hover:scale-105 transition-all"
                          />
                        </div>
                      </TableCell>

                      {/* CONTENT */}
                      <TableCell>
                        <div className="flex flex-col gap-[4px] w-[260px]">
                          <h3 className="font-[600] text-[14px] text-gray-900 line-clamp-2">
                            {item.title || "(No title)"}
                          </h3>
                          {item.subtitle && (
                            <p className="text-[12px] text-gray-600 line-clamp-2">
                              {item.subtitle}
                            </p>
                          )}
                          {(item.price || item.buttonText) && (
                            <div className="flex items-center gap-3 mt-1">
                              {item.price && (
                                <span className="text-[13px] font-[600] text-[#eb8600]">
                                  {item.price}
                                </span>
                              )}
                              {item.buttonText && (
                                <span className="text-[11px] px-2 py-[2px] rounded-full bg-gray-100 border border-gray-200 text-gray-700">
                                  {item.buttonText}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* POSITION */}
                      <TableCell>
                        <Chip
                          label={posCfg.label}
                          color={posCfg.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      {/* SORT ORDER */}
                      <TableCell>
                        <span className="text-[13px] text-gray-800 font-[600]">
                          {item.sortOrder ?? 0}
                        </span>
                      </TableCell>

                      {/* ACTIVE SWITCH */}
                      <TableCell>
                        <Switch
                          size="small"
                          checked={!!item.isActive}
                          onChange={() => handleToggleActive(item)}
                        />
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !rounded-full hover:!bg-[#f3f3f3]"
                            onClick={() =>
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Edit Ads Banner",
                                data: item,
                              })
                            }
                          >
                            <AiOutlineEdit className="text-[18px] text-[rgba(0,0,0,0.7)]" />
                          </Button>

                          <Button
                            className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !rounded-full hover:!bg-[#f3f3f3]"
                            onClick={() => handleDelete(item._id)}
                          >
                            <GoTrash className=" text-[rgba(0,0,0,0.7)] text-[18px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          count={banners.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default AdsBanner;
