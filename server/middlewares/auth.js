// middlewares/auth.js
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

/**
 * Middleware xác thực người dùng bằng JWT
 * - Hỗ trợ Authorization (Bearer xxx) & Cookie HttpOnly
 * - Tối ưu cho môi trường HTTPS (Render/Vercel)
 */
const auth = async (req, res, next) => {
  try {
    let token = null;

    // ============================
    // 1. Ưu tiên lấy token từ Authorization Header
    // ============================
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ============================
    // 2. Không có thì lấy từ Cookie
    // ============================
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // ============================
    // 3. Không tìm thấy token → 401
    // ============================
    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please login again.",
        error: true,
        success: false,
      });
    }

    // ============================
    // 4. Verify Token (chống clock skew)
    // ============================
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, {
        clockTolerance: 10, // ⏳ tránh lỗi thời gian giữa server & client
      });
    } catch (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(401).json({
        message: "Invalid or expired token",
        error: true,
        success: false,
      });
    }

    // ============================
    // 5. Lấy user từ DB
    // ============================
    const user = await UserModel.findById(decoded.id).select("_id role status");

    if (!user) {
      return res.status(401).json({
        message: "User not found or deleted",
        error: true,
        success: false,
      });
    }

    // ============================
    // 6. Kiểm tra trạng thái Active
    // ============================
    if (user.status !== "Active") {
      return res.status(403).json({
        message: "Your account is inactive. Please contact admin.",
        error: true,
        success: false,
      });
    }

    // ============================
    // 7. Gắn user vào request
    // ============================
    req.userId = user._id.toString();
    req.userRole = user.role;

    // ============================
    // 8. Cho phép đi tiếp
    // ============================
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      message: "Unauthorized access",
      error: true,
      success: false,
    });
  }
};

export default auth;
