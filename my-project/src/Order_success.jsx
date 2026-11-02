import React from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve the receipt and orderId passed from CheckoutPayment.jsx
  const { receipt, orderId } = location.state || {};

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 pt-28 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Payment Confirmed & Order Placed!
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Thank you for your order. We are getting it ready for delivery.
            </p>
          </div>

          {receipt ? (
            <div className="bg-slate-50 rounded-2xl p-4 text-left text-sm space-y-3 border">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Receipt Number</span>
                <span className="font-bold">{receipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono text-xs font-bold">{receipt.orderId || orderId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Payment Status</span>
                <span className="font-bold text-green-600 uppercase">{receipt.paymentStatus}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="font-black text-orange-600">₹{receipt.totalPaid?.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Order ID: <span className="font-mono font-bold">{orderId || "N/A"}</span>
            </p>
          )}

          <div className="pt-4 flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}