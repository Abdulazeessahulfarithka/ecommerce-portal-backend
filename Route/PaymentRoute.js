import express from "express";
import {
  createPaymentIntent,
  verifyPaymentIntent,
} from "../Controller/PaymentController.js";
import { requireAuth } from "../MiddleWare/AuthMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", requireAuth, createPaymentIntent);
router.get("/verify/:paymentIntentId", requireAuth, verifyPaymentIntent);

export default router;