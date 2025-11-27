// middlewares/adminAuth.js
import UserModel from "../models/user.model.js";

/**
 * Middleware phân quyền admin
 * - Yêu cầu đã qua middleware auth (có req.userId)
 * - Chỉ cho phép role === "ADMIN" và status === "Active"
 */
const adminAuth = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized: user not authenticated",
        error: true,
      });
    }

    const user = await UserModel.findById(req.userId).select("role status");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        message: "Your account is not active. Contact admin.",
        error: true,
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
        error: true,
      });
    }

    // Cho phép qua admin route
    next();
  } catch (error) {
    console.error("AdminAuth error:", error.message);
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

export default adminAuth;
