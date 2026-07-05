import Link from "next/link";
import { Compass, Home, Package } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 mb-8">
          <Compass className="h-10 w-10 text-gold" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-cream/80 mb-8 leading-relaxed">
          The page you are looking for does not exist. It may have been moved,
          renamed, or removed from our site.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md border border-gold px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </Link>
        </div>
      </div>
    </div>
  );
}