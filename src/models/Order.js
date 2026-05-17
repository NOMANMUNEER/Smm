import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    link: {
      type: String,
      required: [true, "Target link is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
    totalCharge: {
      type: Number,
      required: true,
      min: 0,
      // Calculated as: (price / 1000) * quantity
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "In Progress", "Completed", "Cancelled", "Partial"],
      default: "Pending",
    },
    comments: {
      type: String,
      default: "",
      // Only filled when serviceType === "custom_comments"
    },
    externalOrderId: {
      type: String,
      default: "",
      // Third-party order ID — populated when API integration is added
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
