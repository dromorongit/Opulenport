"use client";

import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { Car, Gem, SprayCan, Package, Cog, Scissors } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  vehicles: Car,
  "gold-jewelry": Gem,
  perfumes: SprayCan,
  merchandise: Package,
  machinery: Cog,
  wigs: Scissors,
};

export default function CategoryShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold text-center">
          What We Source
        </h2>
        <p className="mt-4 text-center text-cream/70 max-w-2xl mx-auto">
          Explore our core categories — premium inventory sourced from trusted
          global suppliers and delivered to Ghana.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PRODUCT_CATEGORIES.map((category) => {
            const Icon = iconMap[category.slug] ?? Package;
            return (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="group rounded-lg border border-gold/20 bg-navy-light p-6 transition-all hover:border-gold hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gold/10 text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-gold">
                  {category.label}
                </h3>
                <p className="mt-2 text-sm text-cream/70">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
