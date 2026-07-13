import connectDB from "@/lib/db";
import Product from "@/models/Product";
import ImageGallery from "@/components/products/ImageGallery";
import SpecsTable from "@/components/products/SpecsTable";
import ProductDetailActions from "@/components/products/ProductDetailActions";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;

  await connectDB();

  const product = await Product.findOne({ slug, category }).lean();

  if (!product) {
    return {
      title: "Product Not Found | OpulenPort Trading",
    };
  }

  return {
    title: `${product.name} | ${category} | OpulenPort Trading`,
    description:
      typeof product.description === "string"
        ? product.description.slice(0, 160)
        : `Browse ${product.name} at OpulenPort Trading.`,
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;

  const categoryInfo = PRODUCT_CATEGORIES.find((c) => c.slug === category);
  if (!categoryInfo) {
    notFound();
  }

  await connectDB();

  const product = await Product.findOne({ slug, category }).lean();

  if (!product) {
    notFound();
  }

  const productData = product as any;

  return (
    <section className="py-16 sm:py-24 bg-navy min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ImageGallery images={productData.images ?? []} />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-medium uppercase tracking-wide text-gold/80">
                {categoryInfo.label}
              </span>
              {productData.status === "sold" && (
                <span className="rounded bg-navy px-2 py-1 text-xs font-semibold text-cream">
                  Sold
                </span>
              )}
              {productData.status === "on-request" && (
                <span className="rounded bg-navy px-2 py-1 text-xs font-semibold text-gold">
                  On Request
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold">
              {productData.name}
            </h1>

            <div className="mt-6">
              {productData.priceGHS && !productData.priceIsEstimate ? (
                <p className="text-2xl font-semibold text-cream">
                  GHS {productData.priceGHS.toLocaleString()}
                </p>
              ) : (
                <p className="text-xl font-medium text-gold">Quote on Request</p>
              )}
            </div>

            {productData.description && (
              <p className="mt-6 text-base text-cream/80 leading-relaxed">
                {productData.description}
              </p>
            )}

            {productData.specs && Object.keys(productData.specs).length > 0 && (
              <div className="mt-8">
                <h2 className="font-serif text-xl font-semibold text-gold mb-4">
                  Specifications
                </h2>
                <SpecsTable specs={productData.specs} />
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gold/20">
              <ProductDetailActions
                productId={productData._id?.toString() ?? ""}
                productName={productData.name}
                depositRequired={productData.depositRequired}
                depositAmountGHS={productData.depositAmountGHS}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
