import { Router } from "express";
import {
  addAddressController,
  getAddressListController,
  setDefaultAddressController,
  deleteAddressController,
} from "../controllers/address.controller.js";
import auth from "../middlewares/auth.js";

const addressRouter = Router();

addressRouter.post("/add", auth, addAddressController);
addressRouter.get("/list", auth, getAddressListController);

addressRouter.delete("/delete/:addressId", auth, deleteAddressController);
addressRouter.post("/set-default", auth, setDefaultAddressController);

export default addressRouter;
