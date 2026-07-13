"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { testimonialAdminSchema } from "@/lib/validations/admin";

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerLocation: z.string().optional(),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  content: z.string().min(1, "Content is required"),
  relatedCategory: z.string().optional(),
  approved: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type TestimonialFormProps = {
  initialData?: {
    _id?: string;
    customerName?: string;
    customerLocation?: string;
    rating?: number;
    content?: string;
    relatedCategory?: string;
    approved?: boolean;
    featured?: boolean;
  };
};

export default function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: initialData?.customerName ?? "",
      customerLocation: initialData?.customerLocation ?? "",
      rating: initialData?.rating ?? 5,
      content: initialData?.content ?? "",
      relatedCategory: initialData?.relatedCategory ?? "",
      approved: initialData?.approved ?? false,
      featured: initialData?.featured ?? false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const url = isEditing
        ? `/api/admin/testimonials/${initialData!._id}`
        : "/api/admin/testimonials";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/testimonials");
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
          {isEditing ? "Edit Testimonial" : "New Testimonial"}
        </h1>
        <p className="mt-1 text-sm text-cream/60">
          {isEditing
            ? "Update testimonial details below."
            : "Enter a testimonial collected from a customer."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-cream mb-1">
              Customer Name
            </label>
            <input
              {...register("customerName")}
              id="customerName"
              type="text"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.customerName && (
              <p className="mt-1 text-xs text-rose-400">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerLocation" className="block text-sm font-medium text-cream mb-1">
              Customer Location
            </label>
            <input
              {...register("customerLocation")}
              id="customerLocation"
              type="text"
              placeholder="e.g. Accra, Ghana"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-cream mb-1">
              Rating (1-5)
            </label>
            <select
              {...register("rating", { valueAsNumber: true })}
              id="rating"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
            {errors.rating && (
              <p className="mt-1 text-xs text-rose-400">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="relatedCategory" className="block text-sm font-medium text-cream mb-1">
              Related Category
            </label>
            <input
              {...register("relatedCategory")}
              id="relatedCategory"
              type="text"
              placeholder="e.g. vehicles, sourcing"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                {...register("approved")}
                type="checkbox"
                className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
              />
              <span className="text-sm text-cream">Approved</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                {...register("featured")}
                type="checkbox"
                className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
              />
              <span className="text-sm text-cream">Featured</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-cream mb-1">
              Testimonial Content
            </label>
            <textarea
              {...register("content")}
              id="content"
              rows={8}
              placeholder="Enter customer testimonial..."
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.content && (
              <p className="mt-1 text-xs text-rose-400">{errors.content.message}</p>
            )}
          </div>
        </div>
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
            ? "Update Testimonial"
            : "Create Testimonial"}
        </button>
        <Link
          href="/admin/testimonials"
          className="rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}