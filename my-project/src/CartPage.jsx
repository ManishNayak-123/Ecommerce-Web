import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router"; // Adjust to 'react-router-dom' if that's what you use
import { updateQuantity, removeFromCart } from "./ReduxToolKit/cartSlice.js"; // Make sure this path matches your file structure
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalItemsCount = useSelector((state) => state.cart.totalCount);
  const dispatch = useDispatch();

  // Helper function to handle string prices (e.g., "₹149" -> 149)[cite: 1]
  const parsePrice = (priceStr) => {
    if (typeof priceStr === "number") return priceStr;
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  // Calculate dynamic subtotals[cite: 1]
  const subtotalPrice = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  // Free shipping rules (Free over ₹500, otherwise ₹40 flat fee)[cite: 1]
  const deliveryCharges = subtotalPrice > 500 || subtotalPrice === 0 ? 0 : 40;
  const grandTotal = subtotalPrice + deliveryCharges;

  return (
    <div className="min-h-screen w-full bg-orange-50 text-slate-900 pt-24 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <h1 className="text-2xl sm:text-3xl font-black mb-6 text-slate-800 tracking-tight">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          /* Empty Cart State Window */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-xl mx-auto mt-8">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Your Tiffin Box is empty
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Looks like you haven't added any home-cooked meals to your tiffin
              yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition duration-200 shadow-md shadow-orange-500/10"
            >
              Explore Popular Meals
            </Link>
          </div>
        ) : (
          /* Amazon Two Column Shopping Grid Layout */
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Left Hand Grid: Selected Items Checklist Box */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm">
                <div className="hidden sm:flex justify-between border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Product Details</span>
                  <span className="pr-12">Price</span>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start justify-between border-b border-slate-100 last:border-0 py-5 gap-4"
                  >
                    {/* Item Card Context Elements */}
                    <div className="flex gap-4 items-start w-full sm:max-w-md">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <img
                            src={
                              item.image?.startsWith("http")
                                ? item.image
                                : `http://localhost:8000/uploads/${item.image}`
                            }
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-800 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                          Freshly Prepared & In Stock
                        </p>

                        {/* Quantity Counter Switch Widget */}
                        <div className="flex items-center gap-4 pt-3">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 shadow-inner">
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  }),
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg active:scale-90 transition disabled:opacity-40"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  }),
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg active:scale-90 transition"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-xs font-bold text-red-500 hover:text-red-600 transition underline underline-offset-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Math Evaluation Column */}
                    <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end gap-1 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
                      <span className="text-xs text-slate-400 font-medium sm:hidden">
                        Total Price
                      </span>
                      <span className="text-lg font-black text-slate-800 whitespace-nowrap">
                        ₹{parsePrice(item.price) * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hand Grid: Sticky Checkout Widget Panel */}
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex justify-between text-slate-600 text-sm font-medium">
                    <span>Subtotal ({totalItemsCount} items):</span>
                    <span className="font-bold text-slate-800">
                      ₹{subtotalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-sm font-medium">
                    <span>Delivery Charges:</span>
                    <span
                      className={`font-bold ${deliveryCharges === 0 ? "text-green-600" : "text-slate-800"}`}
                    >
                      {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                    </span>
                  </div>
                  {deliveryCharges > 0 && (
                    <p className="text-[11px] bg-orange-50 text-orange-600 rounded-lg p-2 font-medium">
                      💡 Add items worth <b>₹{500 - subtotalPrice}</b> more for
                      FREE delivery!
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base font-bold text-slate-800">
                    Grand Total:
                  </span>
                  <span className="text-2xl font-black text-orange-500">
                    ₹{grandTotal}
                  </span>
                </div>

                <Link to="/payment_checkout">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-center tracking-wide mt-2">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>

              {/* Security Banner Footer Element */}
              <div className="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <span>🔒</span> Secure Transaction. Cancel subscription anytime.
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
