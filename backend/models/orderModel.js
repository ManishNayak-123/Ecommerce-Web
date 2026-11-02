
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      houseNo: { type: String, required: true },
      street: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    paymentProvider: {
      type: String,
      default: "razorpay",
    },
    gatewayOrderId: { type: String, unique: true, sparse: true },
    gatewayPaymentId: { type: String, unique: true, sparse: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    // Add this field into your existing orderSchema fields list:
assignedDriver: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Driver",
  default: null,
},

  orderStatus: {
  type: String,
  enum: ["Order Placed", "confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
  default: "Order Placed",
},

    paidAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model("Order",orderSchema);
export default Order;
