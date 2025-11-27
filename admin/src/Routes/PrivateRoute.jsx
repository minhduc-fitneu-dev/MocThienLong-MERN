import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MyContext } from "../App";

export default function PrivateRoute() {
  const { isLogin, loadingUser } = useContext(MyContext);

  // ⏳ Chờ load user xong đã
  if (loadingUser) return <div>Loading...</div>;

  // ❌ Chưa đăng nhập → đá về trang login
  if (!isLogin) return <Navigate to="/login" replace />;

  // ✔ Đăng nhập rồi → cho vào
  return <Outlet />;
}
