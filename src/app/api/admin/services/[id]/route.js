import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";
import { authenticate } from "@/lib/auth";

// PATCH: Update a service (e.g., toggle active)
export async function PATCH(request, { params }) {
  try {
    const decoded = await authenticate(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const service = await Service.findByIdAndUpdate(id, body, { new: true });
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a service
export async function DELETE(request, { params }) {
  try {
    const decoded = await authenticate(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    await Service.findByIdAndDelete(id);

    return NextResponse.json({ message: "Service deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete service" },
      { status: 500 }
    );
  }
}
