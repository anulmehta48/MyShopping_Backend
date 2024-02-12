import mongoose from 'mongoose';
const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    comment: 'Holds total price of all the items in the order',
  },
  totalItems: {
    type: Number,
    required: true,
    comment: 'Holds total number of items in the order',
  },
  totalQuantity: {
    type: Number,
    required: true,
    comment: 'Holds total number of quantity in the order',
  },
  cancellable: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'cancelled'],
  },
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
