

import { Order } from "../Model/Order.js";
import { sendOrderConfirmationEmail } from "../Utils/sendEmail.js";
 
// ---------------------------------------------
// POST /api/order/create
// Called AFTER Stripe payment is confirmed (paymentIntent.status === "succeeded").
// Body: { items, shippingAddress, total, stripePaymentIntentId }
//   items: [{ product, name, quantity, price }]
//   shippingAddress: { line1, line2, city, state, postalCode, country }
// req.user comes from requireAuth middleware
// ---------------------------------------------
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, total, stripePaymentIntentId } = req.body;
 
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }
 
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      shippingAddress,
      stripePaymentIntentId,
      status: "PENDING", // moves to PACKED/SHIPPED/DELIVERED via admin updates
    });
 
    // Fire-and-forget confirmation email — doesn't block the response
    sendOrderConfirmationEmail(req.user.email, order);
 
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Order creation failed" });
  }
};
 
// ---------------------------------------------
// GET /api/order/my-orders
// Logged-in user's own order history
// ---------------------------------------------
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
 
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// ---------------------------------------------
// GET /api/order/:id
// Single order detail (owner or admin)
// ---------------------------------------------
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
 
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
 
    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }
 
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// ---------------------------------------------
// GET /api/order/all  (admin only)
// ---------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
 
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// ---------------------------------------------
// PUT /api/order/:id/status  (admin only)
// Body: { status: "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" }
// ---------------------------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
 
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
 
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
 
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
