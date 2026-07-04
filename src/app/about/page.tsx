import Link from "next/link";
import { Globe, Truck, BadgeCheck, Headphones } from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Trusted Global Suppliers",
    description:
      "We maintain verified partner networks across China, Dubai, France, and other strategic markets, ensuring every shipment meets OpulenPort Trading quality standards before it leaves its origin.",
  },
  {
    icon: Truck,
    title: "End-to-End Logistics",
    description:
      "From port to your doorstep, we manage shipping, customs clearance, and last-mile delivery across Ghana with tracking and proactive updates at every stage.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Pricing",
    description:
      "Every quote is detailed and honest. We believe trust is built through clarity, which is why we provide itemized costs, timelines, and terms before you commit.",
  },
  {
    icon: Headphones,
    title: "Ghana-Based Support",
    description:
      "Our dedicated Accra team is available by phone, WhatsApp, and email throughout your journey, offering local insight and rapid problem resolution.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold">
            About OpulenPort Trading
          </h1>
          <p className="mt-6 text-cream/80 text-base sm:text-lg leading-relaxed">
            OpulenPort Trading is an international sourcing, procurement,
            and importation company based in Ghana. We specialize in
            vehicles, gold jewelry, perfumes, machinery, and general goods
            sourced from China, Dubai, France, and other global markets.
            Our mission is to bridge Ghanaian businesses and consumers with
            trusted suppliers by delivering reliable, transparent, and
            efficient trade solutions.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gold/30 bg-navy-light p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-gold">
              Our Mission
            </h2>
            <p className="mt-4 text-cream/80 leading-relaxed">
              To bridge Ghanaian businesses and consumers with trusted global
              suppliers by delivering reliable sourcing, procurement, and
              importation solutions that create value, convenience, and
              growth opportunities.
            </p>
          </div>
          <div className="rounded-xl border border-gold/30 bg-navy-light p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-gold">
              Our Vision
            </h2>
            <p className="mt-4 text-cream/80 leading-relaxed">
              To become Ghana&apos;s most trusted international trade and
              importation company, recognized for excellence in sourcing,
              logistics, customer service, and access to premium global
              products.
            </p>
          </div>
        </div>

        <section className="mt-20 py-16 sm:py-24 bg-navy-light">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold text-center">
              Why Choose OpulenPort Trading
            </h2>
            <p className="mt-4 text-center text-cream/70 max-w-2xl mx-auto">
              We combine global reach with local expertise to make importing
              simple, reliable, and valuable.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 font-serif text-xl font-semibold text-gold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-cream/70">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 text-center">
          <p className="font-serif text-3xl sm:text-5xl font-bold text-gold">
            Trusted Routes, Seamless Delivery
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-md border border-gold px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              Explore Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
