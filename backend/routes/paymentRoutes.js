
import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  verifyQrPayment,
  getReceipt,
  updateOrderStatus,
  getAllOrders,
  getOrderStatus,
  getUserOrders,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", isAuthenticated, createPaymentOrder);
paymentRouter.post("/verify-payment", isAuthenticated, verifyPayment); // <-- Updated from "/verify" to "/verify-payment"
paymentRouter.post("/verify-qr", isAuthenticated, verifyQrPayment);
paymentRouter.get("/receipt/:orderId", isAuthenticated, getReceipt);
paymentRouter.get("/all-orders", isAuthenticated, getAllOrders);
paymentRouter.put("/update-status/:id", isAuthenticated, updateOrderStatus);
paymentRouter.get("/order-status/:orderId", isAuthenticated, getOrderStatus);
paymentRouter.get("/my-orders", isAuthenticated, getUserOrders);
export default paymentRouter;