import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-gold">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy">
          Ready to Source Globally?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-navy/80 max-w-2xl mx-auto">
          Book a consultation and let us guide you through procurement,
          sourcing, and delivery — tailored to your needs.
        </p>
        <div className="mt-8">
          <Link
            href="/services/consultation/book"
            className="inline-flex items-center rounded-md bg-navy px-8 py-3 text-base font-semibold text-gold transition-colors hover:bg-navy-light"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
