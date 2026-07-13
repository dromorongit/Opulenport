import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { adminRegistrationSchema } from "@/lib/validations/admin";
import { timingSafeEqual } from "crypto";

function safeTimingCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  console.log('REGISTER_DEBUG: handler invoked, method=POST');
  const secret = (process.env.ADMIN_REGISTRATION_SECRET ?? "").trim();

  let body: {
    name: string;
    email: string;
    password: string;
    token: string;
  };

  try {
    body = await request.json();
  } catch (error: unknown) {
    console.error('REGISTER_DEBUG: caught error ->', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Invalid or expired registration link" },
      { status: 403 }
    );
  }

  const parsed = adminRegistrationSchema.safeParse(body);

  if (!parsed.success) {
    console.error('REGISTER_DEBUG: caught error -> Zod validation failed:', JSON.stringify(parsed.error.issues));
    return NextResponse.json(
      { error: "Invalid or expired registration link" },
      { status: 403 }
    );
  }

  const trimmedSubmittedToken = parsed.data.token.trim();
  const trimmedEnvSecret = secret;
  console.log('REGISTER_DEBUG: token check - receivedLength=' + trimmedSubmittedToken.length + ' envLength=' + trimmedEnvSecret.length + ' envSecretExists=' + Boolean(process.env.ADMIN_REGISTRATION_SECRET));

  if (!safeTimingCompare(trimmedSubmittedToken, trimmedEnvSecret)) {
    return NextResponse.json(
      { error: "Invalid or expired registration link" },
      { status: 403 }
    );
  }

  const { name, email, password } = parsed.data;

  try {
    await connectDB();

    const existing = await AdminUser.findOne({ email }).lean();

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await AdminUser.create({
      name,
      email,
      passwordHash,
      role: "owner",
      active: true,
    });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}