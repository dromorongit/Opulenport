import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import ProductsTable from "./ProductsTable";

async function getProducts() {
  await connectDB();
  return Product.find({})
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      items.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        category: p.category,
        priceGHS: p.priceGHS,
        depositRequired: p.depositRequired ?? false,
        featured: p.featured ?? false,
        status: p.status ?? "available",
        images: p.images,
      }))
    );
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream">Products</h1>
          <p className="mt-1 text-sm text-cream/60">Manage your product inventory.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
        >
          Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gold/20">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
