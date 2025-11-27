// controllers/adminOrder.controller.js
import OrderModel from "../models/order.model.js";

// ==================================================================
// 1. ADMIN – GET ALL ORDERS (LIST + SEARCH + FILTER + PAGINATION)
// ==================================================================
export const adminGetOrdersController = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      month = "",
      year = "",
      customerName = "",
      phone = "",
    } = req.query;

    const query = {};
    page = Number(page);
    limit = Number(limit);

    // ===========================
    // 1. Search chung
    // ===========================
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "receiver.fullName": { $regex: search, $options: "i" } },
        { "receiver.email": { $regex: search, $options: "i" } },
        { "receiver.mobile": { $regex: search, $options: "i" } },
      ];
    }

    // ===========================
    // 2. Filter trạng thái
    // ===========================
    if (status) query.delivery_status = status;

    // ===========================
    // 3. Filter theo tên khách
    // ===========================
    if (customerName) {
      query["receiver.fullName"] = { $regex: customerName, $options: "i" };
    }

    // ===========================
    // 4. Filter theo SĐT
    // ===========================
    if (phone) {
      query["receiver.mobile"] = { $regex: phone, $options: "i" };
    }

    // ===========================
    // 5. Filter theo tháng & năm
    // ===========================
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Nếu chỉ chọn năm → lọc cả năm
    if (!month && year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    // ===========================
    // EXECUTE QUERY
    // ===========================
    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("delivery_address")
      .populate("products.productId");

    const total = await OrderModel.countDocuments(query);

    return res.json({
      success: true,
      data: orders,
      total,
      page,
      limit,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// ==================================================================
// 2. ADMIN – GET ORDER DETAILS
// ==================================================================
export const adminGetOrderDetailsController = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("delivery_address")
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({ error: true, message: "Order not found" });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// ==================================================================
// 3. ADMIN – UPDATE ORDER STATUS
// ==================================================================
export const adminUpdateOrderStatusController = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["processing", "shipping", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: true, message: "Invalid status" });
    }

    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: true, message: "Order not found" });
    }

    // ❌ Không cho cancel đơn đã giao
    if (order.delivery_status === "delivered" && status === "cancelled") {
      return res.status(400).json({
        error: true,
        message: "Delivered order cannot be cancelled",
      });
    }

    order.delivery_status = status;
    await order.save();

    return res.json({
      success: true,
      message: "Order updated",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// ==================================================================
// 4. ADMIN – DELETE ORDER (REMOVE FROM MONGO)
// ==================================================================
export const adminDeleteOrderController = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Order not found",
      });
    }

    await OrderModel.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
