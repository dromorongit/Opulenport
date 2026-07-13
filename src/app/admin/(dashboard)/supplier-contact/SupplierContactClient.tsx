"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

type SupplierContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  productCategory: string;
  sourceCountry: string;
  details: string;
  status: string;
  createdAt?: Date;
};

type Props = {
  requests: SupplierContactRequest[];
};

export default function SupplierContactClient({ requests }: Props) {
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/supplier-contact/${id}`, {
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

  const truncateText = (text: string, limit: number = 60) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    { key: "businessName", label: "Business", sortable: true },
    { key: "productCategory", label: "Category", sortable: true },
    { key: "sourceCountry", label: "Source Country" },
    {
      key: "details",
      label: "Details",
      render: (row: SupplierContactRequest) => (
        <span title={row.details} className="cursor-help">
          {truncateText(row.details)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: SupplierContactRequest) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="rounded-md border border-gold/20 bg-navy px-2 py-1 text-xs text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (row: SupplierContactRequest) =>
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
        <h1 className="font-serif text-2xl font-bold text-cream">Supplier Contact Requests</h1>
        <p className="mt-1 text-sm text-cream/60">
          Supplier sourcing inquiries from customers.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        searchKeys={["name", "email", "businessName", "productCategory"]}
      />
    </div>
  );
}