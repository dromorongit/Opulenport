import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-navy overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #C9A24B 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-gold tracking-tight">
          OPULENPORT TRADING
        </h1>
        <p className="mt-6 text-xl sm:text-2xl md:text-3xl text-gold-bright font-serif">
          Trusted Routes, Seamless Delivery
        </p>
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
          We specialize in international sourcing, procurement and importation
          from China, Dubai, France and other global markets into Ghana —
          delivering quality, convenience, and value at every step.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-md bg-gold px-8 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright"
          >
            Request a Quote
          </Link>
          <Link
            href="/products"
            className="rounded-md border border-gold px-8 py-3 text-base font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </section>
  );
}
