import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductForm from "../../ProductForm";
import { type ProductAdminFormValues } from "@/lib/validations/admin";

async function getProduct(id: string): Promise<ProductAdminFormValues | null> {
  await connectDB();
  const product = await Product.findById(id).lean();

  if (!product) return null;

  return {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description,
    images: product.images,
    priceGHS: product.priceGHS,
    priceIsEstimate: product.priceIsEstimate,
    depositRequired: product.depositRequired,
    depositAmountGHS: product.depositAmountGHS,
    specs: product.specs ?? {},
    status: product.status,
    featured: product.featured,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} />;
}
