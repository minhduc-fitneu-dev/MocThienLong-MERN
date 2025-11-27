// controllers/adminStats.controller.js
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

export const adminGetStats = async (req, res) => {
  try {
    console.log("📊 [adminGetStats] Start fetching stats...");

    // ===================== LẤY DOCUMENT SỚM NHẤT =====================
    const earliestUser = await UserModel.findOne().sort({ createdAt: 1 });
    const earliestOrder = await OrderModel.findOne().sort({ createdAt: 1 });

    console.log("➡ earliestUser:", earliestUser?.createdAt);
    console.log("➡ earliestOrder:", earliestOrder?.createdAt);

    let currentYear = new Date().getFullYear();

    // CHỐNG LỖI createdAt null
    const safeGetYear = (d) =>
      d && d instanceof Date && !isNaN(d) ? d.getFullYear() : null;

    const userYear = safeGetYear(earliestUser?.createdAt);
    const orderYear = safeGetYear(earliestOrder?.createdAt);

    if (userYear && orderYear) currentYear = Math.min(userYear, orderYear);
    else if (userYear) currentYear = userYear;
    else if (orderYear) currentYear = orderYear;

    console.log("📅 Using stats year:", currentYear);

    // ===================== USERS PER MONTH =====================
    const users = await UserModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          users: { $sum: 1 },
        },
      },
    ]);

    console.log("👤 Users aggregate:", users);

    const usersByMonth = Array(12).fill(0);
    users.forEach((u) => {
      if (u._id?.month) usersByMonth[u._id.month - 1] = u.users;
    });

    // ===================== SOLD PRODUCTS PER MONTH =====================
    const orders = await OrderModel.aggregate([
      {
        $match: {
          delivery_status: "delivered",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          sold: { $sum: "$products.quantity" },
        },
      },
    ]);

    console.log("📦 Orders aggregate:", orders);

    const soldByMonth = Array(12).fill(0);
    orders.forEach((o) => {
      if (o._id?.month) soldByMonth[o._id.month - 1] = o.sold;
    });

    // ===================== FORMAT OUTPUT =====================
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const stats = months.map((name, i) => ({
      name,
      users: usersByMonth[i],
      sold: soldByMonth[i],
    }));

    console.log("📊 Final stats:", stats);

    return res.json({
      success: true,
      year: currentYear,
      data: stats,
    });
  } catch (error) {
    console.error("🔥 adminGetStats ERROR:", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
