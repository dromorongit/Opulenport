"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ServiceRow = {
  _id: string;
  name: string;
  category: string;
  consultationBookable: boolean;
  consultationFeeGHS?: number;
  description?: string;
  icon?: string;
};

type Props = {
  services: ServiceRow[];
};

export default function ServicesTable({ services }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete service.");
      }
    } catch {
      alert("Failed to delete service.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="bg-navy-light">
          <th className="px-4 py-3 font-medium text-gold text-left">Name</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Category</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Bookable</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Fee</th>
          <th className="px-4 py-3 font-medium text-gold text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gold/10">
        {services.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-cream/50">
              No services found.
            </td>
          </tr>
        ) : (
          services.map((row) => (
            <tr key={row._id} className="bg-navy-light hover:bg-gold/5 transition-colors">
              <td className="px-4 py-3 text-cream font-medium">{row.name}</td>
              <td className="px-4 py-3 text-cream capitalize">
                {row.category.replace("-", " ")}
              </td>
              <td className="px-4 py-3">
                {row.consultationBookable ? (
                  <span className="text-gold">Yes</span>
                ) : (
                  <span className="text-cream/50">No</span>
                )}
              </td>
              <td className="px-4 py-3 text-cream">
                {row.consultationFeeGHS ? `GH₵ ${row.consultationFeeGHS.toLocaleString()}` : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/services/${row._id}/edit`}
                    className="rounded-md border border-gold/40 px-3 py-1 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(row._id)}
                    disabled={deletingId === row._id}
                    className="rounded-md border border-rose-500/40 px-3 py-1 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
                  >
                    {deletingId === row._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
