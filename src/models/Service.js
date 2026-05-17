import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      // Rich HTML content — rules like "Don't private your account"
    },
    min: {
      type: Number,
      required: true,
      default: 100,
      min: 1,
    },
    max: {
      type: Number,
      required: true,
      default: 100000,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
      // Price charged to the user (e.g., Rs. 54)
    },
    actualPrice: {
      type: Number,
      default: 0,
      min: 0,
      // Cost to third-party provider — for profit calculation
    },
    serviceType: {
      type: String,
      enum: ["default", "custom_comments", "package"],
      default: "default",
    },
    providerId: {
      type: String,
      default: "manual",
      // Later: API provider name
    },
    externalServiceId: {
      type: String,
      default: "",
      // Third-party website's service ID (e.g., "6247")
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast category lookups
ServiceSchema.index({ categoryId: 1, isActive: 1 });

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
