import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import VehicleRequest from "@/models/VehicleRequest";
import { vehicleRequestSchema } from "@/lib/validations/forms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = vehicleRequestSchema.safeParse(body);

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

    const vehicleRequest = await VehicleRequest.create({
      ...parsed.data,
      status: "new",
    });

    return NextResponse.json(
      { id: vehicleRequest._id?.toString(), message: "Vehicle request submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Vehicle request submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit vehicle request. Please try again." },
      { status: 500 }
    );
  }
}