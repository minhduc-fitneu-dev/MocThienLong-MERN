import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDb.js";

// 🔥 Routers
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/mylist.route.js";
import addressRouter from "./route/address.route.js";
import homeSliderRouter from "./route/homeSlider.route.js";
import adsBannerRouter from "./route/adsBanner.route.js";
import blogRouter from "./route/blog.route.js";
import adminUserRouter from "./route/adminUser.route.js";
import orderRouter from "./route/order.route.js";
import adminStatsRouter from "./route/adminStats.route.js";
import adminOrderRouter from "./route/adminOrder.route.js";

// Middlewares
import auth from "./middlewares/auth.js";
import adminAuth from "./middlewares/adminAuth.js";

dotenv.config();

const app = express();

// ================== 🔧 TRUST PROXY ==================
app.set("trust proxy", 1);

// ================== 🔧 BODY PARSER ==================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================== 🔧 CORS CONFIG ==================
const allowedOrigins = [
  "http://localhost:5173", // client local
  "http://localhost:5174", // admin local
  "https://mocthienlong.shop",
  "https://admin.mocthienlong.shop",
  "https://mocthienlong.netlify.app",
  "https://mocthienlong-admin.vercel.app",
  "https://relaxed-kitten-d879e4.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // 👉 Cho mobile app, Postman, server-to-server, cronjobs...
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// ================== 🔧 COOKIE PARSER ==================
app.use(cookieParser());

// ================== 🔧 COOKIE SETTINGS (GLOBAL) ==================
app.use((req, res, next) => {
  res.cookieSettings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };
  next();
});

// ================== 🔧 LOGGER + SECURITY ==================
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ================== 🔧 HEALTH CHECK ==================
app.get("/", (req, res) => {
  res.json({
    message: `✅ Server running on port ${process.env.PORT}`,
    status: "OK",
  });
});

// ================== 🔧 ROUTES ==================
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", myListRouter);
app.use("/api/address", addressRouter);
app.use("/api/homeslider", homeSliderRouter);
app.use("/api/ads-banner", adsBannerRouter);
app.use("/api/blog", blogRouter);
app.use("/api/order", orderRouter);

// Admin
app.use("/api/admin/users", auth, adminAuth, adminUserRouter);
app.use("/api/admin/orders", auth, adminAuth, adminOrderRouter);
app.use("/api/admin/stats", auth, adminAuth, adminStatsRouter);

// ================== 🔧 DATABASE + SERVER ==================
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("===========================================");
    console.log("🚀 Mộc Thiên Long API READY");
    console.log("📡 Port:", PORT);
    console.log("🌱 Mode:", process.env.NODE_ENV);
    console.log("===========================================");
  });
});
