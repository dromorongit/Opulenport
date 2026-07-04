"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type Testimonial = {
  id: string;
  customerName: string;
  customerLocation: string | null;
  rating: number;
  content: string;
  relatedCategory: string;
  approved: boolean;
  featured: boolean;
  createdAt?: Date;
};

type Props = {
  testimonials: Testimonial[];
};

export default function TestimonialsClient({ testimonials }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete testimonial.");
      }
    } catch {
      alert("Failed to delete testimonial.");
    }
  };

  const handleToggle = async (id: string, field: "approved" | "featured", value: boolean) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update testimonial.");
      }
    } catch {
      alert("Failed to update testimonial.");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < rating ? "text-gold" : "text-cream/30"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const truncateText = (text: string, limit: number = 60) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const columns = [
    { key: "customerName", label: "Customer", sortable: true },
    {
      key: "rating",
      label: "Rating",
      render: (row: Testimonial) => renderStars(row.rating),
    },
    {
      key: "content",
      label: "Content",
      render: (row: Testimonial) => (
        <span title={row.content} className="cursor-help">
          {truncateText(row.content)}
        </span>
      ),
    },
    {
      key: "approved",
      label: "Approved",
      render: (row: Testimonial) => (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={row.approved}
            onChange={(e) => handleToggle(row.id, "approved", e.target.checked)}
            className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
          />
          <span className="text-sm text-cream">{row.approved ? "Yes" : "No"}</span>
        </label>
      ),
    },
    {
      key: "featured",
      label: "Featured",
      render: (row: Testimonial) => (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={row.featured}
            onChange={(e) => handleToggle(row.id, "featured", e.target.checked)}
            className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
          />
          <span className="text-sm text-cream">{row.featured ? "Yes" : "No"}</span>
        </label>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cream">Testimonials</h1>
          <p className="mt-1 text-sm text-cream/60">
            Customer testimonials awaiting approval and featured reviews.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
        >
          Add Testimonial
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        searchKeys={["customerName", "content"]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/testimonials/${row.id}/edit`}
              className="rounded-md border border-gold/40 px-3 py-1 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="rounded-md border border-rose-500/40 px-3 py-1 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/10"
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}