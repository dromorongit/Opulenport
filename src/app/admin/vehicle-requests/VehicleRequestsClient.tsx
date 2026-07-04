"use client";

import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

type VehicleRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  makeModel: string;
  yearRange: string;
  budgetRangeGHS: string;
  sourceCountryPreference: string;
  additionalDetails: string;
  status: string;
  createdAt?: Date;
};

type Props = {
  requests: VehicleRequest[];
};

export default function VehicleRequestsClient({ requests }: Props) {
  const router = useRouter();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/vehicle-requests/${id}`, {
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

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    { key: "makeModel", label: "Make/Model", sortable: true },
    { key: "yearRange", label: "Year Range" },
    { key: "budgetRangeGHS", label: "Budget (GHS)" },
    { key: "sourceCountryPreference", label: "Source Country" },
    {
      key: "status",
      label: "Status",
      render: (row: VehicleRequest) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="rounded-md border border-gold/20 bg-navy px-2 py-1 text-xs text-cream focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="new">New</option>
          <option value="sourcing">Sourcing</option>
          <option value="quoted">Quoted</option>
          <option value="closed">Closed</option>
        </select>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (row: VehicleRequest) =>
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
        <h1 className="font-serif text-2xl font-bold text-cream">Vehicle Requests</h1>
        <p className="mt-1 text-sm text-cream/60">
          Customer vehicle sourcing requests.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        searchKeys={["name", "email", "makeModel"]}
      />
    </div>
  );
}