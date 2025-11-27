import UserModel from "../models/user.model.js";

// ================== GET ALL USERS ==================
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    // Tìm theo name/email/mobile
    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ],
    };

    const users = await UserModel.find(filter)
      .select(
        "_id name email mobile avatar role status createdAt last_login_date signUpWithGoogle"
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      error: false,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// ================== GET SINGLE USER ==================
export const getSingleUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select(
      "_id name email mobile avatar role status createdAt last_login_date address_details orderHistory"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      error: false,
      message: "User fetched",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// ================== ADMIN UPDATE USER ==================
export const adminUpdateUser = async (req, res) => {
  try {
    const { name, email, mobile, role, status } = req.body;
    const userId = req.params.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // ❌ Không cho admin tự đổi role của chính mình
    if (
      user._id.toString() === req.userId.toString() &&
      role &&
      role !== user.role
    ) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "You cannot change your own role",
      });
    }

    // ❌ Email không được trùng
    if (email && email !== user.email) {
      const exists = await UserModel.findOne({ email });
      if (exists) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Email already exists",
        });
      }
    }

    // UPDATE FIELD
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.mobile = mobile ?? user.mobile;
    user.role = role ?? user.role;
    user.status = status ?? user.status;

    await user.save();

    return res.json({
      success: true,
      error: false,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// ================== DELETE USER ==================
import { v2 as cloudinary } from "cloudinary";

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // ❌ Không cho admin tự xoá chính mình
    if (userId === req.userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "You cannot delete your own account",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // 🔥 XÓA AVATAR TRÊN CLOUDINARY (nếu tồn tại)
    if (user.avatar) {
      try {
        const parts = user.avatar.split("/");
        const filename = parts[parts.length - 1];
        const publicId = filename.split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Cloudinary delete error:", err);
      }
    }

    await UserModel.findByIdAndDelete(userId);

    return res.json({
      success: true,
      error: false,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};
