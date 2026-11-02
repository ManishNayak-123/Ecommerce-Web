import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ORDER_API_END_POINT } from "./Utils/Api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Fetch real order history from backend on mount
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${ORDER_API_END_POINT}/my-orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load order history.");
        }

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(error.message || "Could not fetch your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  // Handle Order Cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${ORDER_API_END_POINT}/update-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ orderStatus: "Cancelled" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order.");
      }

      // Update local state instantly to show "Cancelled" status
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord._id === orderId ? { ...ord, orderStatus: "Cancelled" } : ord
        )
      );

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(error.message || "Could not cancel order.");
    }
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <Navbar />
      
      <div className="max-w-4xl w-full mx-auto px-4 py-28 flex-grow">
        <Toaster position="top-center" />
        <h2 className="text-2xl font-black text-slate-900 mb-6">My Order History</h2>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p className="text-slate-500 text-sm font-semibold">Loading your purchases...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-4xl block mb-2">📦</span>
            <p className="text-slate-700 font-bold">You haven't placed any orders yet.</p>
            <p className="text-slate-400 text-xs mt-1">Explore our tiffin menus and start your first subscription!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentOrders.map((order) => {
                const currentStatus = order.orderStatus || order.status || "Pending";

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-slate-400">
                          Order ID: {order._id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            currentStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : currentStatus === "Delivered" || currentStatus === "Order Placed"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </div>

                      {/* Display items inside the order */}
                      <div className="space-y-1 mb-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="text-sm text-slate-700 font-medium flex items-center gap-2"
                          >
                            <span>• {item.name}</span>
                            <span className="text-slate-400">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                      <span className="text-lg font-black text-slate-900">
                        ₹{order.totalAmount}
                      </span>

                      {/* Show Cancel button only if status allows cancellation */}
                      {(currentStatus === "Pending" || currentStatus === "Processing") && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 transition cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition ${
                        currentPage === pageNumber
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}