import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { testimonialAdminSchema } from "@/lib/validations/admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      testimonials.map((t) => ({
        id: t._id.toString(),
        customerName: t.customerName,
        customerLocation: t.customerLocation,
        rating: t.rating,
        content: t.content,
        relatedCategory: t.relatedCategory,
        approved: t.approved ?? false,
        featured: t.featured ?? false,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Testimonials fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load testimonials." },
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
    const validated = testimonialAdminSchema.parse(body);

    const testimonial = await Testimonial.create(validated);

    return NextResponse.json(
      {
        id: testimonial._id.toString(),
        customerName: testimonial.customerName,
        customerLocation: testimonial.customerLocation,
        rating: testimonial.rating,
        content: testimonial.content,
        relatedCategory: testimonial.relatedCategory,
        approved: testimonial.approved,
        featured: testimonial.featured,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Testimonial creation error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid testimonial data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create testimonial." },
      { status: 500 }
    );
  }
}