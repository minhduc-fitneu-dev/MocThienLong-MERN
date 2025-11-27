import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { createContext, useState, useEffect } from "react";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Products from "./Pages/Products";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { IoClose } from "react-icons/io5";
import Slide from "@mui/material/Slide";
import AddProduct from "./Pages/Products/addProduct";
import HomeSliderBanners from "./Pages/HomeSliderBanners";
import AddHomeSlide from "./Pages/HomeSliderBanners/addHomeSlide";
import CategoryList from "./Pages/Category";
import AddCategory from "./Pages/Category/addCategory";
import AddSubCategory from "./Pages/Category/addSubCategory";
import SubCategoryList from "./Pages/Category/subCatList";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyAccount from "./Pages/VerifyAccount";
import ChangePassword from "./Pages/ChangePassword";

import toast, { Toaster } from "react-hot-toast";
import { fetchDataFromApi } from "./utils/api";
import Profile from "./Pages/Profile";
import AddAddress from "./Pages/Address/addAddress";
import EditCategory from "./Pages/Category/editCategory";
import EditSubCategory from "./Pages/Category/editSubCatBox";
import { deleteData } from "./utils/api"; // nhớ có dòng này
import EditProduct from "./Pages/Products/editProduct";
import ProductDetails from "./Pages/Products/productDetails";
import EditHomeSlide from "./Pages/HomeSliderBanners/editHomeSlider";
import AdsBanner from "./Pages/AdsBanner";
import EditAdsBanner from "./Pages/AdsBanner/editAdsBanner";
import AddAdsBanner from "./Pages/AdsBanner/addAdsBanner";
import EditBlog from "./Pages/Blog/editBlog";
import BlogList from "./Pages/Blog";
import AddBlog from "./Pages/Blog/addBlog";
import BlogDetails from "./Pages/Blog/blogDetails";
import EditUser from "./Pages/Users/editUser";
import PrivateRoute from "./Routes/PrivateRoute";
import AdminRoute from "./Routes/AdminRoute";
import MainLayout from "./Layout/MainLayout";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyContext = createContext(null);

function App() {
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [editProductData, setEditProductData] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [viewProductData, setViewProductData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [viewBlogData, setViewBlogData] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  const openEditUser = (user) => {
    setEditUserId(user._id);
    setIsOpenFullScreenPanel({ open: true, model: "Edit User" });
  };
  const openViewBlog = (blog) => {
    setViewBlogData(blog);
    setIsOpenFullScreenPanel({ open: true, model: "Blog Details" });
  };

  const openViewProduct = (product) => {
    setViewProductData(product);
    setIsOpenFullScreenPanel({ open: true, model: "View Product" });
  };

  const loadCategories = () => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.success) setCategoryData(res.data);
    });
  };
  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: "",
  });

  const [reloadFlag, setReloadFlag] = useState(0);
  const reloadProducts = React.useCallback(() => {
    setReloadFlag((f) => f + 1);
  }, []);

  // ✅ Kiểm tra token và lấy thông tin user khi reload
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLogin(false);
      setUserData(null);
      setLoadingUser(false);
      return;
    }

    // 🧠 Có token → xác thực
    fetchDataFromApi(`/api/user/user-details`).then((res) => {
      if (res?.error === false) {
        setUserData(res.data);
        setIsLogin(true);
      } else {
        localStorage.removeItem("accessToken");
        setIsLogin(false);
        setUserData(null);
      }
      setLoadingUser(false); // ✅ chỉ render sau khi xác thực xong
    });
  }, []);

  // App.jsx
  const deleteSubCategory = (id) => {
    if (!window.confirm("Are you sure to delete this Sub Category?")) return;
    deleteData(`/api/category/${id}`).then((res) => {
      if (res?.success) {
        alertBox("success", "Sub Category Deleted!");
        loadCategories();
      } else alertBox("error", res?.message || "Delete failed");
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const router = createBrowserRouter([
    // ============================
    // PUBLIC ROUTES (Không cần login)
    // ============================
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <Signup />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/verify-account",
      element: <VerifyAccount />,
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
    },

    // ============================
    // PRIVATE ROUTES (yêu cầu login)
    // ============================
    {
      element: <PrivateRoute />,
      children: [
        {
          element: <AdminRoute />,
          children: [
            {
              path: "/",
              element: (
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              ),
            },
            {
              path: "/products",
              element: (
                <MainLayout>
                  <Products />
                </MainLayout>
              ),
            },
            {
              path: "/homeSlider/list",
              element: (
                <MainLayout>
                  <HomeSliderBanners />
                </MainLayout>
              ),
            },
            {
              path: "/category/list",
              element: (
                <MainLayout>
                  <CategoryList />
                </MainLayout>
              ),
            },
            {
              path: "/subCategory/list",
              element: (
                <MainLayout>
                  <SubCategoryList />
                </MainLayout>
              ),
            },
            {
              path: "/ads-banner",
              element: (
                <MainLayout>
                  <AdsBanner />
                </MainLayout>
              ),
            },
            {
              path: "/blogs",
              element: (
                <MainLayout>
                  <BlogList />
                </MainLayout>
              ),
            },
            {
              path: "/users",
              element: (
                <MainLayout>
                  <Users />
                </MainLayout>
              ),
            },
            {
              path: "/orders",
              element: (
                <MainLayout>
                  <Orders />
                </MainLayout>
              ),
            },
            {
              path: "/profile",
              element: (
                <MainLayout>
                  <Profile />
                </MainLayout>
              ),
            },
          ],
        },
      ],
    },
  ]);

  const alertBox = (type, msg) => {
    setTimeout(() => {
      if (type === "success") toast.success(msg);
      if (type === "error") toast.error(msg);
    }, 50);
  };

  const values = {
    isSidebarOpen,
    setisSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    alertBox,
    setUserData,
    userData,
    addressList,
    setAddressList,
    categoryData,
    setCategoryData,
    loadCategories,
    deleteSubCategory,
    reloadFlag,
    reloadProducts,
    setReloadFlag,
    editProductData,
    setEditProductData,
    editProductId,
    setEditProductId,
    viewProductData,
    setViewProductData,
    openViewProduct,
    loadingUser,
    viewBlogData,
    setViewBlogData,
    openViewBlog,
    openEditUser,
    editUserId,
    setEditUserId,
  };
  // ✅ Tự đóng Dialog khi reloadFlag đổi (sau khi add/edit/delete)
  useEffect(() => {
    if (isOpenFullScreenPanel.open) {
      setIsOpenFullScreenPanel({ open: false });
    }
  }, [reloadFlag]);

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />
        <Dialog
          fullScreen
          open={isOpenFullScreenPanel.open}
          onClose={() => setIsOpenFullScreenPanel({ open: false })}
          slots={{
            transition: Transition,
          }}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setIsOpenFullScreenPanel({ open: false })}
                aria-label="close"
              >
                <IoClose className="text-gray-800" />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                <span className="text-gray-800">
                  {isOpenFullScreenPanel?.model}
                </span>
              </Typography>
            </Toolbar>
          </AppBar>
          {isOpenFullScreenPanel?.model === "Add Product" && <AddProduct />}

          {isOpenFullScreenPanel?.model === "Add Home Slide" && (
            <AddHomeSlide />
          )}

          {isOpenFullScreenPanel?.model === "Add New Category" && (
            <AddCategory />
          )}
          {isOpenFullScreenPanel?.model === "Add New Sub Category" && (
            <AddSubCategory />
          )}
          {isOpenFullScreenPanel?.model === "Add New Address" && <AddAddress />}
          {isOpenFullScreenPanel?.model === "Edit Category" && <EditCategory />}
          {isOpenFullScreenPanel?.model === "Edit Sub Category" && (
            <EditSubCategory />
          )}
          {isOpenFullScreenPanel?.model === "Edit Product" && <EditProduct />}
          {isOpenFullScreenPanel?.model === "View Product" && (
            <ProductDetails
              product={viewProductData}
              onClose={() => setIsOpenFullScreenPanel({ open: false })}
            />
          )}
          {isOpenFullScreenPanel?.model === "Edit Home Slide" && (
            <EditHomeSlide />
          )}

          {isOpenFullScreenPanel?.model === "Add Ads Banner" && (
            <AddAdsBanner />
          )}

          {isOpenFullScreenPanel?.model === "Edit Ads Banner" && (
            <EditAdsBanner />
          )}

          {isOpenFullScreenPanel?.model === "Add Blog" && <AddBlog />}

          {isOpenFullScreenPanel?.model === "Edit Blog" && <EditBlog />}

          {isOpenFullScreenPanel?.model === "Blog Details" && (
            <BlogDetails
              blog={viewBlogData}
              onClose={() => setIsOpenFullScreenPanel({ open: false })}
            />
          )}
          {isOpenFullScreenPanel?.model === "Edit User" && <EditUser />}
        </Dialog>

        <Toaster />
      </MyContext.Provider>
    </>
  );
}

export default App;
export { MyContext };
