import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, default: "Anonymous" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // FIX: was type: String — price needs to be Number for math (cart totals,
    // revenue sums) to work correctly instead of doing string concatenation.
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subCategory:{type:String,index:true},
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    // Added: addReview() in the controller pushes into this array —
    // it didn't exist in the schema before, which would crash.
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true }
);

// Used by addReview() after pushing a new review — recomputes avgRating/reviewCount
productSchema.methods.recalculateRating = function () {
  this.reviewCount = this.reviews.length;
  this.avgRating = this.reviewCount
    ? this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviewCount
    : 0;
};

// FIX: was mongoose.model("product", ...) — lowercase. Order.js references
// ref: "Product" (capital) for population, so the casing must match exactly.
export default mongoose.model("Product", productSchema);