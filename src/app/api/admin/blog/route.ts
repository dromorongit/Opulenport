import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { blogPostAdminSchema } from "@/lib/validations/admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      posts.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        author: p.author ?? "OpulenPort Trading",
        category: p.category,
        published: p.published,
        publishedAt: p.publishedAt,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Blog posts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load blog posts." },
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
    const validated = blogPostAdminSchema.parse(body);

    const existing = await BlogPost.findOne({ slug: validated.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists." },
        { status: 409 }
      );
    }

    const data: Record<string, unknown> = { ...validated };
    if (validated.published && !validated.publishedAt) {
      data.publishedAt = new Date();
    }

    const post = await BlogPost.create(data);

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
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog post creation error:", error);
    if (error instanceof Error && error.message.includes("Zod")) {
      return NextResponse.json(
        { error: "Invalid blog post data.", details: [error.message] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create blog post." },
      { status: 500 }
    );
  }
}