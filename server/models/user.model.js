import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Provide name"] },

    email: { type: String, required: [true, "Provide email"], unique: true },

    password: {
      type: String,
      required: function () {
        return !this.signUpWithGoogle;
      },
      default: "",
    },

    avatar: { type: String, default: "" },

    mobile: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(0[0-9]{9})$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      default: "",
    },

    verify_email: { type: Boolean, default: false },

    last_login_date: { type: Date, default: null },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    address_details: [{ type: mongoose.Schema.ObjectId, ref: "address" }],
    shopping_cart: [{ type: mongoose.Schema.ObjectId, ref: "cartProduct" }],
    orderHistory: [{ type: mongoose.Schema.ObjectId, ref: "order" }],
    // ⭐ Danh sách yêu thích (My List)
    my_list: [{ type: mongoose.Schema.ObjectId, ref: "MyList" }],

    forgot_password_otp: { type: String, default: null },
    forgot_password_expiry: { type: Date, default: null },

    otp: { type: String },
    otpExpires: { type: Date },

    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },

    signUpWithGoogle: {
      type: Boolean,
      default: false,
    },

    // ⭐ Bổ sung để refresh token hoạt động đúng:
    refresh_token: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
