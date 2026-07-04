"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  relatedProduct: string | null;
  relatedService: string | null;
  message: string;
  status: string;
  createdAt?: Date;
};

type Props = {
  inquiries: Inquiry[];
};

export default function InquiriesClient({ inquiries }: Props) {
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
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

  const truncateText = (text: string, limit: number = 80) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    {
      key: "type",
      label: "Type",
      render: (row: Inquiry) => (
        <span className="capitalize">
          {row.type.replace("-", " ")}
        </span>
      ),
    },
    {
      key: "relatedProduct",
      label: "Related",
      render: (row: Inquiry) =>
        row.relatedProduct ?? row.relatedService ?? "-",
    },
    {
      key: "message",
      label: "Message",
      render: (row: Inquiry) => (
        <span title={row.message} className="cursor-help">
          {truncateText(row.message)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Inquiry) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="rounded-md border border-gold/20 bg-navy px-2 py-1 text-xs text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (row: Inquiry) =>
        row.createdAt
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(row.createdAt))
          : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-cream">Inquiries</h1>
        <p className="mt-1 text-sm text-cream/60">
          Customer inquiries and quote requests.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={inquiries}
        searchKeys={["name", "email", "message"]}
      />
    </div>
  );
}