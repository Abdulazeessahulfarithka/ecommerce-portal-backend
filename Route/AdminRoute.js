import express from "express";
import {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts,
} from "../Controller/AdminController.js";
import { requireAuth, requireAdmin } from "../MiddleWare/AuthMiddleware.js";

const router = express.Router();

// Every route here is admin-only
router.get("/dashboard-stats", requireAuth, requireAdmin, getDashboardStats);
router.get("/recent-orders", requireAuth, requireAdmin, getRecentOrders);
router.get("/low-stock", requireAuth, requireAdmin, getLowStockProducts);

export default router;