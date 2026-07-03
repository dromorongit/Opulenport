export const PRODUCT_CATEGORIES = [
  {
    slug: "vehicles",
    label: "Vehicles",
    description: "Quality vehicles sourced from trusted global suppliers.",
  },
  {
    slug: "gold-jewelry",
    label: "Gold Jewelry",
    description: "Authentic gold jewelry crafted to timeless standards.",
  },
  {
    slug: "perfumes",
    label: "Perfumes",
    description: "Premium fragrances from world-renowned houses.",
  },
  {
    slug: "merchandise",
    label: "Merchandise",
    description: "Curated general merchandise for diverse needs.",
  },
  {
    slug: "machinery",
    label: "Machinery",
    description: "Reliable industrial and commercial machinery.",
  },
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]["slug"];

export const SERVICE_CATEGORIES = [
  {
    slug: "sourcing",
    label: "Sourcing",
    description:
      "End-to-end procurement from verified global suppliers.",
  },
  {
    slug: "logistics",
    label: "Logistics",
    description:
      "Seamless shipping, clearance, and last-mile delivery.",
  },
  {
    slug: "vehicle-sourcing",
    label: "Vehicle Sourcing",
    description:
      "Dedicated support for sourcing specific vehicles worldwide.",
  },
  {
    slug: "china-sourcing",
    label: "China Sourcing",
    description:
      "Specialized procurement from China&apos;s leading markets.",
  },
  {
    slug: "dubai-sourcing",
    label: "Dubai Sourcing",
    description:
      "Premium sourcing through Dubai&apos;s global trade hubs.",
  },
  {
    slug: "france-sourcing",
    label: "France Sourcing",
    description:
      "Luxury and specialty sourcing from France.",
  },
  {
    slug: "supplier-verification",
    label: "Supplier Verification",
    description:
      "Due diligence and verification of overseas suppliers.",
  },
  {
    slug: "consultation",
    label: "Consultation",
    description:
      "Expert guidance on imports, sourcing strategy, and compliance.",
  },
] as const;

export type ServiceCategorySlug =
  (typeof SERVICE_CATEGORIES)[number]["slug"];
