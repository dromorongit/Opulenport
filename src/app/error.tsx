"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Application error:", error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 mb-8">
          <AlertTriangle className="h-10 w-10 text-gold" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-cream/80 mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-gold px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}