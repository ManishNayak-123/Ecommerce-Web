
import Driver from "../models/driverModel.js";
import Order from "../models/orderModel.js";

// Register / Apply as a driver
export const registerDriver = async (req, res) => {
  try {
    const { fullName, phone, city, vehicleType } = req.body;

    if (!fullName || !phone || !city || !vehicleType) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if driver already applied with this phone
    const existingDriver = await Driver.findOne({ phone });
    if (existingDriver) {
      return res.status(400).json({ success: false, message: "A driver application with this phone number already exists." });
    }

    const newDriver = await Driver.create({
      fullName,
      phone,
      city,
      vehicleType,
      status: "Pending", // Default initial status
    });

    res.status(201).json({
      success: true,
      message: "Driver application submitted successfully!",
      driver: newDriver,
    });
  } catch (error) {
    console.error("Error registering driver:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// Fetch all drivers for Admin Dashboard

export const getAllDrivers = async (req, res) => {
  try {
    // Remove the status filter so ALL registered drivers appear in the dropdown
    const drivers = await Driver.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch drivers" });
  }
};
// Update Driver Clearance Status (Admin Dashboard Dropdown)
export const updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status value is required" });
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' }
    );

    if (!updatedDriver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({
      success: true,
      message: `Driver status updated to ${status}!`,
      driver: updatedDriver,
    });
  } catch (error) {
    console.error("Error updating driver status:", error);
    res.status(500).json({ success: false, message: "Failed to update driver status" });
  }
};

// Admin assigns a registered driver to a specific tiffin order
export const assignDriverToOrder = async (req, res) => {
  try {
    const { orderId, driverId } = req.body;

    if (!orderId || !driverId) {
      return res.status(400).json({ success: false, message: "Order ID and Driver ID are required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        assignedDriver: driverId, 
        orderStatus: "Out for Delivery" 
      },
      { returnDocument: 'after' }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Driver assigned successfully!",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error assigning driver to order:", error);
    res.status(500).json({ success: false, message: "Failed to assign driver" });
  }
};


export const getAssignedOrders = async (req, res) => {
  try {
    const driverId = req.params.id || req.query.driverId;

    let query = { orderStatus: { $ne: "Delivered" } };
    
    if (driverId && driverId !== "undefined" && driverId !== "null") {
      query.assignedDriver = driverId; // Strictly filters by the logged-in driver's ID
    } else {
      // Returns no orders if no valid driver ID is detected
      return res.status(200).json({ success: true, count: 0, orders: [] });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching driver orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id || req.params.orderId || req.body.orderId;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // STRICT CHECK: Verify if the assigned driver is approved in the database
    if (order.assignedDriver) {
      const driver = await Driver.findById(order.assignedDriver);
      if (driver) {
        const driverStatus = (driver.status || "").trim().toLowerCase();
        if (driverStatus !== "approved" && driverStatus !== "active") {
          return res.status(403).json({
            success: false,
            message: "Delivery blocked! Your driver account is pending admin approval.",
          });
        }
      }
    }

    // Proceed with delivery update if approved
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { returnDocument: 'after' }
    );

    res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating status" });
  }
};

// Example validation inside your driver controller (e.g., getDriverOrders or updateOrderStatus)
export const verifyDriverApproval = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.user.id || req.params.driverId);
    
    if (!driver || (driver.status !== "Approved" && driver.status !== "Active")) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Your delivery partner account is pending admin approval or has been suspended.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error verifying driver status." });
  }
};