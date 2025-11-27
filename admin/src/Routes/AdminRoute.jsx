import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MyContext } from "../App";

export default function AdminRoute() {
  const { isLogin, userData, loadingUser } = useContext(MyContext);

  if (loadingUser) return <div>Loading...</div>;

  // ❌ Chưa đăng nhập
  if (!isLogin) return <Navigate to="/login" replace />;

  // ❌ Không phải admin
  if (userData?.role !== "ADMIN") return <Navigate to="/login" replace />;

  // ✔ Là admin → cho vào
  return <Outlet />;
}
