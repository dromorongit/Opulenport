import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

const ALLOWED_STATUS_FIELDS = ["status"];

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

    const invalidFields = Object.keys(body).filter(
      (key) => !ALLOWED_STATUS_FIELDS.includes(key)
    );
    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          error: "Inquiries are read-only except for status.",
          invalidFields,
        },
        { status: 400 }
      );
    }

    if (body.status !== undefined) {
      if (!["new", "contacted", "closed"].includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value." },
          { status: 400 }
        );
      }
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      params.id,
      { $set: { status: body.status } },
      { new: true }
    )
      .populate("relatedProduct", "name")
      .populate("relatedService", "name")
      .lean();

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: inquiry._id.toString(),
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        type: inquiry.type,
        relatedProduct: (inquiry.relatedProduct as any)?.name ?? null,
        relatedService: (inquiry.relatedService as any)?.name ?? null,
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Inquiry update error:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry." },
      { status: 500 }
    );
  }
}