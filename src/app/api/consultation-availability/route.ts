import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ConsultationBooking from "@/models/ConsultationBooking";
import {
  generateTimeSlots,
  isWorkingDay,
  isWithinBookingWindow,
  startOfDay,
  addDays,
  addHours,
  MAX_BOOKING_DAYS_AHEAD,
  BOOKING_LEAD_TIME_HOURS,
} from "@/lib/booking-config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const dateParam = request.nextUrl.searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date query parameter is required" },
        { status: 400 }
      );
    }

    const targetDate = new Date(dateParam + "T00:00:00Z");

    if (Number.isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const now = new Date();
    const earliest = startOfDay(addHours(now, BOOKING_LEAD_TIME_HOURS));
    const latest = startOfDay(addDays(now, MAX_BOOKING_DAYS_AHEAD));

    if (!isWorkingDay(targetDate)) {
      return NextResponse.json(
        { error: "Bookings are only available on weekdays (Mon-Fri)." },
        { status: 400 }
      );
    }

    if (targetDate < earliest) {
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

    const bookings = await ConsultationBooking.find({
      preferredDate: { $gte: targetDate, $lt: nextDay },
      status: { $in: ["requested", "confirmed"] },
    }).lean();

    const bookedSlots = new Set(
      bookings
        .map((b) => b.preferredTimeSlot)
        .filter((slot): slot is string => typeof slot === "string")
    );

    const allSlots = generateTimeSlots(targetDate);
    const availableSlots = allSlots.filter((slot) => !bookedSlots.has(slot));

    return NextResponse.json(availableSlots, { status: 200 });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability. Please try again." },
      { status: 500 }
    );
  }
}
