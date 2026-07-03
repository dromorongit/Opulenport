import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { newsletterSchema } from "@/lib/validations/forms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

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

    const existing = await NewsletterSubscriber.findOne({ email: parsed.data.email });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "already subscribed" },
          { status: 200 }
        );
      } else {
        existing.active = true;
        await existing.save();
        return NextResponse.json(
          { id: existing._id?.toString(), message: "Subscription reactivated" },
          { status: 200 }
        );
      }
    }

    const subscriber = await NewsletterSubscriber.create({
      email: parsed.data.email,
      active: true,
    });

    return NextResponse.json(
      { id: subscriber._id?.toString(), message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}