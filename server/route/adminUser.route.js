import { Router } from "express";
import auth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getAllUsers,
  getSingleUser,
  adminUpdateUser,
  deleteUser,
} from "../controllers/adminUser.controller.js";

const adminUserRouter = Router();

// ======================= ADMIN USER ROUTES =======================
// GET ALL USERS
adminUserRouter.get("/", auth, adminAuth, getAllUsers);

// GET SINGLE USER
adminUserRouter.get("/:id", auth, adminAuth, getSingleUser);

// UPDATE USER
adminUserRouter.patch("/:id", auth, adminAuth, adminUpdateUser);

// DELETE USER
adminUserRouter.delete("/:id", auth, adminAuth, deleteUser);

export default adminUserRouter;
