import connectDB from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/products/ProductCard";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryInfo = PRODUCT_CATEGORIES.find((c) => c.slug === category);

  if (!categoryInfo) {
    notFound();
  }

  let products: Array<Record<string, unknown>> = [];

  try {
    await connectDB();
    products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .lean();
  } catch {
    products = [];
  }

  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            {categoryInfo.label}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            {categoryInfo.description}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-cream/70">
              New {categoryInfo.label.toLowerCase()} inventory coming soon &mdash;
              contact us to request specific items.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-block rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy hover:bg-gold-bright"
            >
              Contact Us
            </a>
          </div>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product._id?.toString()}
                  {...(product as any)}
                />
              ))}
            </div>
            {category === "vehicles" && (
              <div className="mt-12 rounded-lg border border-gold/20 bg-navy-light p-8 text-center">
                <h3 className="font-serif text-2xl font-semibold text-gold mb-3">
                  Request a Specific Vehicle
                </h3>
                <p className="text-cream/70 mb-6">
                  Can&apos;t find what you&apos;re looking for? Let us know your requirements and we&apos;ll source it for you.
                </p>
                <a
                  href="/products/vehicles/request"
                  className="inline-block rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy hover:bg-gold-bright"
                >
                  Request Vehicle
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}