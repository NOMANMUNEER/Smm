import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { authenticate } from "@/lib/auth";

// GET: Fetch all categories (admin — includes inactive)
export async function GET(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const categories = await Category.find().sort({ sortOrder: 1 });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const category = await Category.create(body);

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
