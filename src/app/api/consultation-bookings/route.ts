import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import ConsultationBooking from "@/models/ConsultationBooking";
import {
  consultationBookingSchema,
} from "@/lib/validations/booking";
import {
  CONSULTATION_FEE_GHS,
  startOfDay,
  addDays,
  isWorkingDay,
  addHours,
  BOOKING_LEAD_TIME_HOURS,
  MAX_BOOKING_DAYS_AHEAD,
} from "@/lib/booking-config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = consultationBookingSchema.safeParse(body);

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

    const data = parsed.data;

    const targetDate = startOfDay(new Date(data.preferredDate + "T00:00:00Z"));
    const now = new Date();
    const earliest = startOfDay(addDays(now, 0));
    const earliestWithLead = new Date(earliest);
    earliestWithLead.setUTCHours(earliestWithLead.getUTCHours() + BOOKING_LEAD_TIME_HOURS);
    const latest = startOfDay(addDays(now, MAX_BOOKING_DAYS_AHEAD));

    if (!isWorkingDay(targetDate)) {
      return NextResponse.json(
        { error: "Bookings are only available on weekdays (Mon-Fri)." },
        { status: 400 }
      );
    }

    if (targetDate < earliestWithLead) {
      return NextResponse.json(
        {
          error: `Bookings must be made at least ${BOOKING_LEAD_TIME_HOURS} hours in advance.`,
        },
        { status: 400 }
      );
    }

    if (targetDate > latest) {
      return NextResponse.json(
        {
          error: `Bookings cannot be made more than ${MAX_BOOKING_DAYS_AHEAD} days ahead.`,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const nextDay = new Date(targetDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const existingBooking = await ConsultationBooking.findOne({
      preferredDate: { $gte: targetDate, $lt: nextDay },
      preferredTimeSlot: data.preferredTimeSlot,
      status: { $in: ["requested", "confirmed"] },
    }).lean();

    if (existingBooking) {
      return NextResponse.json(
        {
          error: "This time slot is no longer available. Please choose another time.",
        },
        { status: 409 }
      );
    }

    const booking = await ConsultationBooking.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferredDate: targetDate,
      preferredTimeSlot: data.preferredTimeSlot,
      serviceType: data.serviceType ? new mongoose.Types.ObjectId(data.serviceType) : undefined,
      notes: data.notes,
      amountGHS: CONSULTATION_FEE_GHS,
      status: "requested",
      paymentStatus: "pending",
    });

    return NextResponse.json(
      { id: booking._id?.toString(), message: "Consultation booked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}
