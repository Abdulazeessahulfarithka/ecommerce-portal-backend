import { Order } from "../Model/Order.js";
import Product from "../Model/Product.js";
import User from "../Model/User.js";



export const getDashboardStats = async (req, res) => {
  try {
    const [productCount, orderCount, userCount, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total status stripePaymentIntentId createdAt"),
    ]);

    // Revenue — only count orders that actually have a successful Stripe payment
    const revenue = orders
      .filter((o) => o.stripePaymentIntentId)
      .reduce((sum, o) => sum + o.total, 0);

    // Breakdown of orders by status, e.g. { PENDING: 3, SHIPPED: 5, ... }
    const statusBreakdown = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    // Last 7 days of order counts, useful for a simple trend chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrderCount = orders.filter(
      (o) => new Date(o.createdAt) >= sevenDaysAgo
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        productCount,
        orderCount,
        userCount,
        revenue,
        statusBreakdown,
        recentOrderCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const products = await Product.find({ stock: { $lte: threshold } }).select(
      "name stock image"
    );

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};