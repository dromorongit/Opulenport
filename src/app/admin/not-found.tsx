import Link from "next/link";
import { FileX, LayoutDashboard } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 mb-8">
          <FileX className="h-10 w-10 text-gold" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold mb-4">
          Page Not Found
        </h1>
        <p className="text-base text-cream/80 mb-8 leading-relaxed">
          The admin page you are looking for does not exist.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}