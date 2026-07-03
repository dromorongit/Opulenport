import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

type DepositConfirmationPageProps = {
  params: { category: string };
  searchParams?: { status?: string; ref?: string };
};

export function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

export default function DepositConfirmationPage({
  params,
  searchParams,
}: DepositConfirmationPageProps) {
  const categoryExists = PRODUCT_CATEGORIES.some(
    (c) => c.slug === params.category
  );

  if (!categoryExists) {
    notFound();
  }

  const status = searchParams?.status ?? "error";
  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.slug === params.category)?.label ??
    params.category;

  return (
    <section className="py-16 sm:py-24 bg-navy min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold">
              Deposit Payment Confirmed
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream/80">
              Your deposit for the selected product in {categoryLabel} has been
              received. Our team will reach out shortly to proceed with your order.
            </p>
            {searchParams?.ref && (
              <p className="mt-4 text-sm text-cream/60">
                Reference:{" "}
                <span className="font-mono text-gold">{searchParams.ref}</span>
              </p>
            )}
            <div className="mt-8">
              <Link
                href={`/products/${params.category}`}
                className="inline-flex items-center rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright"
              >
                Browse {categoryLabel}
              </Link>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
              <XCircle className="h-10 w-10 text-rose-400" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold">
              Deposit Not Completed
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream/80">
              Your deposit payment could not be completed. Please try again or
              contact us via WhatsApp to arrange an alternative payment method.
            </p>
            {searchParams?.ref && (
              <p className="mt-4 text-sm text-cream/60">
                Reference:{" "}
                <span className="font-mono text-gold">{searchParams.ref}</span>
              </p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/products/${params.category}`}
                className="inline-flex items-center rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright"
              >
                Try Again
              </Link>
              <a
                href="https://wa.me/233000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-gold/40 px-6 py-3 text-base font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                Contact via WhatsApp
              </a>
            </div>
          </>
        )}

        {status !== "success" && status !== "failed" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <AlertCircle className="h-10 w-10 text-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold">
              Unconfirmed Deposit
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream/80">
              We could not confirm the status of your deposit payment. Please
              contact us directly so we can look into it for you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/products/${params.category}`}
                className="inline-flex items-center rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright"
              >
                Try Again
              </Link>
              <a
                href="https://wa.me/233000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-gold/40 px-6 py-3 text-base font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                Contact via WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
