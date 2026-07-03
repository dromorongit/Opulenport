import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ConsultationBooking from "@/models/ConsultationBooking";
import { initializePaystackTransaction } from "@/lib/paystack";
import { generatePaymentReference } from "@/lib/generate-reference";
import { getSiteUrl } from "@/lib/site-url";
import { CONSULTATION_FEE_GHS } from "@/lib/booking-config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body as { bookingId?: string };

    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await ConsultationBooking.findById(bookingId).lean();
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "This booking has already been paid for." },
        { status: 400 }
      );
    }

    const reference = generatePaymentReference("CONSULT");
    const callbackUrl = `${getSiteUrl()}/api/payments/consultation/callback`;

    const result = await initializePaystackTransaction({
      email: booking.email,
      amountGHS: CONSULTATION_FEE_GHS,
      reference,
      metadata: { bookingId: booking._id?.toString() },
      callbackUrl,
    });

    await ConsultationBooking.findByIdAndUpdate(bookingId, {
      paystackReference: reference,
    });

    return NextResponse.json({
      authorization_url: result.authorization_url,
      reference: result.reference,
    });
  } catch (error) {
    console.error("Consultation payment initialization error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to initialize payment. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
