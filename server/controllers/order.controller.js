import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import AddressModel from "../models/address.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import crypto from "crypto";

// ==================================================================
// CREATE ORDER
// ==================================================================
export const createOrderController = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId, paymentMethod = "cod", orderNote = "" } = req.body;

    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(400).json({
        error: true,
        message: "Địa chỉ không hợp lệ",
      });
    }

    const user = await UserModel.findById(userId);

    const cartItems = await CartProductModel.find({ userId }).populate(
      "productId"
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Giỏ hàng trống",
      });
    }

    let products = [];
    let subTotal = 0;

    for (let item of cartItems) {
      const product = item.productId;
      const price = product.price;
      const discount = product.discount || 0;
      const finalPrice = price - (price * discount) / 100;

      products.push({
        productId: product._id,
        quantity: item.quantity,
        name: product.name,
        image: product.images[0]?.url,
        price,
        discount,
        finalPrice,
      });

      subTotal += finalPrice * item.quantity;
    }

    const shippingFee = 0;
    const totalAmt = subTotal + shippingFee;

    const orderId =
      "ORDER-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const newOrder = await OrderModel.create({
      userId,
      orderId,

      receiver: {
        fullName: user.name,
        mobile: user.mobile,
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

      delivery_address: addressId,
      products,

      paymentMethod,
      orderNote,

      subTotalAmt: subTotal,
      shippingFee,
      totalAmt,
    });

    await CartProductModel.deleteMany({ userId });

    await UserModel.updateOne(
      { _id: userId },
      { $set: { shopping_cart: [] }, $push: { orderHistory: newOrder._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Đặt hàng thành công",
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ==================================================================
// GET MY ORDERS
// ==================================================================
export const getMyOrdersController = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// cancel
export const cancelOrderController = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: true,
        message: "Thiếu mã đơn hàng.",
      });
    }

    // 🔥 FIX QUAN TRỌNG: tìm theo orderId (string), không dùng _id
    const order = await OrderModel.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy đơn hàng.",
      });
    }

    // Chỉ cho hủy khi đang xử lý
    if (order.delivery_status !== "processing") {
      return res.status(400).json({
        error: true,
        message: "Đơn hàng không thể hủy ở trạng thái hiện tại.",
      });
    }

    order.delivery_status = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công.",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

