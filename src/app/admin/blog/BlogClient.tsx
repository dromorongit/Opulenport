"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type Props = {
  posts: BlogPost[];
};

export default function BlogClient({ posts }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete blog post.");
      }
    } catch {
      alert("Failed to delete blog post.");
    }
  };

  const columns = [
    {
      key: "coverImage",
      label: "Image",
      render: (row: BlogPost) => (
        <div className="h-10 w-16 overflow-hidden rounded-md border border-gold/20">
          {row.coverImage ? (
            <img
              src={row.coverImage}
              alt={row.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-navy text-xs text-cream/40">
              No img
            </div>
          )}
        </div>
      ),
    },
    { key: "title", label: "Title", sortable: true },
    { key: "category", label: "Category", sortable: true },
    {
      key: "published",
      label: "Status",
      render: (row: BlogPost) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            row.published ? "bg-gold/20 text-gold" : "bg-cream/10 text-cream/60"
          }`}
        >
          {row.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "publishedAt",
      label: "Published At",
      render: (row: BlogPost) =>
        row.publishedAt
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(row.publishedAt))
          : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cream">Blog Posts</h1>
          <p className="mt-1 text-sm text-cream/60">
            Manage blog articles and publications.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
        >
          Add New Post
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        searchKeys={["title", "slug", "category"]}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/blog/${row.id}/edit`}
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