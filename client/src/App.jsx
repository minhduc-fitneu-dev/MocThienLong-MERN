import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import ProductListing from "./Pages/ProductListing";
import { ProductDetails } from "./Pages/ProductDetails";
import CartPage from "./Pages/Cart";
import Verify from "./components/Verify";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Checkout from "./Pages/Checkout";
import MyAccount from "./Pages/MyAccount";
import MyList from "./Pages/MyList";
import Orders from "./Pages/Orders";

import { ProductZoom } from "./components/ProductZoom";
import { ProductDetailsComponent } from "./components/ProductDetails";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { IoCloseSharp } from "react-icons/io5";

import toast, { Toaster } from "react-hot-toast";
import { fetchDataFromApi, postData } from "./utils/api";
import Address from "./Pages/MyAccount/address";
import AddAddressPopup from "./components/AddAddressPopup";
import ScrollToTop from "./components/ScrolltoTop";
import AboutUs from "./Pages/AboutUs";
import BlogsPage from "./Pages/Blogs";
import BlogDetails from "./Pages/Blogs/blogsDetails";
import OrderSuccess from "./Pages/OrderSuccess";
import FacebookChat from "./components/FacebookChat";
import SearchPage from "./Pages/SearchPage";

const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [maxWidth] = useState("lg");
  const [fullWidth] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [isAddAddressPopupOpen, setIsAddAddressPopupOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // ⭐ STATE CHO GIỎ HÀNG
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState({
    total: 0,
    originalTotal: 0,
    totalQty: 0,
  });
  // ⭐ STATE MY LIST
  const [myListCount, setMyListCount] = useState(0);
  const [myListItems, setMyListItems] = useState([]);

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  // ✅ ALERT GLOBAL (dùng chung mọi nơi)
  function openAlertBox(status, msg) {
    if (status === "success") toast.success(msg);
    if (status === "error") toast.error(msg);
  }

  // ✅ LẤY USER DETAILS MỘT LẦN SAU KHI VÀO APP
  useEffect(() => {
    let isAlertShown = false;
    const controller = new AbortController();
    const token = localStorage.getItem("accessToken");

    if (!token) return; // ⛔ Không fetch nếu chưa có token

    const fetchUserData = async () => {
      const res = await fetchDataFromApi(`/api/user/user-details`);
      if (res?.error) {
        setIsLogin(false);
        setUserData(null);

        if (!isAlertShown) {
          openAlertBox(
            "error",
            "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại."
          );
          isAlertShown = true;
        }
        return;
      }

      // ✅ Cookie/token hợp lệ
      setIsLogin(true);
      setUserData(res.data);

      // ✅ Load địa chỉ
      const addressRes = await fetchDataFromApi(`/api/address/list`);
      if (!addressRes.error) setAddressList(addressRes.data);
    };

    fetchUserData();

    return () => controller.abort();
  }, []);

  // ✅ HÀM LẤY CART COUNT TỪ BACKEND
  const getCartCount = async () => {
    try {
      const res = await fetchDataFromApi(`/api/cart/count`);
      if (res?.success) {
        setCartCount(res.count || 0);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      setCartCount(0);
    }
  };

  // ✅ HÀM LẤY CART ITEMS TỪ BACKEND
  const getCartItems = async () => {
    try {
      const res = await fetchDataFromApi(`/api/cart/get`);
      if (res?.success) {
        setCartItems(res.data || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      setCartItems([]);
    }
  };

  // ✅ HÀM LẤY TỔNG TIỀN GIỎ HÀNG
  const getCartTotal = async () => {
    try {
      const res = await fetchDataFromApi(`/api/cart/total`);
      if (res?.success) {
        setCartTotal({
          total: res.total || 0,
          originalTotal: res.originalTotal || 0,
          totalQty: res.totalQty || 0,
        });
      } else {
        setCartTotal({
          total: 0,
          originalTotal: 0,
          totalQty: 0,
        });
      }
    } catch (error) {
      setCartTotal({
        total: 0,
        originalTotal: 0,
        totalQty: 0,
      });
    }
  };

  // ✅ REFRESH GIỎ HÀNG (GỌI CẢ 3 API)
  const refreshCart = async () => {
    await Promise.all([getCartCount(), getCartItems(), getCartTotal()]);
  };

  // ✅ MỖI KHI LOGIN THÀNH CÔNG → LOAD GIỎ HÀNG
  useEffect(() => {
    if (isLogin) {
      refreshCart();
      refreshMyList();
    } else {
      // Khi logout / chưa login → reset giỏ
      setCartItems([]);
      setCartCount(0);
      setCartTotal({
        total: 0,
        originalTotal: 0,
        totalQty: 0,
      });
    }
  }, [isLogin]);

  // ✅ HÀM ADD TO CART (DÙNG Ở PRODUCT ITEM, PRODUCT DETAILS, V.V.)
  const addToCart = async (product, quantity = 1) => {
    try {
      if (!isLogin) {
        openAlertBox(
          "error",
          "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng."
        );
        return;
      }

      const res = await postData(`/api/cart/add`, {
        productId: product._id,
        quantity,
      });

      if (res?.success) {
        openAlertBox("success", "Đã thêm sản phẩm vào giỏ hàng!");
        await refreshCart();
        setOpenCartPanel(true); // mở luôn panel giỏ cho user thấy
      } else {
        openAlertBox("error", res?.message || "Không thể thêm vào giỏ hàng.");
      }
    } catch (error) {
      openAlertBox("error", "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };
  // ==========================
  // ⭐ GET MY LIST COUNT
  // ==========================
  const getMyListCount = async () => {
    try {
      const res = await fetchDataFromApi(`/api/myList/count`);
      if (res?.success) {
        setMyListCount(res.count || 0);
      } else {
        setMyListCount(0);
      }
    } catch (err) {
      setMyListCount(0);
    }
  };

  // ==========================
  // ⭐ GET MY LIST ITEMS
  // ==========================
  const getMyListItems = async () => {
    try {
      const res = await fetchDataFromApi(`/api/myList/get`);
      if (res?.success) {
        setMyListItems(res.data || []);
      } else {
        setMyListItems([]);
      }
    } catch (err) {
      setMyListItems([]);
    }
  };

  // ==========================
  // ⭐ REFRESH MY LIST (GỌI CẢ COUNT + ITEMS)
  // ==========================
  const refreshMyList = async () => {
    await Promise.all([getMyListCount(), getMyListItems()]);
  };

  // ==========================
  // ⭐ TOGGLE MY LIST (Thêm / xoá)
  // ==========================
  const toggleMyList = async (productId) => {
    if (!isLogin) {
      openAlertBox(
        "error",
        "Bạn cần đăng nhập để sử dụng danh sách yêu thích."
      );
      return;
    }

    try {
      const res = await postData(`/api/myList/add`, { productId });
      if (res?.success) {
        openAlertBox("success", res.message);
        await refreshMyList();
      } else {
        openAlertBox("error", res?.message || "Không thể cập nhật My List");
      }
    } catch (err) {
      openAlertBox("error", "Có lỗi xảy ra.");
    }
  };
  const values = {
    // modal/sp UI
    setOpenProductDetailsModal,
    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,
    currentProduct,
    setCurrentProduct,

    // alert
    openAlertBox,

    // auth
    isLogin,
    setIsLogin,
    userData,
    setUserData,

    // address
    isAddAddressPopupOpen,
    setIsAddAddressPopupOpen,
    addressList,
    setAddressList,

    // cart
    addToCart,
    cartCount,
    cartItems,
    cartTotal,
    refreshCart,
    // my list
    myListCount,
    myListItems,
    refreshMyList,
    toggleMyList,
  };

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <MyContext.Provider value={values}>
          <Header />
          

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productListing" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/my-orders" element={<Orders />} />
            <Route path="/address" element={<Address />} />
            <Route path="/category/:id" element={<ProductListing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />

            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/search" element={<SearchPage />} />

          </Routes>

          <Footer />
          {isAddAddressPopupOpen && <AddAddressPopup />}

          {/* Messenger Chat Plugin */}
          <FacebookChat />
          {/* PRODUCT MODAL */}
          <Dialog
            open={openProductDetailsModal}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={handleCloseProductDetailsModal}
            className="productDetailsModal"
          >
            <DialogContent>
              <div className="flex w-full relative">
                <Button
                  className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] 
                   !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
                  onClick={handleCloseProductDetailsModal}
                >
                  <IoCloseSharp className="text-[20px]" />
                </Button>

                {/* IMAGE ZOOM */}
                <div className="w-[40%] px-3">
                  <ProductZoom images={currentProduct?.images || []} />
                </div>

                {/* PRODUCT INFO */}
                <div className="w-[60%] py-8 px-8 pr-16">
                  <ProductDetailsComponent data={currentProduct} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </MyContext.Provider>
      </BrowserRouter>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "15px",
          },
        }}
      />
    </>
  );
}

export default App;
export { MyContext };
