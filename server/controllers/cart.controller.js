import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

// ============================
// 1. ADD TO CART
// ============================
export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId || request.body.userId;
    const { productId, quantity } = request.body;

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized. Please login again.",
        error: true,
        success: false,
      });
    }

    if (!productId) {
      return response.status(400).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }

    // ➤ EP quantity về dạng số (default = 1)
    let qty = quantity ? parseInt(quantity, 10) : 1;
    if (isNaN(qty) || qty <= 0) qty = 1;

    // ➤ Kiểm tra sản phẩm có tồn tại
    const product = await ProductModel.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // ⭐ KIỂM TRA XEM SẢN PHẨM ĐÃ Ở TRONG GIỎ HÀNG CHƯA
    let existingCartItem = await CartProductModel.findOne({
      userId,
      productId,
    });

    // ===============================
    // CASE 1 → ĐÃ TỒN TẠI → CỘNG DỒN
    // ===============================
    if (existingCartItem) {
      existingCartItem.quantity += qty;
      const updated = await existingCartItem.save();

      return response.status(200).json({
        success: true,
        error: false,
        message: "Cart updated successfully (quantity increased)",
        data: updated,
      });
    }

    // ===============================
    // CASE 2 → CHƯA TỒN TẠI → TẠO MỚI
    // ===============================
    const cartItem = new CartProductModel({
      userId,
      productId,
      quantity: qty,
    });

    const savedItem = await cartItem.save();

    // Thêm vào mảng shopping_cart trong UserModel
    await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: savedItem._id } }
    );

    return response.status(200).json({
      success: true,
      error: false,
      message: "Item added to cart successfully",
      data: savedItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// ============================
// 2. GET CART ITEMS
// ============================
export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId || request.body.userId;

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized. Please login again.",
        error: true,
        success: false,
      });
    }

    const cartItems = await CartProductModel.find({ userId })
      .populate({
        path: "productId",
        select: "name images price brand discount countInStock",
      })
      .sort({ createdAt: -1 }) // mới thêm lên trước, cho đẹp
      .exec();

    if (!cartItems || cartItems.length === 0) {
      return response.status(200).json({
        message: "Cart is empty.",
        data: [],
        error: false,
        success: true,
      });
    }

    return response.status(200).json({
      data: cartItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// ============================
// 3. UPDATE CART ITEM QUANTITY
// ============================
export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId || request.body.userId;
    const { _id, qty } = request.body; // _id = cart item id

    if (!userId || !_id || qty === undefined) {
      return response.status(400).json({
        message: "Provide userId, _id (cart item id) and qty",
        error: true,
        success: false,
      });
    }

    let quantity = parseInt(qty, 10);

    if (isNaN(quantity) || quantity <= 0) {
      return response.status(400).json({
        message: "Quantity must be a positive number",
        error: true,
        success: false,
      });
    }

    // 🔍 Lấy cart item hiện tại
    const cartItem = await CartProductModel.findOne({
      _id,
      userId,
    }).populate("productId", "countInStock");

    if (!cartItem) {
      return response.status(404).json({
        message: "Cart item not found or does not belong to user",
        error: true,
        success: false,
      });
    }

    // (Tuỳ chọn) Check tồn kho:
    // if (cartItem.productId && cartItem.productId.countInStock < quantity) {
    //   return response.status(400).json({
    //     message: "Not enough stock for this product",
    //     error: true,
    //     success: false,
    //   });
    // }

    cartItem.quantity = quantity;
    const updated = await cartItem.save();

    return response.status(200).json({
      message: "Cart updated successfully",
      success: true,
      error: false,
      data: updated,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// ============================
// 4. DELETE CART ITEM
// ============================
export const deleteCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId || request.body.userId;
    const { _id } = request.body; // _id = cart item id

    if (!userId || !_id) {
      return response.status(400).json({
        message: "Provide userId and _id (cart item id)",
        error: true,
        success: false,
      });
    }

    // ❌ Xoá cart item
    const deletedCartItem = await CartProductModel.findOneAndDelete({
      _id,
      userId,
    });

    if (!deletedCartItem) {
      return response.status(404).json({
        message: "The product in the cart was not found",
        error: true,
        success: false,
      });
    }

    // 🔄 Đồng bộ xoá trong User.shopping_cart (lưu cartItemId, không phải productId)
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { shopping_cart: _id } }
    );

    return response.status(200).json({
      message: "Item removed from cart successfully",
      error: false,
      success: true,
      data: deletedCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
// ============================
// CLEAR CART (delete all)
// ============================
export const clearCartController = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true,
      });
    }

    // ❌ Xóa toàn bộ CartProduct
    await CartProductModel.deleteMany({ userId });

    // 🔄 Clear shopping_cart trong UserModel
    await UserModel.updateOne({ _id: userId }, { $set: { shopping_cart: [] } });

    return res.status(200).json({
      message: "Cart cleared successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
// ============================
// CART TOTAL
// ============================
export const getCartTotalController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        error: true,
        success: false,
      });
    }

    const cartItems = await CartProductModel.find({ userId }).populate(
      "productId",
      "price discount"
    );

    let total = 0;
    let originalTotal = 0;
    let totalQty = 0;

    cartItems.forEach((item) => {
      const price = item.productId.price;
      const discount = item.productId.discount || 0;

      const discountedPrice = price - (price * discount) / 100;

      total += discountedPrice * item.quantity;
      originalTotal += price * item.quantity;
      totalQty += item.quantity;
    });

    return res.status(200).json({
      success: true,
      error: false,
      total,
      originalTotal,
      totalQty,
      cartItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
// ============================
// CART COUNT
// ============================
export const getCartCountController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true,
      });
    }

    const count = await CartProductModel.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      error: false,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
