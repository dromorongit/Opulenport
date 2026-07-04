"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { serviceAdminSchema } from "@/lib/validations/admin";

const formSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be kebab-case (e.g. my-service)"
    ),
  category: z.enum([
    "sourcing",
    "logistics",
    "vehicle-sourcing",
    "china-sourcing",
    "dubai-sourcing",
    "france-sourcing",
    "supplier-verification",
    "consultation",
  ]),
  description: z.string().optional(),
  consultationBookable: z.boolean().default(false),
  consultationFeeGHS: z.coerce.number().optional().nullable(),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ServiceFormProps = {
  initialData?: {
    _id?: string;
    name?: string;
    slug?: string;
    category?: string;
    description?: string;
    consultationBookable?: boolean;
    consultationFeeGHS?: number;
    icon?: string;
  };
};

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      category: ((initialData?.category as "sourcing" | "logistics" | "vehicle-sourcing" | "china-sourcing" | "dubai-sourcing" | "france-sourcing" | "supplier-verification" | "consultation") ?? "sourcing") as FormValues["category"],
      description: initialData?.description ?? "",
      consultationBookable: initialData?.consultationBookable ?? false,
      consultationFeeGHS: initialData?.consultationFeeGHS ?? null,
      icon: initialData?.icon ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const url = isEditing
        ? `/api/admin/services/${initialData!._id}`
        : "/api/admin/services";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/services");
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
          {isEditing ? "Edit Service" : "New Service"}
        </h1>
        <p className="mt-1 text-sm text-cream/60">
          {isEditing ? "Update service details below." : "Fill in the details to create a new service."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-cream mb-1">
              Service Name
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
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
            <label htmlFor="category" className="block text-sm font-medium text-cream mb-1">
              Category
            </label>
            <select
              {...register("category")}
              id="category"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="sourcing">Sourcing</option>
              <option value="logistics">Logistics</option>
              <option value="vehicle-sourcing">Vehicle Sourcing</option>
              <option value="china-sourcing">China Sourcing</option>
              <option value="dubai-sourcing">Dubai Sourcing</option>
              <option value="france-sourcing">France Sourcing</option>
              <option value="supplier-verification">Supplier Verification</option>
              <option value="consultation">Consultation</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-400">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-cream mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={4}
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="consultationFeeGHS" className="block text-sm font-medium text-cream mb-1">
              Consultation Fee (GHS)
            </label>
            <input
              {...register("consultationFeeGHS", { valueAsNumber: true })}
              id="consultationFeeGHS"
              type="number"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-cream mb-1">
              Icon (optional)
            </label>
            <input
              {...register("icon")}
              id="icon"
              type="text"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="e.g. lucide icon name"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("consultationBookable")}
              type="checkbox"
              id="consultationBookable"
              className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
            />
            <label htmlFor="consultationBookable" className="text-sm text-cream">
              Consultation Bookable
            </label>
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
            ? "Update Service"
            : "Create Service"}
        </button>
        <Link
          href="/admin/services"
          className="rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
