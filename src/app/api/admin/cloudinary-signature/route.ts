import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateUploadSignature, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Image upload is not configured yet" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const folder = body.folder ?? "opulenport";

    const timestamp = Math.floor(Date.now() / 1000);
    const { signature, apiKey, cloudName } = generateUploadSignature({ folder });

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}