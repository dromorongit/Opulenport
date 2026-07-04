import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import VehicleRequest from "@/models/VehicleRequest";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const requests = await VehicleRequest.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      requests.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        phone: r.phone,
        makeModel: r.makeModel,
        yearRange: r.yearRange ?? "",
        budgetRangeGHS: r.budgetRangeGHS ?? "",
        sourceCountryPreference: r.sourceCountryPreference ?? "",
        additionalDetails: r.additionalDetails ?? "",
        status: r.status ?? "new",
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Vehicle requests fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load vehicle requests." },
      { status: 500 }
    );
  }
}