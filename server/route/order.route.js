import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  cancelOrderController,
  createOrderController,
  getMyOrdersController,
} from "../controllers/order.controller.js";

const orderRouter = Router();
orderRouter.get("/my-orders", auth, getMyOrdersController);

orderRouter.post("/create", auth, createOrderController);
orderRouter.post("/cancel", auth, cancelOrderController);

export default orderRouter;
