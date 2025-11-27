import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// ===== Check ENV =====
if (!process.env.MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in .env file");
}

// ===== Optimize Mongoose for Production =====
mongoose.set("strictQuery", false);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // ⏳ 30s timeout để tránh Render treo
      socketTimeoutMS: 45000, // ⏳ tránh mất kết nối khi idle
    });

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
}

export default connectDB;
