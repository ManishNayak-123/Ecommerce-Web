
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import AdminHeader from "./AdminHeader";
import { ORDER_API_END_POINT, FOOD_API_END_POINT, DRIVER_API_END_POINT } from "../Utils/Api";
import { useNavigate } from "react-router";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Real orders, menu items, and drivers fetched from backend
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [drivers, setDrivers] = useState([]);

  // Pagination states for Live Orders
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const navigate = useNavigate();

  // Fetch live orders and registered drivers on mount/tab change
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingOrders(true);
      try {
        // 1. Fetch Live Orders
        const orderResponse = await fetch(`${ORDER_API_END_POINT}/all-orders`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const orderData = await orderResponse.json();

        if (orderResponse.ok) {
          const formattedOrders = (orderData.orders || orderData || []).map((ord) => ({
            id: ord._id,
            customer: ord.deliveryAddress?.name || ord.user?.name || "Customer",
            itemSummary: ord.items?.map(i => `${i.name} (x${i.quantity})`).join(", ") || "Tiffin Meal",
            amount: `₹${ord.totalAmount}`,
            status: ord.orderStatus || ord.paymentStatus || "Order Placed",
            assignedDriver: ord.assignedDriver?._id || ord.assignedDriver || "",
            paymentStatus: ord.paymentStatus,
            createdAt: ord.createdAt,
          }));
          setOrders(formattedOrders);
        }
        const driverResponse = await fetch(`${DRIVER_API_END_POINT}/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        
        const driverData = await driverResponse.json();
        
        if (driverResponse.ok) {
          // Safely extract drivers whether backend returns an array or an object
          const driverList = Array.isArray(driverData) 
            ? driverData 
            : (driverData.drivers || driverData.data || []);
            
          setDrivers(driverList);
        } else {
          console.error("Failed to load drivers:", driverData.message || driverResponse.statusText);
        }

      } catch (error) {
        console.error("Error fetching admin dispatch data:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (activeTab === "orders") {
      fetchAdminData();
    }
  }, [activeTab]);

  // Fetch menu/meals catalog
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoadingMenu(true);
      try {
        const response = await fetch(`${FOOD_API_END_POINT}/all`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          const formattedMeals = (data.foods || data.meals || data || []).map((meal) => ({
            id: meal._id || meal.id,
            title: meal.name || meal.title || "Tiffin Meal",
            price: `₹${meal.price}`,
            category: meal.category || "General",
            status: meal.isAvailable !== false ? "Available" : "Sold Out",
          }));
          setMenuItems(formattedMeals);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoadingMenu(false);
      }
    };

    if (activeTab === "menu") {
      fetchMenuItems();
    }
  }, [activeTab]);

  // Handler to assign a driver to an order
  const handleAssignDriver = async (orderId, driverId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Admin token missing!");
      return;
    }

    try {
      const response = await fetch(`${DRIVER_API_END_POINT}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ orderId, driverId }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, assignedDriver: driverId, status: "Out for Delivery" } : o));
        alert("Driver assigned successfully! Status updated to Out for Delivery.");
      } else {
        alert(data.message || "Failed to assign driver.");
      }
    } catch (error) {
      console.error("Driver assignment error:", error);
      alert("Could not assign driver.");
    }
  };

  // Handler to update order status step
  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${ORDER_API_END_POINT}/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update status on server.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Could not update order status.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recent Order";
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Pagination calculations
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 pt-24 flex flex-col justify-between font-sans">
      <AdminHeader />

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        
        {/* ADMIN HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-red-100 text-red-600 font-bold text-xs rounded-full uppercase tracking-wider mb-1">
              Administrator Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              TiffinBox Management Dashboard
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "dashboard" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "orders" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Live Orders & Dispatch
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "menu" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Menu Items
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
                <h3 className="text-3xl font-black text-slate-800 mt-1">
                  ₹{orders.reduce((acc, o) => acc + Number(o.amount.replace(/[^0-9.]/g, "") || 0), 0)}
                </h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Orders</span>
                <h3 className="text-3xl font-black text-orange-500 mt-1">{orders.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Registered Drivers</span>
                <h3 className="text-3xl font-black text-blue-600 mt-1">{drivers.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Kitchen Status</span>
                <h3 className="text-3xl font-black text-green-600 mt-1">Active 🟢</h3>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS & DISPATCH */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-800">Customer Order Dispatch Pipeline</h2>
                <span className="text-xs text-slate-400 font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                  Total Orders: {orders.length}
                </span>
              </div>
              
              {loadingOrders ? (
                <div className="text-center py-12 text-slate-400 font-bold">Loading orders and drivers...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-medium bg-slate-50 rounded-2xl">
                  No paid orders found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Assign Driver</th>
                        <th className="py-3 px-4">Status Controller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium">
                      {currentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-4 font-mono text-xs font-bold text-slate-800">#{order.id.slice(-6)}</td>
                          <td className="py-4 px-4 text-slate-700 font-bold">{order.customer}</td>
                          <td className="py-4 px-4 text-slate-600 text-xs">{order.itemSummary}</td>
                          <td className="py-4 px-4 font-black text-orange-500">{order.amount}</td>
                          
                          {/* NEW: Assign Driver Dropdown */}
                          <td className="py-4 px-4">
                            <select
                              value={order.assignedDriver || ""}
                              onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                              className="bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
                            >
                              <option value="">Select Driver</option>
                              {drivers.map((driver) => (
                                <option key={driver._id} value={driver._id}>
                                  {driver.fullName} ({driver.city})
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Status Controller */}
                          <td className="py-4 px-4">
                            <select 
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 disabled:opacity-30"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-bold">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MENU */}
        {activeTab === "menu" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">Available Food Catalog</h2>
              <button 
                onClick={() => navigate("/admin/upload_food")}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                + Add New Meal
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((dish) => (
                <div key={dish.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{dish.title}</h4>
                    <span className="text-xs text-orange-500 font-bold">{dish.price}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                    {dish.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}