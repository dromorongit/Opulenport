import Link from "next/link";
import {
  Globe,
  Truck,
  BadgeCheck,
  Headphones,
} from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Trusted Global Suppliers",
    description:
      "Verified partner networks across China, Dubai, France and beyond ensure every shipment meets our quality standards.",
  },
  {
    icon: Truck,
    title: "End-to-End Logistics",
    description:
      "We handle shipping, customs clearance, and last-mile delivery so your goods arrive safely and on time.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Pricing",
    description:
      "Clear quotes, no hidden fees, and honest advice — because trust is the foundation of every partnership.",
  },
  {
    icon: Headphones,
    title: "Ghana-Based Support",
    description:
      "A dedicated local team you can reach by phone, WhatsApp, or email throughout your procurement journey.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-navy-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold text-center">
          Why Choose OpulenPort Trading
        </h2>
        <p className="mt-4 text-center text-cream/70 max-w-2xl mx-auto">
          We combine global reach with local expertise to make importing simple,
          reliable, and valuable.
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
  );
}
