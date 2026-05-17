import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";
import { authenticate } from "@/lib/auth";

// GET: Fetch all services (admin — includes inactive)
export async function GET(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const services = await Service.find()
      .populate("categoryId", "name icon")
      .sort({ categoryId: 1, name: 1 });

    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST: Create a new service
export async function POST(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const service = await Service.create(body);

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}
