import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";

export default async function FeaturedProducts() {
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

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold">
            Featured Products
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            Discover our handpicked selection of premium products from trusted global suppliers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product: any) => (
            <Link
              key={product._id?.toString()}
              href={`/products/${product.category}/${product.slug}`}
              className="group rounded-lg border border-gold/20 bg-navy-light overflow-hidden transition-all hover:border-gold hover:shadow-lg flex flex-col"
            >
              <div className="relative aspect-video bg-navy flex items-center justify-center">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <span className="text-cream/30 text-sm">No image available</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-serif text-lg font-semibold text-gold group-hover:text-gold-bright transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-cream/70 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-auto pt-4">
                  {product.priceGHS && !product.priceIsEstimate ? (
                    <p className="text-lg font-semibold text-cream">
                      GHS {product.priceGHS.toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-gold">Quote on Request</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}