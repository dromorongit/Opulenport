import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const inquiries = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .populate("relatedProduct", "name")
      .populate("relatedService", "name")
      .lean();

    return NextResponse.json(
      inquiries.map((i) => ({
        id: i._id.toString(),
        name: i.name,
        email: i.email,
        phone: i.phone,
        type: i.type,
        relatedProduct: (i.relatedProduct as any)?.name ?? null,
        relatedService: (i.relatedService as any)?.name ?? null,
        message: i.message,
        status: i.status ?? "new",
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Inquiries fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load inquiries." },
      { status: 500 }
    );
  }
}