import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogCard from "@/components/blog/BlogCard";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ slug: string }>;
};

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const POSTS_PER_PAGE = 12;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const post = await BlogPost.findOne({ slug, published: true }).lean();

  if (!post) {
    return {
      title: "Article Not Found | OpulenPort Trading",
    };
  }

  const title = typeof post.title === "string" ? post.title : "";
  const excerpt =
    typeof post.excerpt === "string" ? post.excerpt.slice(0, 160) : "";

  return {
    title: `${title} | OpulenPort Trading Blog`,
    description: excerpt,
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  await connectDB();

  const post = await BlogPost.findOne({ slug, published: true }).lean();

  if (!post) {
    notFound();
  }

  const postData = post as any;

  const readTime = estimateReadTime(postData.content ?? "");
  const formattedDate = postData.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(postData.publishedAt))
    : null;

  let relatedPosts: Array<Record<string, unknown>> = [];
  if (postData.category) {
    relatedPosts = await BlogPost.find({
      published: true,
      category: postData.category,
      slug: { $ne: slug },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();
  }

  return (
    <article className="bg-navy min-h-screen">
      {postData.coverImage && (
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] bg-navy-light">
          <Image
            src={postData.coverImage}
            alt={postData.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="pt-10 sm:pt-16 pb-8">
          {postData.category && (
            <span className="inline-flex rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy mb-4">
              {postData.category}
            </span>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gold leading-tight">
            {postData.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-muted">
            <span>{postData.author ?? "OpulenPort Trading"}</span>
            {formattedDate && (
              <>
                <span className="text-cream/30">|</span>
                <time dateTime={postData.publishedAt?.toISOString()}>
                  {formattedDate}
                </time>
              </>
            )}
            <span className="text-cream/30">|</span>
            <span>{readTime} min read</span>
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-cream/90">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, children, ...props }: any) => (
                <h2
                  className="font-serif text-2xl font-semibold text-gold mt-10 mb-4"
                  {...props}
                >
                  {children}
                </h2>
              ),
              h3: ({ node, children, ...props }: any) => (
                <h3
                  className="font-serif text-xl font-semibold text-gold mt-8 mb-3"
                  {...props}
                >
                  {children}
                </h3>
              ),
              ul: ({ node, children, ...props }: any) => (
                <ul className="list-disc list-inside space-y-2 text-cream/85 marker:text-gold" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ node, children, ...props }: any) => (
                <ol className="list-decimal list-inside space-y-2 text-cream/85 marker:text-gold" {...props}>
                  {children}
                </ol>
              ),
              strong: ({ node, children, ...props }: any) => (
                <strong className="font-semibold text-gold" {...props}>
                  {children}
                </strong>
              ),
              p: ({ node, children, ...props }: any) => (
                <p className="text-cream/85 leading-relaxed mb-6" {...props}>
                  {children}
                </p>
              ),
              blockquote: ({ node, children, ...props }: any) => (
                <blockquote
                  className="border-l-4 border-gold pl-4 italic text-cream/80 my-6"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              a: ({ node, children, ...props }: any) => (
                <a className="text-gold underline underline-offset-2 hover:text-gold-bright" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {postData.content}
          </ReactMarkdown>
        </div>

        {relatedPosts.length > 0 && (
          <section className="py-12 sm:py-16">
            <h2 className="font-serif text-2xl font-bold text-gold">
              Related Posts
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related: any) => (
                <BlogCard
                  key={related._id?.toString()}
                  title={related.title}
                  slug={related.slug}
                  excerpt={related.excerpt}
                  coverImage={related.coverImage}
                  category={related.category}
                  author={related.author}
                  publishedAt={related.publishedAt}
                />
              ))}
            </div>
          </section>
        )}

        <section className="py-12 sm:py-16 border-t border-gold/10">
          <div className="rounded-lg border border-gold/20 bg-navy-light p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-gold">
              Have questions about importing?
            </h3>
            <p className="mt-3 text-cream/70 max-w-2xl mx-auto">
              Whether you are sourcing vehicles, jewelry, or general merchandise,
              our team is ready to help you navigate the process.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
