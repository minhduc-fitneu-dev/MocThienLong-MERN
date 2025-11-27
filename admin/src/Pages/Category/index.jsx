import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";

const CategoryList = () => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [catData, setCatData] = useState([]);
  const context = useContext(MyContext);

  const columns = [
    { id: "image", label: "Image", minWidth: 100 },
    { id: "name", label: "Category Name", minWidth: 150 },
    { id: "actions", label: "Actions", minWidth: 100 },
  ];

  // ✅ Chuyển category tree → mảng phẳng
  const flattenTree = (nodes) => {
    let arr = [];
    const loop = (items) => {
      items.forEach((item) => {
        arr.push(item);
        if (item.children?.length > 0) loop(item.children);
      });
    };
    loop(nodes);
    return arr;
  };

  // ✅ Load Category List
  const loadCategories = () => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.success) {
        setCatData((res.data || []).filter((c) => !c.parentId));
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ✅ Reload UI khi panel Add / Edit đóng lại (không cần F5)
  useEffect(() => {
    if (!context.isOpenFullScreenPanel.open) {
      loadCategories();
    }
  }, [context.isOpenFullScreenPanel.open]);

  // ✅ Delete Category
  const deleteCat = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Category này không?")) return;

    deleteData(`/api/category/${id}`).then(() => {
      context.alertBox("success", "Category deleted!");
      loadCategories();
    });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[20px] font-[600] ">
          Category List
          <span className="font-[500] text-[14px]"> (Material UI Table)</span>
        </h2>

        <div className="col w-[30%] ml-auto flex items-center justify-end gap-3">
          <Button className="btn !bg-green-500 !text-white btn-sm flex items-center">
            Export
          </Button>
          <Button
            className="btn-blue !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add New Category",
              })
            }
          >
            Add New Category
          </Button>
        </div>
      </div>

      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white ">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={60}>
                  <Checkbox {...label} size="small" />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} width={column.minWidth}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {catData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox {...label} size="small" />
                  </TableCell>

                  <TableCell width={100}>
                    <div className="flex items-center gap-4 w-[80px]">
                      <div className="img w-full rounded-md overflow-hidden group">
                        <img
                          src={item?.images?.[0]?.url} // ✅ Sửa đúng chuẩn
                          className="w-full h-[60px] object-cover group-hover:scale-105 transition-all"
                          alt=""
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell width={100}>{item?.name}</TableCell>

                  <TableCell width={100}>
                    <div className="flex items-center gap-2">
                      <Button
                        className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                        style={{ minWidth: 30 }}
                        onClick={() =>
                          context.setIsOpenFullScreenPanel({
                            open: true,
                            model: "Edit Category",
                            id: item?._id,
                          })
                        }
                      >
                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                      </Button>

                      <Button
                        className="!w-[30px] !h-[30px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full"
                        style={{ minWidth: 30 }}
                        onClick={() => deleteCat(item?._id)}
                      >
                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={catData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default CategoryList;
