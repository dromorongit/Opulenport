import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogPostForm from "../../BlogPostForm";

async function getPost(id: string): Promise<any | null> {
  await connectDB();
  const post = await BlogPost.findById(id).lean();

  if (!post) return null;

  return {
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage ?? "",
    author: post.author ?? "OpulenPort Trading",
    category: post.category ?? "",
    published: post.published ?? false,
    publishedAt: post.publishedAt,
  };
}

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return <BlogPostForm initialData={post} />;
}