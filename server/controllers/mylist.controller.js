// controllers/myList.controller.js
import MyListModel from "../models/myList.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

/**
 * 1️⃣ ADD / TOGGLE My List
 * POST /api/myList/add
 * Body: { productId }
 *
 * - Nếu sản phẩm chưa có trong My List → thêm
 * - Nếu đã có → xoá (toggle off)
 */
export const addToMyListController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId } = request.body;

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

    // ✅ Kiểm tra sản phẩm có tồn tại không
    const product = await ProductModel.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // ✅ Kiểm tra xem product đã có trong My List chưa
    const existing = await MyListModel.findOne({ userId, productId });

    // 🔁 Nếu đã tồn tại → xoá (toggle off)
    if (existing) {
      await MyListModel.findByIdAndDelete(existing._id);

      // Đồng bộ với my_list trong User
      await UserModel.updateOne(
        { _id: userId },
        { $pull: { my_list: existing._id } }
      );

      return response.status(200).json({
        message: "Removed from My List",
        error: false,
        success: true,
        isAdded: false,
      });
    }

    // 🟢 Nếu chưa có → thêm mới
    const myListItem = await MyListModel.create({
      userId,
      productId,
    });

    // Lưu ID vào my_list trong User
    await UserModel.updateOne(
      { _id: userId },
      { $push: { my_list: myListItem._id } }
    );

    return response.status(200).json({
      message: "Added to My List",
      error: false,
      success: true,
      isAdded: true,
      data: myListItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * 2️⃣ GET My List
 * GET /api/myList/get
 * - Trả về toàn bộ danh sách yêu thích của user
 * - Có populate thông tin product
 */
export const getMyListController = async (request, response) => {
  try {
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized. Please login again.",
        error: true,
        success: false,
      });
    }

    const myListItems = await MyListModel.find({ userId })
      .populate({
        path: "productId",
        select: "name images price oldPrice discount brand rating",
      })
      .sort({ createdAt: -1 });

    return response.status(200).json({
      message: "Fetched user's My List successfully",
      error: false,
      success: true,
      data: myListItems,
      count: myListItems.length,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * 3️⃣ COUNT My List
 * GET /api/myList/count
 * - Trả về số lượng sản phẩm trong My List
 */
export const getMyListCountController = async (request, response) => {
  try {
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized. Please login again.",
        error: true,
        success: false,
      });
    }

    const count = await MyListModel.countDocuments({ userId });

    return response.status(200).json({
      success: true,
      error: false,
      count,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * 4️⃣ DELETE My List Item
 * DELETE /api/myList/:id
 * - Xoá 1 item khỏi My List (theo id của MyList, không phải productId)
 */
export const deleteToMyListController = async (request, response) => {
  try {
    const userId = request.userId;
    const { id } = request.params; // id = _id của MyList document

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized. Please login again.",
        error: true,
        success: false,
      });
    }

    if (!id) {
      return response.status(400).json({
        message: "Provide item id",
        error: true,
        success: false,
      });
    }

    const myListItem = await MyListModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!myListItem) {
      return response.status(404).json({
        message:
          "The item with this given ID was not found or not belong to user",
        error: true,
        success: false,
      });
    }

    // Đồng bộ xoá trong User.my_list
    await UserModel.updateOne({ _id: userId }, { $pull: { my_list: id } });

    return response.status(200).json({
      message: "The item has been removed from My List",
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

/**
 * (OPTIONAL) 5️⃣ CHECK My List item
 * GET /api/myList/check/:productId
 * - Kiểm tra 1 product đã nằm trong My List chưa
 */
export const checkMyListItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId } = request.params;

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized",
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

    const item = await MyListModel.findOne({ userId, productId });

    return response.status(200).json({
      success: true,
      error: false,
      isAdded: !!item,
      itemId: item?._id || null,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
