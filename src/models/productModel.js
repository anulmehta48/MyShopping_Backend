import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currencyId: {
      type: String,
      required: true,
      enum: ["INR"], // Only allow 'INR' currency
    },
    currencyFormat: {
      type: String,
      required: true,
      default: "₹", // Rupee symbol
    },
    isFreeShipping: {
      type: Boolean,
      default: false,
    },
    productImage: {
      type: String,
      required: true,
    },
    style: {
      type: String,
    },
    availableSizes: {
      type: [String],
      required: true,
      enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
    },
    installments: Number,
    deletedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
