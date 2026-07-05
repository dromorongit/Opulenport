import connectDB from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/products/ProductCard";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Products | OpulenPort Trading",
    description:
      "Explore our 5 product categories: Vehicles, Gold Jewelry, Perfumes, Merchandise, and Machinery — all sourced globally and delivered to Ghana with trusted quality assurance.",
  };
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let featuredProducts: Array<Record<string, unknown>> = [];

  try {
    await connectDB();
    featuredProducts = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
  } catch {
    featuredProducts = [];
  }

  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            Our Products
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            Browse our curated selection of premium vehicles, gold jewelry,
            perfumes, merchandise, and machinery — sourced globally and
            delivered to Ghana.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PRODUCT_CATEGORIES.map((category) => (
            <a
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group rounded-lg border border-gold/20 bg-navy-light p-6 text-center transition-all hover:border-gold hover:shadow-lg"
            >
              <h3 className="font-serif text-xl font-semibold text-gold group-hover:text-gold-bright transition-colors">
                {category.label}
              </h3>
              <p className="mt-2 text-sm text-cream/70">
                {category.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-gold">
                View Products →
              </span>
            </a>
          ))}
        </div>

        {featuredProducts.length > 0 && (
          <>
            <h2 className="mt-20 font-serif text-3xl font-bold text-gold text-center">
              Featured Products
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard
                  key={product._id?.toString()}
                  {...(product as any)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
