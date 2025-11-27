import React, { useEffect, useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

import SearchBox from "../../Components/SearchBox";
import { adminGetUsers, deleteData } from "../../utils/api";
import { MyContext } from "../../App";

import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

const Users = () => {
  const context = useContext(MyContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Load Users
  const fetchUsers = async () => {
    setLoading(true);
    const res = await adminGetUsers(search);

    if (res?.success) {
      setUsers(res.data);
    } else {
      setUsers([]);
    }

    setLoading(false);
  };

  // Debounce & reload after edit/delete
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, context.reloadFlag]); // ⭐ FIX — tự reload sau khi update/delete

  // DELETE USER
  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    deleteData(`/api/admin/users/${id}`).then((res) => {
      if (res?.success) {
        context.alertBox("success", "User deleted successfully");
        context.reloadProducts(); // hoặc context.setReloadFlag()
      } else {
        context.alertBox("error", res?.message || "Delete failed");
      }
    });
  };

  const columns = [
    { id: "userImg", label: "IMAGE", minWidth: 80 },
    { id: "userName", label: "NAME", minWidth: 120 },
    { id: "userEmail", label: "EMAIL", minWidth: 150 },
    { id: "userPh", label: "PHONE", minWidth: 130 },
    { id: "role", label: "ROLE", minWidth: 100 },
    { id: "status", label: "STATUS", minWidth: 120 },
    { id: "createdDate", label: "CREATED", minWidth: 130 },
    { id: "actions", label: "ACTIONS", minWidth: 180 },
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="card my-4 shadow-md sm:rounded-lg bg-white">
      {/* HEADER */}
      <div className="flex items-center w-full pl-5 px-4 py-4 justify-between pb-7">
        <h2 className="text-[20px] font-[600]">Users Management</h2>

        <div className="col w-[40%] ml-auto">
          <SearchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-12 flex justify-center">
          <CircularProgress />
        </div>
      )}

      {/* EMPTY */}
      {!loading && users.length === 0 && (
        <div className="py-8 text-center text-gray-500">No users found</div>
      )}

      {/* TABLE */}
      {!loading && users.length > 0 && (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((u) => (
                    <TableRow hover key={u._id}>
                      {/* AVATAR */}
                      <TableCell>
                        <div className="w-[45px] h-[45px] rounded-md overflow-hidden">
                          <img
                            src={
                              u.avatar ||
                              "https://mui.com/static/images/avatar/1.jpg"
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>

                      {/* NAME */}
                      <TableCell className="font-[500]">{u.name}</TableCell>

                      {/* EMAIL */}
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <MdOutlineMarkEmailRead /> {u.email}
                        </span>
                      </TableCell>

                      {/* PHONE */}
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <FaPhoneAlt /> {u.mobile || "N/A"}
                        </span>
                      </TableCell>

                      {/* ROLE */}
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-white text-[12px] ${
                            u.role === "ADMIN" ? "bg-green-600" : "bg-gray-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </TableCell>

                      {/* STATUS */}
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-white text-[12px] ${
                            u.status === "Active"
                              ? "bg-blue-600"
                              : u.status === "Suspended"
                              ? "bg-red-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {u.status}
                        </span>
                      </TableCell>

                      {/* CREATED DATE */}
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <MdDateRange />
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                            : "—"}
                        </span>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        <div className="flex gap-2">
                          {/* EDIT */}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => context.openEditUser(u)}
                          >
                            Edit
                          </Button>

                          {/* DELETE */}
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default Users;
