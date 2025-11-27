import express from "express";
import {
  adminGetOrdersController,
  adminGetOrderDetailsController,
  adminUpdateOrderStatusController,
  adminDeleteOrderController,
} from "../controllers/adminOrder.controller.js";
import auth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

// GET ALL ORDERS
router.get("/", auth, adminAuth, adminGetOrdersController);

// GET ORDER DETAILS
router.get("/:id", auth, adminAuth, adminGetOrderDetailsController);

// UPDATE ORDER STATUS
router.patch("/:id", auth, adminAuth, adminUpdateOrderStatusController);

// DELETE ORDER
router.delete("/:id", auth, adminAuth, adminDeleteOrderController);

export default router;
