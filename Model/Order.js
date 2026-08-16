import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // snapshot — keeps history correct if the product is later renamed/deleted
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // price at time of purchase
  },
  { _id: false }
);

// Snapshot of the shipping address at time of order — never a live reference to
// User.addresses, so editing/deleting an address later doesn't rewrite past orders.
const shippingAddressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    shippingAddress: shippingAddressSchema,
    stripePaymentIntentId: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
