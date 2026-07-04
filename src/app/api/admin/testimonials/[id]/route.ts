import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { testimonialAdminSchema } from "@/lib/validations/admin";

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
    const validated = testimonialAdminSchema.partial().parse(body);

    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      { $set: validated },
      { new: true }
    ).lean();

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found." },
        { status: 404 }
      );
    }

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
      { status: 200 }
    );
  } catch (error) {
    console.error("Testimonial update error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid testimonial data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update testimonial." },
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
    const testimonial = await Testimonial.findByIdAndDelete(params.id);

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial." },
      { status: 500 }
    );
  }
}