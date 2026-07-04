import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { productAdminSchema } from "@/lib/validations/admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        category: p.category,
        description: p.description,
        images: p.images,
        priceGHS: p.priceGHS,
        priceIsEstimate: p.priceIsEstimate,
        depositRequired: p.depositRequired,
        depositAmountGHS: p.depositAmountGHS,
        specs: p.specs ?? {},
        status: p.status,
        featured: p.featured,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load products." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const validated = productAdminSchema.parse(body);

    const existing = await Product.findOne({ slug: validated.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }

    const product = await Product.create(validated);

    return NextResponse.json(
      {
        id: product._id.toString(),
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid product data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
