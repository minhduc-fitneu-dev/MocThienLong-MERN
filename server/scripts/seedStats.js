// scripts/seedStats.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import AddressModel from "../models/address.model.js";

dotenv.config();

// KHỚP VỚI .env
const MONGO_URL = process.env.MONGODB_URI;

// Random helper
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const monthDates = [
  "2025-01-10T10:00:00.000Z",
  "2025-02-12T09:30:00.000Z",
  "2025-03-15T11:45:00.000Z",
  "2025-04-20T08:20:00.000Z",
  "2025-05-07T14:10:00.000Z",
  "2025-06-24T16:05:00.000Z",
  "2025-07-02T12:40:00.000Z",
  "2025-08-18T10:10:00.000Z",
  "2025-09-09T17:55:00.000Z",
  "2025-10-26T13:20:00.000Z",
  "2025-11-14T15:30:00.000Z",
  "2025-12-29T09:50:00.000Z",
];

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected!");

    // ==================================================
    // 1️⃣ TẠO USERS
    // ==================================================
    console.log("👤 Creating fake users...");
    const users = [];

    for (let i = 0; i < 12; i++) {
      const u = await UserModel.create({
        name: `User Seed ${i + 1}`,
        email: `seedUser${i + 1}@gmail.com`,
        password: `seedPassword${Date.now()}_${i}`,
        signUpWithGoogle: true,
        verify_email: true,
        createdAt: new Date(monthDates[i]),
        updatedAt: new Date(monthDates[i]),
      });

      users.push(u); // ⭐ QUAN TRỌNG
    }

    console.log(`➡️ Created ${users.length} users`);

    // ==================================================
    // 2️⃣ ĐẢM BẢO USER CÓ ÍT NHẤT 1 ADDRESS
    // ==================================================
    console.log("📮 Ensuring address for each user...");

    for (let user of users) {
      const addr = await AddressModel.create({
        userId: user._id,
        address_line1: "123 Seed Street",
        city: "Hanoi",
        state: "HN",
        country: "Vietnam",
        mobile: "0123456789",
        pincode: "100000",
      });

      user.address_details.push(addr._id);
      await user.save();

      user.seedAddress = addr;
    }

    // ==================================================
    // 3️⃣ GET PRODUCTS (CẦN SẢN PHẨM THẬT)
    // ==================================================
    const products = await ProductModel.find().limit(5);
    if (products.length === 0) {
      console.log("❌ Không có sản phẩm! Hãy thêm sản phẩm trước.");
      process.exit(1);
    }

    // ==================================================
    // 4️⃣ TẠO ORDERS CHO 12 THÁNG
    // ==================================================
    console.log("📦 Creating fake delivered orders...");

    for (let i = 0; i < 12; i++) {
      const user = users[i];
      const address = user.seedAddress;
      const product = products[random(0, products.length - 1)];

      const quantity = random(1, 4);
      const discount = product.discount || 0;
      const price = product.price;
      const finalPrice = price - (price * discount) / 100;
      const amount = finalPrice * quantity;

      await OrderModel.create({
        userId: user._id,
        orderId: `SEEDORDER-${i + 1}-${Date.now()}`,
        receiver: {
          fullName: user.name,
          mobile: address.mobile,
          email: user.email,
        },
        delivery_snapshot: {
          address_line1: address.address_line1,
          city: address.city,
          state: address.state,
          country: address.country,
          pincode: address.pincode,
          mobile: address.mobile,
        },
        delivery_address: address._id,
        products: [
          {
            productId: product._id,
            quantity,
            name: product.name,
            price,
            discount,
            finalPrice,
            image: product.images[0]?.url || "",
          },
        ],
        paymentMethod: "cod",
        payment_status: "paid",
        subTotalAmt: amount,
        shippingFee: 0,
        totalAmt: amount,
        delivery_status: "delivered",
        createdAt: new Date(monthDates[i]),
        updatedAt: new Date(monthDates[i]),
      });
    }

    console.log("🎉 SEED COMPLETE – All months populated!");
    process.exit();
  } catch (err) {
    console.log("❌ Seed Error:", err);
    process.exit(1);
  }
}

seed();
