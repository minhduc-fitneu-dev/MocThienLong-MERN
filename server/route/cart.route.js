import { Router } from "express";
import { addToCartItemController, clearCartController, deleteCartItemQtyController, getCartCountController, getCartItemController, getCartTotalController, updateCartItemQtyController } from "../controllers/cart.controller.js";
import auth from "../middlewares/auth.js";

const cartRouter = Router();

// ============ ROUTES ============
cartRouter.post("/add", auth, addToCartItemController);
// ============ GET CART ITEMS ============
cartRouter.get("/get", auth, getCartItemController);
// ============ UPDATE CART ITEM QUANTITY ============
cartRouter.put("/update-qty", auth, updateCartItemQtyController);


// ============ DELETE CART ITEM ============
cartRouter.delete("/delete-cart-item", auth, deleteCartItemQtyController);

// === CLEAR CART ===
cartRouter.delete("/clear", auth, clearCartController);

// === CART TOTAL ===
cartRouter.get("/total", auth, getCartTotalController);

// === CART COUNT ===
cartRouter.get("/count", auth, getCartCountController);

export default cartRouter;
