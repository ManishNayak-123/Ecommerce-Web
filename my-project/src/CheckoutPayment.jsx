

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "./ReduxToolKit/cartSlice.js"; // Adjust path to your cartSlice if needed[cite: 4]
import { ORDER_API_END_POINT } from "./Utils/Api";

const initialAddress = {
  name: "",
  phone: "",
  houseNo: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

const parsePrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;
  return Number.parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
};

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Read the same Redux cart used by CartPage.jsx
  const cartItems = useSelector((state) => state.cart?.items || []);

  const [paymentTab, setPaymentTab] = useState("qr");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState(initialAddress);

  // Match the shipping calculation used by CartPage.jsx
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + parsePrice(item.price) * Number(item.quantity || 1),
    0
  );

  const deliveryCharges =
    subtotal > 500 || subtotal === 0 ? 0 : 40;

  const cartTotal = subtotal + deliveryCharges;

  // Load the saved delivery address safely
  useEffect(() => {
    try {
      const savedAddress = localStorage.getItem("userAddress");

      if (savedAddress) {
        const address = JSON.parse(savedAddress);
        setDeliveryDetails(address);
        setFormData({ ...initialAddress, ...address });
      } else {
        setIsEditingAddress(true);
      }
    } catch (error) {
      console.error("Could not load saved address:", error);
      setIsEditingAddress(true);
    }
  }, []);

  // QR countdown
  useEffect(() => {
    if (paymentTab !== "qr" || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [paymentTab, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleSaveAddress = (event) => {
    event.preventDefault();

    const requiredFields = [
      "name",
      "phone",
      "houseNo",
      "city",
      "state",
      "pincode",
    ];

    const missingField = requiredFields.some(
      (field) => !String(formData[field] || "").trim()
    );

    if (missingField) {
      alert("Please fill in all required delivery fields.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    localStorage.setItem("userAddress", JSON.stringify(formData));
    setDeliveryDetails(formData);
    setIsEditingAddress(false);
  };

  // Convert Redux items and include name & price to satisfy backend Mongoose schema validation.
  const getCartItems = () => {
    if (!Array.isArray(cartItems)) return [];

    return cartItems.map((item) => {
      const productId =
        item.productId ||
        item._id ||
        (typeof item.id === "string" ? item.id : "");

      return {
        productId:
          typeof productId === "string"
            ? productId.trim()
            : String(productId || ""),
        name: item.title || item.name || "Product",
        price: parsePrice(item.price),
        quantity: Number(item.quantity || 1),
      };
    });
  };

  const handlePaymentCheckout = async () => {
    if (loading) return;

    if (!cartItems.length) {
      alert("Your cart is empty. Please add products before checkout.");
      return;
    }

    const items = getCartItems();

    if (
      items.some(
        (item) =>
          !/^[a-f\d]{24}$/i.test(item.productId) ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
      )
    ) {
      alert(
        "A cart item has an invalid product ID or quantity. " +
          "Check that each cart item's id is the actual MongoDB product _id."
      );
      console.error("Invalid checkout items:", items);
      return;
    }

    if (
      !deliveryDetails ||
      !deliveryDetails.name ||
      !deliveryDetails.phone ||
      !deliveryDetails.houseNo ||
      !deliveryDetails.city ||
      !deliveryDetails.state ||
      !deliveryDetails.pincode
    ) {
      alert("Please save your complete delivery address first.");
      setIsEditingAddress(true);
      return;
    }

    // Retrieve authentication token securely from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on the backend[cite: 1]
      const orderResponse = await fetch(
        `${ORDER_API_END_POINT}/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            items,
            amount: cartTotal,
            deliveryAddress: deliveryDetails,
            paymentMethod: paymentTab === "qr" ? "QR" : "razorpay",
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message || "Could not create your order."
        );
      }

      // 2. Handle Razorpay Gateway Flow[cite: 1]
      if (paymentTab === "gateway") {
        const razorpayOrderId = orderData.gatewayOrderId;
        const razorpayKey = orderData.key;

        if (!razorpayOrderId) {
          throw new Error("Razorpay order ID was not returned by backend.");
        }

        // Safety check if Razorpay SDK script failed to load
        if (typeof window.Razorpay === "undefined") {
          throw new Error("Razorpay SDK failed to load. Please check your internet connection or ad-blockers.");
        }

        const options = {
          key: razorpayKey, // Dynamically loaded from backend environment response[cite: 1]
          amount: Math.round(cartTotal * 100),
          currency: "INR",
          name: "TiffinBox",
          description: "Order Checkout Payment",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // 3. Verify Razorpay signature on backend after successful payment popup[cite: 3]
              const verifyResponse = await fetch(
                `${ORDER_API_END_POINT}/verify-payment`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    orderId: orderData.orderId,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                }
              );

              const verifyData = await verifyResponse.json();

              if (!verifyResponse.ok || !verifyData.success) {
                throw new Error(verifyData.message || "Payment verification failed.");
              }

              const orderId = orderData.orderId;

              // 4. Fetch receipt[cite: 3]
              const receiptResponse = await fetch(
                `${ORDER_API_END_POINT}/receipt/${orderId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  credentials: "include",
                }
              );

              const receiptData = await receiptResponse.json();

              // Clear the cart state and storage upon successful payment
              dispatch(clearCart()); //[cite: 4]

              navigate("/order-success", {
                state: {
                  receipt: receiptData.receipt || receiptData,
                  orderId,
                },
              });
            } catch (err) {
              console.error("Payment verification error:", err);
              alert(err.message || "Payment verification failed.");
            }
          },
          prefill: {
            name: deliveryDetails?.name || "",
            contact: deliveryDetails?.phone || "",
          },
          theme: {
            color: "#f97316",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
        return;
      }

      // 3. Handle QR / Manual UPI Flow
      const orderId = orderData.orderId;

      if (!orderId) {
        throw new Error(
          "Order was created, but the backend did not return an order ID."
        );
      }

      const verifyResponse = await fetch(
        `${ORDER_API_END_POINT}/verify-qr`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ orderId }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(
          verifyData.message ||
            "Payment could not be verified. Please contact support."
        );
      }

      if (
        verifyData.paymentStatus !== "paid" &&
        verifyData.status !== "paid" &&
        verifyData.verified !== true &&
        verifyData.success !== true
      ) {
        throw new Error(
          "The backend has not confirmed payment. Your order has not " +
            "been treated as successfully paid."
        );
      }

      const receiptResponse = await fetch(
        `${ORDER_API_END_POINT}/receipt/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const receiptData = await receiptResponse.json();

      if (!receiptResponse.ok) {
        throw new Error(
          receiptData.message || "Payment succeeded, but receipt retrieval failed."
        );
      }

      // Clear the cart state and storage upon successful QR payment
      dispatch(clearCart()); //[cite: 4]

      navigate("/order-success", {
        state: {
          receipt: receiptData.receipt || receiptData,
          orderId,
        },
      });
    } catch (error) {
      console.error("Checkout payment error:", error);
      alert(error.message || "Payment process failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 pt-28 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="mb-8 text-center">
          <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 font-bold text-xs rounded-full uppercase mb-3">
            Secure Checkout
          </div>

          <h1 className="text-3xl sm:text-4xl font-black">
            Complete Your Payment
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            {cartItems.length} product type(s) · Total payable:{" "}
            <span className="text-orange-600 font-black">
              ₹{cartTotal.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-6">
            {/* Delivery address */}
            <section className="bg-white rounded-3xl border p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-black">📦 Delivery Address</h2>

                {deliveryDetails && !isEditingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs font-bold text-orange-600"
                  >
                    Change
                  </button>
                )}
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-3 text-sm bg-slate-50 border rounded-xl"
                      required
                    />

                    <input
                      placeholder="10-digit Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-3 text-sm bg-slate-50 border rounded-xl"
                      inputMode="numeric"
                      maxLength={10}
                      required
                    />
                  </div>

                  <input
                    placeholder="House No, Building"
                    value={formData.houseNo}
                    onChange={(e) =>
                      setFormData({ ...formData, houseNo: e.target.value })
                    }
                    className="w-full p-3 text-sm bg-slate-50 border rounded-xl"
                    required
                  />

                  <input
                    placeholder="Street / Area"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className="w-full p-3 text-sm bg-slate-50 border rounded-xl"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full min-w-0 p-3 text-sm bg-slate-50 border rounded-xl"
                      required
                    />

                    <input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full min-w-0 p-3 text-sm bg-slate-50 border rounded-xl"
                      required
                    />

                    <input
                      placeholder="6-digit Pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      className="w-full min-w-0 p-3 text-sm bg-slate-50 border rounded-xl"
                      inputMode="numeric"
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl"
                  >
                    Save Delivery Address
                  </button>
                </form>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl text-sm space-y-1">
                  <p className="font-bold">{deliveryDetails?.name}</p>
                  <p>{deliveryDetails?.phone}</p>
                  <p>
                    {deliveryDetails?.houseNo}, {deliveryDetails?.street}
                  </p>
                  <p>
                    {deliveryDetails?.city}, {deliveryDetails?.state} -{" "}
                    {deliveryDetails?.pincode}
                  </p>
                </div>
              )}
            </section>

            {/* Payment options */}
            <section className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentTab("qr")}
                  className={`py-3 rounded-lg font-bold text-sm ${
                    paymentTab === "qr"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  Scan QR / UPI
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab("gateway")}
                  className={`py-3 rounded-lg font-bold text-sm ${
                    paymentTab === "gateway"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  Razorpay
                </button>
              </div>

              {paymentTab === "qr" ? (
                <div className="text-center space-y-5">
                  <div className="w-52 h-52 mx-auto bg-white p-4 rounded-2xl border-2 border-orange-200 flex items-center justify-center">
                    <img
                      src="/scan.jpeg"
                      alt="UPI payment QR code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-xs text-slate-500">
                    QR timer: {formatTime(timeLeft)}
                  </p>

                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl">
                    Payment is complete only after your backend confirms that
                    the money was received. Clicking the button cannot verify
                    a bank transfer by itself.
                  </p>

                  <button
                    type="button"
                    onClick={handlePaymentCheckout}
                    disabled={loading || isEditingAddress || timeLeft === 0}
                    className="w-full py-4 bg-slate-950 hover:bg-orange-600 text-white font-bold rounded-xl disabled:opacity-50"
                  >
                    {loading
                      ? "Processing..."
                      : "I Have Made the Payment"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Pay securely using credit/debit card, UPI, net banking, or wallets via Razorpay.
                  </p>

                  <button
                    type="button"
                    onClick={handlePaymentCheckout}
                    disabled={loading || isEditingAddress}
                    className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl disabled:opacity-50 transition"
                  >
                    {loading ? "Processing..." : "Continue to Razorpay"}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Dynamic price breakdown */}
          <aside className="md:col-span-5 bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
            <h2 className="font-black text-lg border-b pb-4 mb-4">
              Price Breakdown
            </h2>

            <div className="space-y-4 text-sm">
              {cartItems.map((item, index) => (
                <div
                  key={item.id || item._id || index}
                  className="flex justify-between gap-3"
                >
                  <span className="text-slate-600">
                    {item.title || item.name || "Product"} ×{" "}
                    {item.quantity || 1}
                  </span>

                  <span className="font-bold whitespace-nowrap">
                    ₹
                    {(
                      parsePrice(item.price) * Number(item.quantity || 1)
                    ).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between border-t pt-4">
                <span>Items Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-bold">
                  {deliveryCharges === 0
                    ? "FREE"
                    : `₹${deliveryCharges.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4 text-lg font-black">
                <span>Total Payable</span>
                <span className="text-orange-600">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}