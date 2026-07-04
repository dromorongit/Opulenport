import BookingsClient from "./BookingsClient";
import ConsultationBooking from "@/models/ConsultationBooking";
import connectDB from "@/lib/db";

async function getBookings() {
  await connectDB();
  return ConsultationBooking.find({})
    .sort({ preferredDate: -1 })
    .populate("serviceType", "name")
    .lean()
    .then((items) =>
      items.map((b: any) => ({
        id: b._id.toString(),
        name: b.name,
        email: b.email,
        phone: b.phone,
        preferredDate: b.preferredDate,
        preferredTimeSlot: b.preferredTimeSlot,
        serviceType: b.serviceType?.name ?? null,
        notes: b.notes ?? "",
        paymentStatus: b.paymentStatus ?? "pending",
        paystackReference: b.paystackReference ?? "",
        amountGHS: b.amountGHS ?? 0,
        status: b.status ?? "requested",
        createdAt: b.createdAt,
      }))
    );
}

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  return <BookingsClient bookings={bookings} />;
}