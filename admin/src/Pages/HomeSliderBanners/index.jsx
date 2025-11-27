import React, { useContext, useEffect, useState } from "react";
import { Button, Checkbox } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MyContext } from "../../App";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { fetchDataFromApi, deleteData } from "../../utils/api";

const HomeSliderBanners = () => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const context = useContext(MyContext);

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // -------------------------------
  // LOAD SLIDES
  // -------------------------------
  const loadSlides = () => {
    setLoading(true);
    fetchDataFromApi("/api/homeslider/all").then((res) => {
      if (res?.success) {
        setSlides(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSlides();
  }, []);

  // 🔥 Khi thêm / sửa → reloadFlag đổi → tự load lại
  useEffect(() => {
    loadSlides();
  }, [context.reloadFlag]);

  // -------------------------------
  // DELETE SLIDE
  // -------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this slide?")) return;

    const res = await deleteData(`/api/homeslider/${id}`);

    if (res?.success) {
      context.alertBox("success", "Slide deleted!");
      context.reloadProducts(); // reloadFlag++
    } else {
      context.alertBox("error", res?.message || "Delete failed");
    }
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const columns = [
    { id: "image", label: "IMAGE", minWidth: 250 },
    { id: "action", label: "ACTION", minWidth: 100 },
  ];

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[20px] font-[600] ">
          Home Slider Banners
          <span className="font-[500] text-[14px]"> (Material UI Table)</span>
        </h2>

        <Button
          className="btn-blue !text-white btn-sm"
          onClick={() =>
            context.setIsOpenFullScreenPanel({
              open: true,
              model: "Add Home Slide",
            })
          }
        >
          Add Home Slide
        </Button>
      </div>

      {/* TABLE */}
      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <TableContainer sx={{ maxHeight: 440 }}>
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
              {/* No Data */}
              {!loading && slides.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No slides found
                  </TableCell>
                </TableRow>
              )}

              {slides
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((slide) => (
                  <TableRow key={slide._id}>
                    <TableCell>
                      <Checkbox {...label} size="small" />
                    </TableCell>

                    {/* IMAGE */}
                    <TableCell width={300}>
                      <div className="flex items-center gap-4 w-[300px]">
                        <div className="img w-full rounded-md overflow-hidden group">
                          <img
                            src={slide?.image?.url}
                            alt=""
                            className="w-full h-[100px] object-cover group-hover:scale-105 transition-all"
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* ACTION */}
                    <TableCell width={100}>
                      <div className="flex items-center gap-2">
                        {/* EDIT */}
                        <Button
                          className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !rounded-full hover:!bg-[#f3f3f3]"
                          onClick={() =>
                            context.setIsOpenFullScreenPanel({
                              open: true,
                              model: "Edit Home Slide",
                              data: slide, // truyền dữ liệu sang form edit
                            })
                          }
                        >
                          <AiOutlineEdit className="text-[18px] text-[rgba(0,0,0,0.7)]" />
                        </Button>

                        {/* DELETE */}
                        <Button
                          className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !rounded-full hover:!bg-[#f3f3f3]"
                          onClick={() => handleDelete(slide._id)}
                        >
                          <GoTrash className=" text-[rgba(0,0,0,0.7)] text-[18px]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {/* Loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          count={slides.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default HomeSliderBanners;
