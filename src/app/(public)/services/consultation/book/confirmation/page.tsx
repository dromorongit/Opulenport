import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type ConfirmationPageProps = {
  searchParams?: { status?: string; ref?: string };
};

export default function ConsultationConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const status = searchParams?.status ?? "error";

  return (
    <section className="py-16 sm:py-24 bg-navy min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold">
              Payment Confirmed
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream/80">
              Your consultation has been booked and payment received. Our team
              will send a confirmation email and follow up via WhatsApp to
              finalize the details.
            </p>
            {searchParams?.ref && (
              <p className="mt-4 text-sm text-cream/60">
                Reference: <span className="font-mono text-gold">{searchParams.ref}</span>
              </p>
            )}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright"
              >
                Return Home
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
              Payment Not Completed
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream/80">
              Your payment could not be completed. If the issue persists, please
              contact us via WhatsApp to arrange an alternative payment method.
            </p>
            {searchParams?.ref && (
              <p className="mt-4 text-sm text-cream/60">
                Reference: <span className="font-mono text-gold">{searchParams.ref}</span>
              </p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services/consultation/book"
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
              Unconfirmed Payment
            </h1>
            <p className="mt-4 text-base sm:text-lg text-cream/80">
              We could not confirm the status of this payment. Please contact us
              directly so we can look into it for you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services/consultation/book"
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
