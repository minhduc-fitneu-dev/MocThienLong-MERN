// controllers/user.controller.js
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
// import { sendEmail } from "../config/emailService.js"; // ❌ không dùng trực tiếp
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import sendEmailFun from "../config/sendEmailFun.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ResetPasswordEmail from "../utils/resetPasswordEmailTemplate.js";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// ========================== REGISTER ==========================
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
        error: true,
        success: false,
      });
    }

    // 2. Check user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
        error: true,
        success: false,
      });
    }

    // 3. Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // 4. Tạo OTP 6 số + set thời hạn 1 giờ
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // 5. Tạo user (trạng thái verify = false)
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
      otp,
      otpExpires,
      verify_email: false,
      status: "Active",
      role: "USER", // 🔒 fix cứng luôn
    });

    // 6. Gửi email OTP
    await sendEmailFun({
      to: email,
      subject: "Verify your email - Mộc Thiên Long",
      html: VerificationEmail(name, otp),
    });

    return res.json({
      message: "Registration successful! Check your email to verify.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== VERIFY EMAIL OTP ==========================
export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Check OTP đúng và còn hạn
    const isValidOTP = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();

    if (!isValidOTP) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    if (!isNotExpired) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    // Update user verify
    user.verify_email = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.json({
      message: "Email verified successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== LOGIN WITH GOOGLE ==========================
export async function authWithGoogle(req, res) {
  const { name, email, avatar, mobile } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        mobile: mobile || "",
        password: "",
        avatar: avatar || "",
        role: "USER",
        verify_email: true,
        signUpWithGoogle: true,
        last_login_date: new Date(),
      });
    } else {
      user.last_login_date = new Date();
      await user.save();
    }

    const accessToken = await generatedAccessToken(user);
    const refreshToken = await generatedRefreshToken(user);

    // Lưu refresh token vào DB
    user.refresh_token = refreshToken;
    await user.save();

    // Set cookie dùng cấu hình chung
    res.cookie("accessToken", accessToken, res.cookieSettings);
    res.cookie("refreshToken", refreshToken, res.cookieSettings);

    return res.json({
      message: "Login with Google successfully",
      success: true,
      error: false,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        avatar: user.avatar || "",
        role: user.role,
        signUpWithGoogle: user.signUpWithGoogle,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== RESEND OTP ==========================
export async function resendOtpController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (user.verify_email === true) {
      return res.status(400).json({
        message: "Email is already verified",
        error: true,
        success: false,
      });
    }

    // Tạo OTP mới
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = newOTP;
    user.otpExpires = Date.now() + 60 * 60 * 1000; // 1 giờ
    await user.save();

    await sendEmailFun({
      to: email,
      subject: "Reset your password - Mộc Thiên Long",
      html: ResetPasswordEmail(user.name, verifyCode),
    });

    return res.json({
      message: "New OTP sent to your email",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== LOGIN ==========================
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        message: "Your account is inactive. Please contact admin.",
        error: true,
        success: false,
      });
    }

    if (!user.verify_email) {
      return res.status(400).json({
        message: "Your email has not been verified",
        error: true,
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        error: true,
        success: false,
      });
    }
    const accessToken = await generatedAccessToken(user);
    const refreshToken = await generatedRefreshToken(user);

    // Lưu refresh token vào DB
    user.refresh_token = refreshToken;
    await user.save();

    // Set cookie
    res.cookie("accessToken", accessToken, res.cookieSettings);
    res.cookie("refreshToken", refreshToken, res.cookieSettings);

    return res.json({
      message: "Login successfully",
      success: true,
      error: false,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}

// ========================== LOGOUT ==========================
export async function logoutController(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized request",
        error: true,
        success: false,
      });
    }

    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

    // Xóa cookie bằng cấu hình chung
    res.clearCookie("accessToken", res.cookieSettings);
    res.clearCookie("refreshToken", res.cookieSettings);

    return res.json({
      message: "Logout successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

// ========================== UPLOAD OR UPDATE AVATAR ==========================
export async function userAvatarController(req, res) {
  try {
    const userId = req.userId;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // 1. Xoá ảnh cũ trên Cloudinary
    if (user.avatar) {
      try {
        const urlParts = user.avatar.split("/");
        const fileName = urlParts[urlParts.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(fileName);
      } catch (err) {
        console.warn("⚠️ Could not delete old avatar:", err.message);
      }
    }

    // 2. Upload avatar mới
    const uploadResult = await cloudinary.uploader.upload(files[0].path, {
      public_id: `user_${userId}_avatar`,
      overwrite: true,
    });

    // 3. Xoá file local
    try {
      fs.unlinkSync(files[0].path);
    } catch (err) {
      console.warn("⚠️ Could not delete local file:", err.message);
    }

    // 4. Update DB
    user.avatar = uploadResult.secure_url;
    await user.save();

    return res.json({
      message: "Avatar updated successfully",
      success: true,
      error: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== REMOVE AVATAR ==========================
export async function removeImageFromCloudinary(req, res) {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user || !user.avatar) {
      return res.status(400).json({
        message: "User has no avatar to delete",
        success: false,
      });
    }

    // 1. Tách tên file từ URL Cloudinary
    const urlParts = user.avatar.split("/");
    const fileName = urlParts[urlParts.length - 1].split(".")[0];

    // 2. Xoá ảnh trong Cloudinary
    const result = await cloudinary.uploader.destroy(fileName);

    if (result?.result === "ok") {
      user.avatar = "";
      await user.save();

      return res.json({
        message: "Avatar deleted successfully",
        success: true,
        error: false,
        user: {
          _id: user._id,
          avatar: "",
        },
      });
    }

    return res.status(404).json({
      message: "Image not found or already deleted",
      success: false,
      error: true,
    });
  } catch (error) {
    console.error("Delete avatar error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
    });
  }
}

// ========================== UPDATE USER DETAILS ==========================
export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    // 1. Validate bắt buộc
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Không cho đổi role, status bằng API client
    // (Chặn tấn công nâng quyền)
    const oldEmail = user.email;

    // 2. Nếu đổi email → cần verify lại
    let otp = null;
    let otpExpires = null;

    if (email !== oldEmail) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExpires = Date.now() + 10 * 60 * 1000; // 10 phút

      user.verify_email = false;
      user.otp = otp;
      user.otpExpires = otpExpires;

      await sendEmailFun({
        to: email,
        subject: "Verify your new email - Mộc Thiên Long",
        html: VerificationEmail(name, otp),
      });
    }

    // 3. Nếu có mật khẩu mới → hash
    if (password && password.trim() !== "") {
      const salt = await bcryptjs.genSalt(10);
      const hashedPass = await bcryptjs.hash(password.trim(), salt);
      user.password = hashedPass;
    }

    // 4. Validate mobile (đã có validate trong schema)
    if (mobile !== undefined) {
      user.mobile = mobile;
    }

    // 5. Update thông tin khác
    user.name = name;
    user.email = email;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      success: true,
      error: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile?.toString() || "",
        avatar: user.avatar,
        role: user.role,
        verify_email: user.verify_email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== FORGOT PASSWORD ==========================
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    // 1. Validate input
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    // 2. Tìm user theo email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email is not registered",
        error: true,
        success: false,
      });
    }

    // (Tuỳ chọn) kiểm tra email đã verify chưa
    if (!user.verify_email) {
      return res.status(400).json({
        message: "Please verify your email before resetting password",
        error: true,
        success: false,
      });
    }

    // 3. Tạo OTP 6 số và thời hạn 10 phút
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.forgot_password_otp = verifyCode;
    user.forgot_password_expiry = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    // 4. Gửi email OTP
    await sendEmailFun({
      to: email,
      subject: "Reset your password - Mộc Thiên Long",
      html: ResetPasswordEmail(user.name, verifyCode),
    });

    return res.json({
      message: "Check your email for OTP code",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== VERIFY FORGOT PASSWORD OTP ==========================
export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    // 1. Validate input
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        error: true,
        success: false,
      });
    }

    // 2. Tìm user theo email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email is not registered",
        error: true,
        success: false,
      });
    }

    // 3. Kiểm tra OTP & hạn sử dụng
    if (!user.forgot_password_otp || !user.forgot_password_expiry) {
      return res.status(400).json({
        message: "No OTP request found. Please request again.",
        error: true,
        success: false,
      });
    }

    const isValidOTP = user.forgot_password_otp === otp;
    const isNotExpired = user.forgot_password_expiry > Date.now();

    if (!isValidOTP) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    if (!isNotExpired) {
      return res.status(400).json({
        message: "OTP is expired",
        error: true,
        success: false,
      });
    }

    // 4. Xoá OTP sau khi xác thực thành công
    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;
    await user.save();

    return res.status(200).json({
      message: "Verify OTP successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Verify forgot password OTP error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== RESET PASSWORD (SUPPORT GOOGLE LOGIN & FORGOT) ==========================
export async function resetPassword(req, res) {
  try {
    const {
      email,
      oldPassword,
      newPassword,
      confirmPassword,
      googleChangePassword,
    } = req.body;

    console.log("🔧 RESET PASSWORD BODY:", req.body);

    // 1. Validate input chung
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Email, new password and confirm password are required.",
        error: true,
        success: false,
      });
    }

    // 2. Tìm user theo email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email is not registered.",
        error: true,
        success: false,
      });
    }

    // 3. Check newPassword = confirmPassword
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match.",
        error: true,
        success: false,
      });
    }

    // =========================================
    // 🟦 CASE 1: GOOGLE ACCOUNT SETTING PASSWORD
    // =========================================
    if (user.signUpWithGoogle === true || googleChangePassword === true) {
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(newPassword, salt);

      user.password = hashPassword;
      user.signUpWithGoogle = false;
      await user.save();

      return res.json({
        message: "Password created successfully for Google account!",
        error: false,
        success: true,
      });
    }

    // =========================================
    // 🟠 CASE 2: FORGOT PASSWORD (NO oldPassword)
    // =========================================
    if (!oldPassword) {
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(newPassword, salt);

      user.password = hashPassword;
      await user.save();

      return res.json({
        message: "Password reset successfully!",
        error: false,
        success: true,
      });
    }

    // =========================================
    // 🟢 CASE 3: USER ĐỔI MẬT KHẨU KHI ĐANG LOGIN
    // =========================================
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect.",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    return res.json({
      message: "Password updated successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== REFRESH TOKEN ==========================
export async function refreshToken(req, res) {
  try {
    // 1. Lấy token từ cookie hoặc header Authorization
    const token =
      req.cookies?.refreshToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Refresh token missing",
        error: true,
        success: false,
      });
    }

    // 2. Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN, {
        clockTolerance: 10,
      });
    } catch (err) {
      return res.status(403).json({
        message: "Refresh token expired or invalid",
        error: true,
        success: false,
      });
    }

    // 3. Kiểm tra trong DB (tránh token bị đánh cắp)
    const user = await UserModel.findById(decoded.id);
    if (!user || user.refresh_token !== token) {
      return res.status(403).json({
        message: "Refresh token mismatch",
        error: true,
        success: false,
      });
    }

    // 4. Tạo token mới
    const newAccessToken = await generatedAccessToken(user);
    const newRefreshToken = await generatedRefreshToken(user);

    // 5. Lưu refresh token mới vào DB
    user.refresh_token = newRefreshToken;
    await user.save();

    // 6. Set cookie chuẩn Render (HTTPS)
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.json({
      message: "New tokens generated",
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

// ========================== GET LOGIN USER DETAILS ==========================
export async function userDetails(req, res) {
  try {
    const userId = req.userId;

    // 1. Check token hợp lệ
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized request",
        error: true,
        success: false,
      });
    }

    // 2. Lấy user từ database
    const user = await UserModel.findById(userId).select(
      "_id name email mobile avatar role status address_details"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // 3. Kiểm tra status tài khoản
    if (user.status !== "Active") {
      return res.status(403).json({
        message: "Your account is inactive. Contact admin.",
        error: true,
        success: false,
      });
    }

    // 4. Chuyển mobile về string để giữ số 0 đầu
    const formattedUser = {
      ...user.toObject(),
      mobile: user.mobile ? user.mobile.toString() : "",
    };

    // 5. Trả response chuẩn
    return res.json({
      message: "User details fetched successfully",
      success: true,
      error: false,
      data: formattedUser,
    });
  } catch (error) {
    console.error("User details error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}
