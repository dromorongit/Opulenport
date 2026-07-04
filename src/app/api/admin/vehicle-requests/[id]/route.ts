import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import VehicleRequest from "@/models/VehicleRequest";

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
          error: "Vehicle requests are read-only except for status.",
          invalidFields,
        },
        { status: 400 }
      );
    }

    if (body.status !== undefined) {
      if (!["new", "sourcing", "quoted", "closed"].includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value." },
          { status: 400 }
        );
      }
    }

    const request_ = await VehicleRequest.findByIdAndUpdate(
      params.id,
      { $set: { status: body.status } },
      { new: true }
    ).lean();

    if (!request_) {
      return NextResponse.json(
        { error: "Vehicle request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: request_._id.toString(),
        name: request_.name,
        email: request_.email,
        phone: request_.phone,
        makeModel: request_.makeModel,
        yearRange: request_.yearRange,
        budgetRangeGHS: request_.budgetRangeGHS,
        sourceCountryPreference: request_.sourceCountryPreference,
        additionalDetails: request_.additionalDetails,
        status: request_.status,
        createdAt: request_.createdAt,
        updatedAt: request_.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Vehicle request update error:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle request." },
      { status: 500 }
    );
  }
}