import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import ConsultationBooking from "@/models/ConsultationBooking";

const ALLOWED_STATUS_FIELDS = ["status"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    if ("paymentStatus" in body) {
      return NextResponse.json(
        {
          error: "paymentStatus cannot be manually overridden. It is Paystack-verified truth.",
        },
        { status: 400 }
      );
    }

    const invalidFields = Object.keys(body).filter(
      (key) => !ALLOWED_STATUS_FIELDS.includes(key)
    );
    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          error: "Only status field can be updated.",
          invalidFields,
        },
        { status: 400 }
      );
    }

    if (body.status !== undefined && !["requested", "confirmed", "completed", "cancelled"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status value." },
        { status: 400 }
      );
    }

    const booking = await ConsultationBooking.findByIdAndUpdate(
      params.id,
      { $set: { status: body.status } },
      { new: true }
    )
      .populate("serviceType", "name")
      .lean();

    if (!booking) {
      return NextResponse.json(
        { error: "Consultation booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: booking._id.toString(),
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        preferredDate: booking.preferredDate,
        preferredTimeSlot: booking.preferredTimeSlot,
        serviceType: (booking.serviceType as any)?.name ?? null,
        notes: booking.notes,
        paymentStatus: booking.paymentStatus,
        paystackReference: booking.paystackReference,
        amountGHS: booking.amountGHS,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Consultation booking update error:", error);
    return NextResponse.json(
      { error: "Failed to update consultation booking." },
      { status: 500 }
    );
  }
}