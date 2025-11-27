import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  addToMyListController,
  deleteToMyListController,
  getMyListController,
  getMyListCountController,
  checkMyListItemController,
} from "../controllers/mylist.controller.js";

const myListRouter = Router();

// Thêm / toggle sản phẩm trong My List
myListRouter.post("/add", auth, addToMyListController);

// Lấy toàn bộ My List
myListRouter.get("/get", auth, getMyListController);

// Đếm số lượng My List
myListRouter.get("/count", auth, getMyListCountController);

// Kiểm tra 1 product đã nằm trong My List chưa
myListRouter.get("/check/:productId", auth, checkMyListItemController);

// Xoá 1 item khỏi My List
myListRouter.delete("/:id", auth, deleteToMyListController);

export default myListRouter;
