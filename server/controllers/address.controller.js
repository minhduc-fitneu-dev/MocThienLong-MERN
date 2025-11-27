import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

// ✅ Add New Address
export const addAddressController = async (request, response) => {
  try {
    const { address_line1, city, state, pincode, country, mobile, status } =
      request.body;
    const userId = request.userId;

    if (!address_line1 || !city || !state || !pincode || !country || !mobile) {
      return response.status(400).json({
        message: "Please provide all fields",
        error: true,
      });
    }

    // ✅ Check if user has existing addresses
    const existingCount = await AddressModel.countDocuments({ userId });

    const address = new AddressModel({
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      status: typeof status === "boolean" ? status : true,
      isDefault: existingCount === 0, // ✅ first address auto default
      userId,
    });

    const savedAddress = await address.save();

    await UserModel.updateOne(
      { _id: userId },
      { $push: { address_details: savedAddress._id } }
    );

    return response.status(200).json({
      message: "Address added successfully",
      error: false,
      data: savedAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

// ✅ Get Address List
export const getAddressListController = async (request, response) => {
  try {
    const userId = request.userId;

    const addressList = await AddressModel.find({ userId }).sort({
      isDefault: -1, // ✅ default first
      createdAt: -1,
    });

    return response.status(200).json({
      message: "Address list fetched",
      error: false,
      data: addressList,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

// ✅ Set Default Address
export const setDefaultAddressController = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.body;

    if (!addressId) {
      return res
        .status(400)
        .json({ error: true, message: "Address ID required" });
    }

    // Bỏ default cũ
    await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });

    // Set default mới
    await AddressModel.findByIdAndUpdate(addressId, { isDefault: true });

    const updatedList = await AddressModel.find({ userId }).sort({
      createdAt: -1,
    });

    return res.json({
      error: false,
      message: "Default address updated",
      data: updatedList,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// ✅ Delete Address
// ✅ Delete Address
export const deleteAddressController = async (request, response) => {
  try {
    const { addressId } = request.params;
    const userId = request.userId;

    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
      });
    }

    // Xóa trong bảng Address
    await AddressModel.deleteOne({ _id: addressId });

    // Gỡ ID khỏi user.address_details
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { address_details: addressId } }
    );

    // Nếu địa chỉ bị xóa là default → gán default cho địa chỉ mới nhất
    if (address.isDefault) {
      const latest = await AddressModel.findOne({ userId }).sort({
        createdAt: -1,
      });
      if (latest) {
        await AddressModel.findByIdAndUpdate(latest._id, { isDefault: true });
      }
    }

    // ✅ Lấy danh sách mới trả về cho UI
    const updatedList = await AddressModel.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return response.status(200).json({
      message: "Address deleted successfully",
      error: false,
      data: updatedList,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      error: true,
    });
  }
};
