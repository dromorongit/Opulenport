"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProductRow = {
  _id: string;
  name: string;
  category: string;
  priceGHS?: number;
  depositRequired: boolean;
  featured: boolean;
  status: string;
  images: string[];
};

type Props = {
  products: ProductRow[];
};

export default function ProductsTable({ products }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="bg-navy-light">
          <th className="px-4 py-3 font-medium text-gold text-left">Image</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Name</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Category</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Price</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Deposit</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Featured</th>
          <th className="px-4 py-3 font-medium text-gold text-left">Status</th>
          <th className="px-4 py-3 font-medium text-gold text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gold/10">
        {products.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-8 text-center text-cream/50">
              No products found.
            </td>
          </tr>
        ) : (
          products.map((row) => (
            <tr key={row._id} className="bg-navy-light hover:bg-gold/5 transition-colors">
              <td className="px-4 py-3">
                <div className="h-10 w-10 overflow-hidden rounded-md border border-gold/20">
                  {row.images?.[0] ? (
                    <img
                      src={row.images[0]}
                      alt={row.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy text-xs text-cream/40">
                      No img
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-cream font-medium">{row.name}</td>
              <td className="px-4 py-3 text-cream capitalize">
                {row.category.replace("-", " ")}
              </td>
              <td className="px-4 py-3 text-cream">
                {row.priceGHS ? `GH₵ ${row.priceGHS.toLocaleString()}` : "Quote"}
              </td>
              <td className="px-4 py-3">
                {row.depositRequired ? (
                  <span className="text-gold">Yes</span>
                ) : (
                  <span className="text-cream/50">No</span>
                )}
              </td>
              <td className="px-4 py-3">
                {row.featured ? (
                  <span className="text-gold">Yes</span>
                ) : (
                  <span className="text-cream/50">No</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`capitalize ${
                    row.status === "available" ? "text-cream" : "text-cream/50"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${row._id}/edit`}
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
