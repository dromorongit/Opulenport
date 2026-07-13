import Link from "next/link";
import BlogClient from "./BlogClient";

async function getBlogPosts() {
  const connectDB = (await import("@/lib/db")).default;
  const BlogPost = (await import("@/models/BlogPost")).default;

  await connectDB();
  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
  return posts.map((p: any) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    category: p.category,
    published: p.published,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return <BlogClient posts={posts} />;
}