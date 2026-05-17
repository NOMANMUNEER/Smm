import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { authenticate } from "@/lib/auth";

// GET: Fetch all orders (admin) with optional status filter
export async function GET(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("userId", "userName email balance")
      .populate({
        path: "serviceId",
        select: "name serviceType price",
        populate: { path: "categoryId", select: "name" },
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
