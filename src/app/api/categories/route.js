import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

// GET: Fetch all active categories (sorted by sortOrder)
export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({ isActive: true }).sort({
      sortOrder: 1,
    });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
