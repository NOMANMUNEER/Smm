import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Service from "@/models/Service";
import User from "@/models/User";
import { authenticate } from "@/lib/auth";

// GET: Fetch user's orders
export async function GET(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ userId: decoded.userId })
      .populate({
        path: "serviceId",
        select: "name serviceType",
        populate: { path: "categoryId", select: "name icon" },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST: Place a new order
export async function POST(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { serviceId, link, quantity, comments } = await request.json();

    // Validate service
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return NextResponse.json(
        { message: "Service not found or inactive" },
        { status: 404 }
      );
    }

    // Validate quantity
    if (quantity < service.min || quantity > service.max) {
      return NextResponse.json(
        { message: `Quantity must be between ${service.min} and ${service.max}` },
        { status: 400 }
      );
    }

    // Validate comments for custom_comments type
    if (service.serviceType === "custom_comments" && !comments) {
      return NextResponse.json(
        { message: "Comments are required for this service" },
        { status: 400 }
      );
    }

    // Calculate total charge: (price / 1000) * quantity
    const totalCharge = parseFloat(((service.price / 1000) * quantity).toFixed(2));

    // Check user balance
    const user = await User.findById(decoded.userId);
    if (user.balance < totalCharge) {
      return NextResponse.json(
        { message: "Insufficient balance. Please add funds." },
        { status: 400 }
      );
    }

    // Deduct balance and add to totalSpent
    user.balance -= totalCharge;
    user.totalSpent += totalCharge;
    await user.save();

    // Create order
    const order = await Order.create({
      userId: decoded.userId,
      serviceId,
      link,
      quantity,
      totalCharge,
      comments: service.serviceType === "custom_comments" ? comments : "",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
