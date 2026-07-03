import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).lean();
    return NextResponse.json(
      services.map((s) => ({
        id: s._id?.toString(),
        name: s.name,
        category: s.category,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load services." },
      { status: 500 }
    );
  }
}
