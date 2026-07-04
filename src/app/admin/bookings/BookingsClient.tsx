"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTimeSlot: string;
  serviceType: string | null;
  notes: string;
  paymentStatus: string;
  paystackReference: string;
  amountGHS: number;
  status: string;
  createdAt?: Date;
};

type Props = {
  bookings: Booking[];
};

export default function BookingsClient({ bookings }: Props) {
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/consultation-bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error ?? "Failed to update status.");
      }
    } catch {
      alert("Unable to update status.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-cream/10 text-cream/60";
      case "confirmed":
        return "bg-gold/20 text-gold";
      case "completed":
        return "bg-emerald-500/20 text-emerald-400";
      case "cancelled":
        return "bg-rose-500/20 text-rose-400";
      default:
        return "bg-cream/10 text-cream/60";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "paid":
        return "bg-emerald-500/20 text-emerald-400";
      case "failed":
        return "bg-rose-500/20 text-rose-400";
      case "waived":
        return "bg-slate-500/20 text-slate-400";
      default:
        return "bg-cream/10 text-cream/60";
    }
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    {
      key: "preferredDate",
      label: "Date",
      render: (row: Booking) =>
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(row.preferredDate)),
    },
    { key: "preferredTimeSlot", label: "Time Slot" },
    { key: "serviceType", label: "Service" },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (row: Booking) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(row.paymentStatus)}`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      key: "status",
      label: "Booking Status",
      render: (row: Booking) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="rounded-md border border-gold/20 bg-navy px-2 py-1 text-xs text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="requested">Requested</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      key: "paystackReference",
      label: "Reference",
      render: (row: Booking) => (
        <span className="text-xs text-cream/50 font-mono" title={row.paystackReference}>
          {row.paystackReference.slice(0, 12)}
          {row.paystackReference.length > 12 ? "..." : ""}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-cream">Consultation Bookings</h1>
        <p className="mt-1 text-sm text-cream/60">
          Consultation appointment requests and payments.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        searchKeys={["name", "email", "paystackReference"]}
      />
    </div>
  );
}