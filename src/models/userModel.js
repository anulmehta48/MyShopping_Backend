import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    profileImage: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 15,
    },
    address: {
      shipping: {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
        },
      },
      billing: {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
        },
      },
    },
  },
  { timestamps: true }
);


const UserModel = mongoose.model("User", userSchema);

export default UserModel;