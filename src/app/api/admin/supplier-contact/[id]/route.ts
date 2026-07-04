import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import SupplierContactRequest from "@/models/SupplierContactRequest";

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
          error: "Supplier contact requests are read-only except for status.",
          invalidFields,
        },
        { status: 400 }
      );
    }

    if (body.status !== undefined && !["new", "in-progress", "closed"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status value." },
        { status: 400 }
      );
    }

    const request_ = await SupplierContactRequest.findByIdAndUpdate(
      params.id,
      { $set: { status: body.status } },
      { new: true }
    ).lean();

    if (!request_) {
      return NextResponse.json(
        { error: "Supplier contact request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: request_._id.toString(),
        name: request_.name,
        email: request_.email,
        phone: request_.phone,
        businessName: request_.businessName,
        productCategory: request_.productCategory,
        sourceCountry: request_.sourceCountry,
        details: request_.details,
        status: request_.status,
        createdAt: request_.createdAt,
        updatedAt: request_.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Supplier contact request update error:", error);
    return NextResponse.json(
      { error: "Failed to update supplier contact request." },
      { status: 500 }
    );
  }
}