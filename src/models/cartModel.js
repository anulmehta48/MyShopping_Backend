import mongoose from 'mongoose';
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    comment: 'Holds total price of all the items in the cart',
  },
  totalItems: {
    type: Number,
    required: true,
    comment: 'Holds total number of items in the cart',
  },
  
}, { timestamps: true });

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
