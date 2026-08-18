import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  addReview,
} from "../Controller/ProductController.js";
import { requireAuth, requireAdmin } from "../MiddleWare/AuthMiddleware.js";
import upload from "../MiddleWare/UploadMiddleware.js";

const router = express.Router();

// Public routes — anyone can browse products
router.get("/", getProducts);
router.get("/:id", getProductById);

// Logged-in users can leave a review
router.post("/:id/review", requireAuth, addReview);

// Admin-only routes. upload.array("images", 5) parses multipart/form-data
// and accepts up to 5 files under the field name "images".
router.post(
  "/create-product",
  requireAuth,
  requireAdmin,
  upload.array("images", 5),
  createProduct
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  upload.array("images", 5),
  updateProduct
);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;