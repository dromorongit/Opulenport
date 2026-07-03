import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SupplierContactRequest from "@/models/SupplierContactRequest";
import { supplierContactRequestSchema } from "@/lib/validations/forms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = supplierContactRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    await connectDB();

    const supplierContact = await SupplierContactRequest.create({
      ...parsed.data,
      status: "new",
    });

    return NextResponse.json(
      { id: supplierContact._id?.toString(), message: "Supplier contact request submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Supplier contact request submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit supplier contact request. Please try again." },
      { status: 500 }
    );
  }
}