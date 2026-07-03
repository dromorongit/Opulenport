import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

type ProductCardProps = {
  name: string;
  slug: string;
  category: string;
  images?: string[];
  priceGHS?: number;
  priceIsEstimate?: boolean;
  status?: string;
  specs?: Record<string, unknown>;
};

export default function ProductCard({
  name,
  slug,
  category,
  images = [],
  priceGHS,
  priceIsEstimate = true,
  status = "available",
  specs = {},
}: ProductCardProps) {
  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.slug === category)?.label ?? category;
  const specEntries = Object.entries(specs).slice(0, 3);

  return (
    <Link
      href={`/products/${category}/${slug}`}
      className="group rounded-lg border border-gold/20 bg-navy-light overflow-hidden transition-all hover:border-gold hover:shadow-lg flex flex-col"
    >
      <div className="relative aspect-video bg-navy flex items-center justify-center">
        {images.length > 0 ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className="text-cream/30 text-sm">No image available</span>
        )}
        {status === "sold" && (
          <span className="absolute top-2 left-2 rounded bg-navy/90 px-2 py-1 text-xs font-semibold text-cream">
            Sold
          </span>
        )}
        {status === "on-request" && (
          <span className="absolute top-2 left-2 rounded bg-navy/90 px-2 py-1 text-xs font-semibold text-gold">
            On Request
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gold/80">
          {categoryLabel}
        </span>
        <h3 className="mt-1 font-serif text-lg font-semibold text-gold group-hover:text-gold-bright transition-colors">
          {name}
        </h3>
        {specEntries.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {specEntries.map(([key, value]) => (
              <span
                key={key}
                className="rounded-full bg-navy px-2 py-1 text-xs text-cream/70"
              >
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-4">
          {priceGHS && !priceIsEstimate ? (
            <p className="text-lg font-semibold text-cream">
              GHS {priceGHS.toLocaleString()}
            </p>
          ) : (
            <p className="text-sm font-medium text-gold">Quote on Request</p>
          )}
        </div>
      </div>
    </Link>
  );
}
