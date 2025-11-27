import React, { useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FaRegBell } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { FaRegUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const handleClickMyAcc = (event) => setAnchorMyAcc(event.currentTarget);
  const handleCloseMyAcc = () => setAnchorMyAcc(null);

  const navigate = useNavigate();
  const context = useContext(MyContext);

  // ✅ Nếu đã login nhưng userData chưa có, tự gọi lại /user-details để đồng bộ
  useEffect(() => {
    if (context.isLogin && !context.userData) {
      const fetchUser = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/user-details`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const data = await res.json();
          if (data?.data) context.setUserData(data.data);
        } catch (err) {
          console.log("⚠️ Không thể tải user details:", err);
        }
      };
      fetchUser();
    }
  }, [context.isLogin]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    context.setIsLogin(false);
    context.setUserData(null);
    navigate("/login");
  };

  return (
    <header
      className={`h-[auto] py-2 ${
        context.isSidebarOpen ? "pl-64" : "pl-0"
      } shadow-md pr-7 bg-[#fff] flex items-center justify-between transition-all`}
    >
      {/* --- MENU ICON --- */}
      <div className={`part1 ${context.isSidebarOpen ? "ml-12" : "ml-4"}`}>
        <Button
          className="!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)]"
          onClick={() => context.setisSidebarOpen(!context.isSidebarOpen)}
        >
          {context.isSidebarOpen ? (
            <AiOutlineMenuFold className="text-[22px]" />
          ) : (
            <AiOutlineMenuUnfold className="text-[22px]" />
          )}
        </Button>
      </div>

      {/* --- RIGHT PART --- */}
      <div className="part2 w-[40%] flex items-center justify-end gap-5">
        <IconButton aria-label="notifications">
          <StyledBadge badgeContent={4} color="secondary">
            <FaRegBell />
          </StyledBadge>
        </IconButton>

        {context.isLogin && context.userData ? (
          <div className="relative">
            <div
              className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
              onClick={handleClickMyAcc}
            >
              <img
                src={
                  context?.userData?.avatar?.startsWith("http")
                    ? context.userData.avatar
                    : "/user.png"
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <Menu
              anchorEl={anchorMyAcc}
              id="account-menu"
              open={openMyAcc}
              onClose={handleCloseMyAcc}
              onClick={handleCloseMyAcc}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleCloseMyAcc} className="!bg-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                    <img
                      src={
                        context?.userData?.avatar?.startsWith("http")
                          ? context.userData.avatar
                          : "/user.png"
                      }
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  </div>

                  <div className="info">
                    <h3 className="text-[15px] font-[500] leading-4">
                      {context?.userData?.name}
                    </h3>
                    <p className="text-[13px] font-[400] opacity-70">
                      {context?.userData?.email}
                    </p>
                  </div>
                </div>
              </MenuItem>
              <Divider />

              <Link to="/profile">
                <MenuItem
                  onClick={handleCloseMyAcc}
                  className="flex items-center gap-3"
                >
                  <FaRegUser className="text-[16px]" />
                  <span className="text-[14px]">Profile</span>
                </MenuItem>
              </Link>

              <MenuItem
                onClick={handleLogout}
                className="flex items-center gap-3"
              >
                <IoMdLogOut className="text-[16px]" />
                <span className="text-[14px]">Sign Out</span>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Link to="/login">
            <Button className="btn-blue btn-sm !rounded-full">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
