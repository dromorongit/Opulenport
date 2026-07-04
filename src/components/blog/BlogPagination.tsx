import Link from "next/link";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  category?: string;
};

export default function BlogPagination({
  currentPage,
  totalPages,
  basePath,
  category,
}: BlogPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border border-gold/20 bg-navy-light px-3 text-sm font-medium text-cream transition-colors hover:border-gold hover:text-gold"
        >
          Previous
        </Link>
      ) : (
        <span className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border border-gold/10 px-3 text-sm font-medium text-cream/30">
          Previous
        </span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border text-sm font-medium transition-colors ${
            p === currentPage
              ? "border-gold bg-gold text-navy"
              : "border-gold/20 bg-navy-light text-cream hover:border-gold hover:text-gold"
          }`}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border border-gold/20 bg-navy-light px-3 text-sm font-medium text-cream transition-colors hover:border-gold hover:text-gold"
        >
          Next
        </Link>
      ) : (
        <span className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border border-gold/10 px-3 text-sm font-medium text-cream/30">
          Next
        </span>
      )}
    </nav>
  );
}
