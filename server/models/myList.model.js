// models/myList.model.js
import mongoose from "mongoose";

const myListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MyListModel = mongoose.model("MyList", myListSchema);

export default MyListModel;
