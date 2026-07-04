import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { blogPostAdminSchema } from "@/lib/validations/admin";

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
    const validated = blogPostAdminSchema.partial().parse(body);

    const updateData: Record<string, unknown> = { ...validated };

    const existingPost = await BlogPost.findById(params.id).lean();
    if (existingPost) {
      const wasPublished = existingPost.published;
      const willBePublished = validated.published === true;
      if (!wasPublished && willBePublished && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        author: post.author,
        category: post.category,
        published: post.published,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog post update error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid blog post data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update blog post." },
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
    const post = await BlogPost.findByIdAndDelete(params.id);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Blog post delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post." },
      { status: 500 }
    );
  }
}