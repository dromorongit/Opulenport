import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { serviceAdminSchema } from "@/lib/validations/admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      services.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        slug: s.slug,
        category: s.category,
        description: s.description,
        consultationBookable: s.consultationBookable,
        consultationFeeGHS: s.consultationFeeGHS,
        icon: s.icon,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load services." },
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
    const validated = serviceAdminSchema.parse(body);

    const existing = await Service.findOne({ slug: validated.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A service with this slug already exists." },
        { status: 409 }
      );
    }

    const service = await Service.create(validated);

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
      { status: 201 }
    );
  } catch (error) {
    console.error("Service creation error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid service data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create service." },
      { status: 500 }
    );
  }
}
