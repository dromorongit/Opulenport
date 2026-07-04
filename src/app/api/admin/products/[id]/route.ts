import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { productAdminSchema } from "@/lib/validations/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const validated = productAdminSchema.partial().parse(body);

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: validated },
      { new: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

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
      { status: 200 }
    );
  } catch (error) {
    console.error("Product update error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid product data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
