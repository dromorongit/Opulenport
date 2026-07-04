import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";

const POSTS_PER_PAGE = 12;

export const dynamic = "force-dynamic";

type BlogPageProps = {
  searchParams?: { category?: string; page?: string };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const category = searchParams?.category ?? "";
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);

  let posts: Array<Record<string, unknown>> = [];
  let categories: string[] = [];
  let totalPosts = 0;
  let totalPages = 0;

  try {
    await connectDB();

    categories = await BlogPost.distinct("category", {
      published: true,
      category: { $exists: true, $ne: "" },
    });

    const filter: Record<string, unknown> = { published: true };
    if (category) {
      filter.category = category;
    }

    totalPosts = await BlogPost.countDocuments(filter);
    totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
    const safePage = Math.min(page, totalPages);

    posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip((safePage - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .lean();
  } catch {
    posts = [];
    categories = [];
    totalPosts = 0;
    totalPages = 0;
  }

  const isActive = (cat: string) => cat === category;

  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            Insights &amp; Guides
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            Expert advice on importing vehicles, sourcing suppliers, and
            navigating international trade into Ghana.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/blog"
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === ""
                ? "bg-gold text-navy"
                : "bg-navy-light text-cream border border-gold/20 hover:border-gold"
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(cat)
                  ? "bg-gold text-navy"
                  : "bg-navy-light text-cream border border-gold/20 hover:border-gold"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <BlogCard
                key={post._id?.toString()}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                category={post.category}
                author={post.author}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-lg text-cream/70">
              No articles yet — check back soon.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <BlogPagination
            currentPage={Math.min(page, totalPages)}
            totalPages={totalPages}
            basePath="/blog"
            category={category}
          />
        )}
      </div>
    </section>
  );
}
