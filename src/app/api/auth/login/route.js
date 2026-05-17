import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate token
    const token = signToken({
      userId: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        balance: user.balance,
        totalSpent: user.totalSpent,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message, error.stack);
    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
