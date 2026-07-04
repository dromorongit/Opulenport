import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { serviceAdminSchema } from "@/lib/validations/admin";

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
    const validated = serviceAdminSchema.partial().parse(body);

    const service = await Service.findByIdAndUpdate(
      params.id,
      { $set: validated },
      { new: true }
    ).lean();

    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: service._id.toString(),
        name: service.name,
        slug: service.slug,
        category: service.category,
        description: service.description,
        consultationBookable: service.consultationBookable,
        consultationFeeGHS: service.consultationFeeGHS,
        icon: service.icon,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Service update error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid service data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update service." },
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
    const service = await Service.findByIdAndDelete(params.id);

    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Service delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete service." },
      { status: 500 }
    );
  }
}
