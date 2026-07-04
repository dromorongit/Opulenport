import { z } from "zod";

export const productAdminSchema = z.object({
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
  description: z.string().optional().default(""),
  images: z.array(z.string().url("Invalid image URL")).min(0, "At least one image is required"),
  priceGHS: z.coerce.number().optional(),
  priceIsEstimate: z.boolean().default(true),
  depositRequired: z.boolean().default(false),
  depositAmountGHS: z.coerce.number().optional(),
  specs: z.record(z.string()).optional().default({}),
  status: z.enum(["available", "sold", "on-request"]).default("available"),
  featured: z.boolean().default(false),
});

export type ProductAdminFormValues = z.infer<typeof productAdminSchema>;

export const serviceAdminSchema = z.object({
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
  description: z.string().optional().default(""),
  consultationBookable: z.boolean().default(false),
  consultationFeeGHS: z.coerce.number().optional(),
  icon: z.string().optional(),
});

export type ServiceAdminFormValues = z.infer<typeof serviceAdminSchema>;

export const blogPostAdminSchema = z.object({
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
  author: z.string().optional().default("OpulenPort Trading"),
  category: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.instanceof(Date).optional()
  ),
});

export type BlogPostAdminFormValues = z.infer<typeof blogPostAdminSchema>;

export const testimonialAdminSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerLocation: z.string().optional(),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  content: z.string().min(1, "Content is required"),
  relatedCategory: z.string().optional(),
  approved: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type TestimonialAdminFormValues = z.infer<typeof testimonialAdminSchema>;
