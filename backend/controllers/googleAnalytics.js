


// controllers/analyticsController.js
import User from '../models/authModel.js';
import Contact from '../models/contactModel.js';
import Food from '../models/foodModel.js';
import Order from '../models/orderModel.js';
import Driver from '../models/driverModel.js'; // Imported Driver model for telemetry count

export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Fetch real counts and metrics from MongoDB
    const totalUsers = await User.countDocuments();
    const totalInquiries = await Contact.countDocuments();
    const totalProducts = await Food.countDocuments();
    const totalDrivers = await Driver.countDocuments(); // Count registered drivers[cite: 4]

    // Aggregate total revenue and units sold from orders
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalUnits: { $sum: "$totalQuantity" },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);

    const revenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;
    const unitsSold = orderStats.length > 0 ? orderStats[0].totalUnits : 0;
    const avgOrderValue = orderStats.length > 0 ? orderStats[0].avgOrderValue : 0;

    // 2. Fetch top products or recent requirements if needed
    const recentInquiries = await Contact.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      data: {
        activeUsers: totalUsers,
        totalProducts,
        totalInquiries,
        totalDrivers, // Included in response for AdminPerformanceM metrics card[cite: 4]
        revenue,
        unitsSold,
        avgOrderValue: Math.round(avgOrderValue),
        recentInquiries,
      }
    });
  } catch (error) {
    console.error("Analytics Fetch Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching live analytics."
    });
  }
};