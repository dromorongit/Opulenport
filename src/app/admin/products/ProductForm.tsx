"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFieldArray } from "react-hook-form";
import { productAdminSchema, type ProductAdminFormValues } from "@/lib/validations/admin";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be kebab-case (e.g. my-product)"
    ),
  category: z.enum([
    "vehicles",
    "gold-jewelry",
    "perfumes",
    "merchandise",
    "machinery",
  ]),
  description: z.string().optional(),
  images: z.array(z.string()).min(0),
  priceGHS: z.coerce.number().optional().nullable(),
  priceIsEstimate: z.boolean().default(true),
  depositRequired: z.boolean().default(false),
  depositAmountGHS: z.coerce.number().optional().nullable(),
  specs: z.array(z.object({ key: z.string(), value: z.string() })),
  status: z.enum(["available", "sold", "on-request"]).default("available"),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type NewProductPageProps = {
  initialData?: ProductAdminFormValues & { _id?: string };
};

export default function ProductForm({
  initialData,
}: NewProductPageProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      category: initialData?.category ?? "vehicles",
      description: initialData?.description ?? "",
      images: initialData?.images?.length ? initialData.images : [""],
      priceGHS: initialData?.priceGHS ?? null,
      priceIsEstimate: initialData?.priceIsEstimate ?? true,
      depositRequired: initialData?.depositRequired ?? false,
      depositAmountGHS: initialData?.depositAmountGHS ?? null,
      specs: Object.entries(initialData?.specs ?? {}).map(([key, value]) => ({
        key,
        value: String(value),
      })),
      status: initialData?.status ?? "available",
      featured: initialData?.featured ?? false,
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } =
    useFieldArray({ control, name: "images" });

  const { fields: specFields, append: appendSpec, remove: removeSpec } =
    useFieldArray({ control, name: "specs" });

  useEffect(() => {
    if (specFields.length === 0) {
      appendSpec({ key: "", value: "" });
    }
  }, [specFields.length, appendSpec]);

  const onSubmit = async (data: FormValues) => {
    const payload: ProductAdminFormValues = {
      ...data,
      images: data.images.filter((img) => img.trim() !== ""),
      specs: data.specs.reduce<Record<string, unknown>>((acc, curr) => {
        if (curr.key.trim() !== "") {
          acc[curr.key.trim()] = curr.value.trim();
        }
        return acc;
      }, {}),
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${initialData!._id}`
        : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
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
          {isEditing ? "Edit Product" : "New Product"}
        </h1>
        <p className="mt-1 text-sm text-cream/60">
          {isEditing ? "Update product details below." : "Fill in the details to create a new product."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-cream mb-1">
              Product Name
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
              <option value="vehicles">Vehicles</option>
              <option value="gold-jewelry">Gold Jewelry</option>
              <option value="perfumes">Perfumes</option>
              <option value="merchandise">Merchandise</option>
              <option value="machinery">Machinery</option>
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

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-cream mb-1">
              Status
            </label>
            <select
              {...register("status")}
              id="status"
              className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="on-request">On Request</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-rose-400">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priceGHS" className="block text-sm font-medium text-cream mb-1">
                Price (GHS)
              </label>
              <input
                {...register("priceGHS", { valueAsNumber: true })}
                id="priceGHS"
                type="number"
                className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label htmlFor="depositAmountGHS" className="block text-sm font-medium text-cream mb-1">
                Deposit (GHS)
              </label>
              <input
                {...register("depositAmountGHS", { valueAsNumber: true })}
                id="depositAmountGHS"
                type="number"
                className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                {...register("priceIsEstimate")}
                type="checkbox"
                className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
              />
              <span className="text-sm text-cream">Price is estimate</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                {...register("depositRequired")}
                type="checkbox"
                className="h-4 w-4 rounded border-gold/20 bg-navy text-gold focus:ring-gold"
              />
              <span className="text-sm text-cream">Deposit required</span>
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

          <div>
            <label className="block text-sm font-medium text-cream mb-2">
              Images (URLs)
            </label>
            <div className="space-y-2">
              {imageFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`images.${index}`)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-md border border-rose-500/40 px-3 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => appendImage("")}
              className="mt-2 rounded-md border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
            >
              Add Image URL
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-cream mb-2">
              Specs
            </label>
            <div className="space-y-2">
              {specFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`specs.${index}.key`)}
                    placeholder="Key"
                    className="w-1/2 rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    {...register(`specs.${index}.value`)}
                    placeholder="Value"
                    className="flex-1 rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="rounded-md border border-rose-500/40 px-3 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => appendSpec({ key: "", value: "" })}
              className="mt-2 rounded-md border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
            >
              Add Spec
            </button>
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
            ? "Update Product"
            : "Create Product"}
        </button>
        <Link
          href="/admin/products"
          className="rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
