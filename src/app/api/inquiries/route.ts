import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { quoteRequestSchema } from "@/lib/validations/forms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    await connectDB();

    const inquiry = await Inquiry.create({
      ...parsed.data,
      status: "new",
    });

    return NextResponse.json(
      { id: inquiry._id?.toString(), message: "Inquiry submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}