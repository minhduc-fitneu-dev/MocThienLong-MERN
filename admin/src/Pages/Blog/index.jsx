import React, { useEffect, useState, useContext } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
} from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { FaRegEye } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";

const BlogList = () => {
  const context = useContext(MyContext);

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch blogs
  const loadBlogs = async () => {
    const res = await fetchDataFromApi("/api/blog");

    if (res?.success) {
      setBlogs(res.blogs || []);
    } else {
      context.alertBox("error", res?.message || "Failed to load blogs");
    }
  };

  useEffect(() => {
    if (!context.isOpenFullScreenPanel?.open) loadBlogs();
  }, [context.reloadFlag, context.isOpenFullScreenPanel?.open]);

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bài viết này không?")) return;

    const res = await deleteData(`/api/blog/${id}`);

    if (res?.success) {
      context.alertBox("success", "Blog deleted successfully");
      loadBlogs();
    } else {
      context.alertBox("error", res?.message || "Delete failed");
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between my-4">
        <h2 className="text-[20px] font-[600]">
          Blogs{" "}
          <span className="text-gray-500 text-[14px] font-[400]">
            (Mộc Thiên Long)
          </span>
        </h2>

        <Button
          className="btn-blue !text-white"
          onClick={() =>
            context.setIsOpenFullScreenPanel({
              open: true,
              model: "Add Blog",
            })
          }
        >
          <IoMdAdd className="mr-2" /> Add Blog
        </Button>
      </div>

      {/* Table */}
      <div className="card shadow-md bg-white rounded-md">
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="py-10">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                blogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((blog) => (
                    <TableRow key={blog._id} hover>
                      <TableCell>
                        <div className="w-[70px] h-[70px] border overflow-hidden rounded">
                          <LazyLoadImage
                            effect="blur"
                            src={blog.thumbnail?.url}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="font-[600] text-[14px]">{blog.title}</p>
                      </TableCell>

                      <TableCell>
                        <p className="text-[12px] text-gray-600 line-clamp-2 w-[250px]">
                          {blog.shortDescription}
                        </p>
                      </TableCell>

                      <TableCell>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            className="!p-1 bg-gray-100"
                            onClick={() => {
                              context.setViewBlogData(blog);
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Blog Details",
                              });
                            }}
                          >
                            <FaRegEye className="text-[16px] !text-black" />
                          </Button>

                          <Button
                            className="!p-1 bg-gray-100"
                            onClick={() => {
                              context.setViewBlogData(blog);
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Edit Blog",
                              });
                            }}
                          >
                            <AiOutlineEdit className="text-[16px] !text-black" />
                          </Button>

                          <Button
                            className="!p-1 bg-gray-100"
                            onClick={() => handleDeleteBlog(blog._id)}
                          >
                            <GoTrash className="text-[15px] text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={blogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default BlogList;
