import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  author?: string;
  publishedAt?: Date;
};

export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  author = "OpulenPort Trading",
  publishedAt,
}: BlogCardProps) {
  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(publishedAt)
    : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group rounded-lg border border-gold/20 bg-navy-light overflow-hidden transition-all hover:border-gold hover:shadow-lg flex flex-col"
    >
      <div className="relative aspect-video bg-navy flex items-center justify-center">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <svg
            className="h-12 w-12 text-cream/20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy">
            {category}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-semibold text-gold group-hover:text-gold-bright transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-sm text-cream/70 line-clamp-2 flex-1">
          {excerpt}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-muted">
          <span>{author}</span>
          {formattedDate && (
            <>
              <span className="text-cream/30">|</span>
              <time dateTime={publishedAt?.toISOString()}>{formattedDate}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
