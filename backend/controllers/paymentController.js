
import crypto from "crypto";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order using prices stored in MongoDB.
export const createPaymentOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const requiredFields = ["name", "phone", "houseNo", "city", "state", "pincode"];
    if (!deliveryAddress || requiredFields.some((field) => !String(deliveryAddress[field] ?? "").trim())) {
      return res.status(400).json({ message: "Please provide a complete delivery address." });
    }

    // Calculate subtotal and total amount securely from backend/database data
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;

    // Save a pending order in MongoDB
    const order = await orderModel.create({
      user: req.user._id,
      items: items.map(item => ({
        product: item.productId || item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      deliveryAddress,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentProvider: paymentMethod === "QR" ? "static_qr" : "razorpay",
      paymentStatus: "pending",
    });

    // If using Razorpay Gateway
    if (paymentMethod !== "QR") {
      try {
        const gatewayOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Ensure amount is an integer in paise
          currency: "INR",
          receipt: String(order._id),
          notes: { databaseOrderId: String(order._id) },
        });

        order.gatewayOrderId = gatewayOrder.id;
        await order.save();

        return res.status(201).json({
          success: true,
          orderId: order._id,
          gatewayOrderId: gatewayOrder.id,
          amount: gatewayOrder.amount,
          currency: gatewayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID,
        });
      } catch (gatewayError) {
        // Detailed logging to help debug 502 Bad Gateway errors
        console.error("Gateway order creation failed details:", gatewayError);
        const errorMsg = gatewayError.error?.description || gatewayError.message || "Unknown gateway error";
        return res.status(502).json({ 
          message: "Unable to start payment gateway. Please retry.", 
          error: errorMsg 
        });
      }
    }

    // For Static QR code flow, return order ID for backend tracking
    return res.status(201).json({
      success: true,
      message: "Payment order initialized.",
      orderId: order._id,
      totalAmount,
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    return res.status(500).json({ message: "Unable to create order." });
  }
};

// Verify Static QR / Manual Payment on Backend
export const verifyQrPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Server-side verification update
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paidAt = new Date();
    await order.save();

    return res.json({
      success: true,
      message: "Payment verified successfully by backend.",
      orderId: order._id,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error("QR Payment verification error:", error);
    return res.status(500).json({ message: "Could not verify payment." });
  }
};

// Confirm Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await orderModel.findOne({ _id: orderId, user: req.user._id });
    if (!order || order.gatewayOrderId !== razorpay_order_id) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.paymentStatus === "paid") {
      return res.json({ success: true, message: "Payment already verified.", orderId: order._id });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.gatewayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment signature verification failed." });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "Order Placed";
    order.gatewayPaymentId = razorpay_payment_id
    order.paidAt = new Date();
    await order.save();

    return res.json({ success: true, message: "Payment verified successfully.", orderId: order._id });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: "Could not verify payment." });
  }
};

// Retrieve Receipt
export const getReceipt = async (req, res) => {
  try {
    const order = await orderModel.findOne({
      _id: req.params.orderId,
      user: req.user._id,
      paymentStatus: "paid",
    });

    if (!order) {
      return res.status(404).json({ message: "Paid order receipt not found." });
    }

    return res.json({
      receipt: {
        receiptNumber: `INV-${order._id}`,
        orderId: order._id,
        date: order.paidAt,
        customer: order.deliveryAddress,
        items: order.items,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        totalPaid: order.totalAmount,
        paymentStatus: order.paymentStatus,
        paymentId: order.gatewayPaymentId || "QR_UPI_VERIFIED",
      },
    });
  } catch (error) {
    console.error("Receipt error:", error);
    return res.status(500).json({ message: "Unable to retrieve receipt." });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("user", "name email").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    return res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Update order status from admin panel
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({ success: true, message: "Order status updated successfully.", order });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Failed to update status." });
  }
};

// Get single order status for user tracking
export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("Looking up order ID in database:", orderId); // <-- Add this log

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get order status error:", error);
    return res.status(500).json({ message: "Could not fetch order status." });
  }
};

// Add this to your paymentController.js or orderController.js
export const getUserOrders = async (req, res) => {
  try {
    // req.user._id comes from your isAuthenticated middleware
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return res.status(500).json({ message: "Failed to fetch order history." });
  }
};