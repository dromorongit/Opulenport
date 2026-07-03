import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ConsultationBooking from "@/models/ConsultationBooking";
import { verifyPaystackTransaction } from "@/lib/paystack";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference");
    if (!reference) {
      return NextResponse.redirect(
        new URL(
          "/services/consultation/book/confirmation?status=error",
          request.url
        )
      );
    }

    await connectDB();

    const booking = await ConsultationBooking.findOne({
      paystackReference: reference,
    });

    let verification;
    try {
      verification = await verifyPaystackTransaction(reference);
    } catch {
      const fallbackStatus = booking?.paymentStatus === "paid" ? "success" : "failed";
      return NextResponse.redirect(
        new URL(
          `/services/consultation/book/confirmation?status=${fallbackStatus}&ref=${encodeURIComponent(reference)}`,
          request.url
        )
      );
    }

    const isSuccess = verification.status === true;

    if (!booking) {
      return NextResponse.redirect(
        new URL(
          `/services/consultation/book/confirmation?status=error&ref=${encodeURIComponent(reference)}`,
          request.url
        )
      );
    }

    if (isSuccess && booking.paymentStatus !== "paid") {
      await ConsultationBooking.findByIdAndUpdate(booking._id, {
        paymentStatus: "paid",
        status: "confirmed",
      });
    } else if (!isSuccess && booking.paymentStatus !== "paid") {
      await ConsultationBooking.findByIdAndUpdate(booking._id, {
        paymentStatus: "failed",
      });
    }

    return NextResponse.redirect(
      new URL(
        `/services/consultation/book/confirmation?status=${isSuccess ? "success" : "failed"}&ref=${encodeURIComponent(reference)}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Consultation callback error:", error);
    return NextResponse.redirect(
      new URL("/services/consultation/book/confirmation?status=error", request.url)
    );
  }
}
