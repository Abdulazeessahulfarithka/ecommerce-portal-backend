import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../Controller/OrderController.js";
import { requireAuth, requireAdmin } from "../MiddleWare/AuthMiddleware.js";

const router = express.Router();

router.post("/create", requireAuth, createOrder);
router.get("/my-orders", requireAuth, getMyOrders);
router.get("/all", requireAuth, requireAdmin, getAllOrders);
router.get("/:id", requireAuth, getOrderById);
router.put("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

export default router;