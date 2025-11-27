// models/OrderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    // ⭐ Snapshot người nhận
    receiver: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
    },

    // ⭐ Snapshot địa chỉ giao hàng
    delivery_snapshot: {
      address_line1: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      mobile: String,
    },

    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
      required: true,
    },

    // ⭐ Danh sách sản phẩm
    products: [
      {
        productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: Number,
        name: String,
        price: Number,
        discount: Number,
        finalPrice: Number,
        image: String,
      },
    ],

    // ⭐ Thanh toán
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    paymentId: { type: String, default: "" },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderNote: {
      type: String,
      default: "",
    },

    // ⭐ Tổng tiền
    subTotalAmt: Number,
    shippingFee: Number,
    totalAmt: Number,

    // ⭐ Theo dõi trạng thái giao hàng
    delivery_status: {
      type: String,
      enum: ["processing", "shipping", "delivered", "cancelled"],
      default: "processing",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
