import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import SupplierContactRequest from "@/models/SupplierContactRequest";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const requests = await SupplierContactRequest.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      requests.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        phone: r.phone,
        businessName: r.businessName ?? "",
        productCategory: r.productCategory,
        sourceCountry: r.sourceCountry,
        details: r.details,
        status: r.status ?? "new",
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Supplier contact requests fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load supplier contact requests." },
      { status: 500 }
    );
  }
}