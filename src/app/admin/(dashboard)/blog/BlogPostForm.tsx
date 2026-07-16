"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogPostAdminSchema } from "@/lib/validations/admin";
import ImageUploader from "@/components/admin/ImageUploader";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be kebab-case (e.g. my-post)"
    ),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  author: z.string().optional(),
  category: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type BlogPostFormProps = {
  initialData?: {
    _id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    author?: string;
    category?: string;
    published?: boolean;
    publishedAt?: Date | string;
  };
};

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      coverImage: initialData?.coverImage ?? "",
      author: initialData?.author ?? "OpulenPort Trading",
      category: initialData?.category ?? "",
      published: initialData?.published ?? false,
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
        : "",
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (!isEditing && title) {
      const kebabSlug = slugify(title);
      setValue("slug", kebabSlug);
    }
  }, [title, isEditing, setValue]);

  const onSubmit = async (data: FormValues) => {
    const payload: Record<string, unknown> = {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : undefined,
    };

    try {
      const url = isEditing
        ? `/api/admin/blog/${initialData!._id}`
        : "/api/admin/blog";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/blog");
      } else {
        const error = await res.json();
        alert(error.error ?? "Submission failed");
      }
    } catch {
      alert("Unable to submit. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-cream">
          {isEditing ? "Edit Blog Post" : "New Blog Post"}
        </h1>
        <p className="mt-1 text-sm text-cream/60">
          {isEditing
            ? "Update blog post details below."
            : "Fill in the details to create a new blog post."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-cream mb-1">
              Title
            </label>
            <input
              {...register("title")}
              id="title"
              type="text"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-cream mb-1">
              Slug
            </label>
            <input
              {...register("slug")}
              id="slug"
              type="text"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-rose-400">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-cream mb-1">
              Excerpt
            </label>
            <textarea
              {...register("excerpt")}
              id="excerpt"
              rows={3}
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.excerpt && (
              <p className="mt-1 text-xs text-rose-400">{errors.excerpt.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-cream mb-1">
              Category
            </label>
            <input
              {...register("category")}
              id="category"
              type="text"
              placeholder="e.g. Vehicles, Sourcing Tips"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-cream mb-1">
              Author
            </label>
            <input
              {...register("author")}
              id="author"
              type="text"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cream mb-1">
              Cover Image
            </label>
            <ImageUploader
              value={watch("coverImage") ?? ""}
              onChange={(url) => setValue("coverImage", url as string)}
              multiple={false}
              folder="opulenport/blog"
            />
          </div>

          <div>
            <label htmlFor="publishedAt" className="block text-sm font-medium text-cream mb-1">
              Published Date
            </label>
            <input
              {...register("publishedAt")}
              id="publishedAt"
              type="datetime-local"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("published")}
              type="checkbox"
              id="published"
              className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
            />
            <label htmlFor="published" className="text-sm text-cream">
              Published
            </label>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-cream mb-1">
          Content (Markdown)
        </label>
        <textarea
          {...register("content")}
          id="content"
          rows={15}
          placeholder="Write your blog post content in Markdown..."
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold font-mono"
        />
        {errors.content && (
          <p className="mt-1 text-xs text-rose-400">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright disabled:opacity-50"
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Post"
            : "Create Post"}
        </button>
        <Link
          href="/admin/blog"
          className="rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}