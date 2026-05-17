import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "",
      // Store <img> tag HTML or icon URL
    },
    sortOrder: {
      type: Number,
      default: 0,
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

// Always sort by sortOrder
CategorySchema.index({ sortOrder: 1 });

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
