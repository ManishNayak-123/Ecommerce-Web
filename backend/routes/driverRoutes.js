
import express from "express";
import { 
  getAllDrivers, 
  getAssignedOrders, 
  registerDriver, 
  assignDriverToOrder, 
  updateOrderStatus,
  updateDriverStatus
} from "../controllers/driverController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import Driver from "../models/driverModel.js";

const driverRouter = express.Router();

// Middleware to block unapproved drivers on the backend level


// Robust Middleware to check if driver is approved
const verifyDriverIsApproved = async (req, res, next) => {
  try {
    // 1. Get driver ID from req.user (attached by isAuthenticated) or fallback search parameters
    const driverId = req.user?.id || req.user?._id || req.params.driverId || req.body.driverId;

    // If updating order status, the param `:id` is the orderId, NOT the driverId.
    // So we lookup by req.user first. If req.user isn't populated, we allow the request or check token data.
    if (!driverId) {
      // If we can't strictly verify driver via token user, let the controller handle authentication
      return next();
    }

    let driver = await Driver.findById(driverId).catch(() => null);
    
    if (!driver) {
      driver = await Driver.findOne({ 
        $or: [{ _id: driverId }, { userId: driverId }] 
      });
    }

    // If driver record exists, verify status
    if (driver) {
      const driverStatus = (driver.status || "").trim().toLowerCase();
      if (driverStatus !== "approved" && driverStatus !== "active") {
        return res.status(403).json({
          success: false,
          message: `Access denied. Your account status is '${driver.status}'. Admin approval required.`,
        });
      }
      req.driver = driver;
    }

    next();
  } catch (error) {
    console.error("Error in verifyDriverIsApproved middleware:", error);
    // Proceed or fail gracefully so it doesn't block valid delivery completions
    next();
  }
};

// 1. Public route: New drivers can apply without being logged in[cite: 10]
driverRouter.post("/register", registerDriver);

// 2. Protected admin & driver routes
driverRouter.get("/all", isAuthenticated, getAllDrivers);

// Block unapproved drivers from fetching orders[cite: 10]
driverRouter.get("/orders/:id", isAuthenticated, verifyDriverIsApproved, getAssignedOrders);

driverRouter.post("/assign", assignDriverToOrder);

// Admin route for updating driver clearance status from Admin Performance panel[cite: 10]
driverRouter.put("/update-status/:id", isAuthenticated, isAdmin, updateDriverStatus);

// Block unapproved drivers from marking orders as delivered[cite: 10]
driverRouter.put("/order/status/:id", isAuthenticated, verifyDriverIsApproved, updateOrderStatus);

export default driverRouter;