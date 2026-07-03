import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import ConsultationBooking from "@/models/ConsultationBooking";
import DepositPayment from "@/models/DepositPayment";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("PAYSTACK_SECRET_KEY is not configured.");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const signature = request.headers.get("x-paystack-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: "Failed to read request body" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(body);
  } catch {
    console.error("Invalid Paystack webhook payload");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const eventType = event.event;
  const reference = event.data?.reference;

  if (eventType !== "charge.success" || !reference) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    await connectDB();

    const booking = await ConsultationBooking.findOne({
      paystackReference: reference,
    });

    if (booking && booking.paymentStatus !== "paid") {
      await ConsultationBooking.findByIdAndUpdate(booking._id, {
        paymentStatus: "paid",
        status: "confirmed",
      });
      console.log(`Webhook updated booking ${booking._id} to paid`);
    }

    const deposit = await DepositPayment.findOne({
      paystackReference: reference,
    });

    if (deposit && deposit.paymentStatus !== "paid") {
      await DepositPayment.findByIdAndUpdate(deposit._id, {
        paymentStatus: "paid",
      });
      console.log(`Webhook updated deposit ${deposit._id} to paid`);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
