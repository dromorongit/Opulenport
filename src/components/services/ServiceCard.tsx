import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ServiceCardProps = {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
};

export default function ServiceCard({
  name,
  slug,
  description,
  icon,
}: ServiceCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
      className="group rounded-lg border border-gold/20 bg-navy-light p-6 transition-all hover:border-gold hover:shadow-lg flex flex-col"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gold/10 text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
        {icon ? (
          <span className="text-lg font-serif font-bold">{icon[0]}</span>
        ) : (
          <span className="text-lg font-serif font-bold">{name[0]}</span>
        )}
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold text-gold group-hover:text-gold-bright transition-colors">
        {name}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-cream/70 line-clamp-3">
          {description}
        </p>
      )}
      <span className="mt-4 inline-flex items-center text-sm font-medium text-gold">
        Learn More <ArrowRight className="ml-1 h-4 w-4" />
      </span>
    </Link>
  );
}
