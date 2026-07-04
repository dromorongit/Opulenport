import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import ConsultationBooking from "@/models/ConsultationBooking";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const bookings = await ConsultationBooking.find({})
      .sort({ preferredDate: -1 })
      .populate("serviceType", "name")
      .lean();

    return NextResponse.json(
      bookings.map((b) => ({
        id: b._id.toString(),
        name: b.name,
        email: b.email,
        phone: b.phone,
        preferredDate: b.preferredDate,
        preferredTimeSlot: b.preferredTimeSlot,
        serviceType: (b.serviceType as any)?.name ?? null,
        notes: b.notes ?? "",
        paymentStatus: b.paymentStatus ?? "pending",
        paystackReference: b.paystackReference ?? "",
        amountGHS: b.amountGHS ?? 0,
        status: b.status ?? "requested",
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Consultation bookings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load consultation bookings." },
      { status: 500 }
    );
  }
}