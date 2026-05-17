import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";

// GET: Fetch services — optionally filter by categoryId
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const filter = { isActive: true };
    if (categoryId) filter.categoryId = categoryId;

    const services = await Service.find(filter)
      .populate("categoryId", "name icon")
      .sort({ name: 1 });

    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch services" },
      { status: 500 }
    );
  }
}
