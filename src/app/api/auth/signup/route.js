import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();
    const { userName, email, password } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email or username already registered" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({ userName, email, password });

    // Generate token
    const token = signToken({
      userId: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        token,
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          balance: user.balance,
          totalSpent: user.totalSpent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIGNUP ERROR:", error.message, error.stack);
    return NextResponse.json(
      { message: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
