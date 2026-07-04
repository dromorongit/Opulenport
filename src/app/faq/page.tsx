"use client";

import { useState } from "react";
import FAQAccordion from "@/components/faq/FAQAccordion";
import { FAQ_ITEMS, FAQ_CATEGORIES, type FAQCategory } from "@/lib/faq-data";
import { buildWhatsAppLink } from "@/lib/constants";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] =
    useState<FAQCategory>("All");

  const filteredItems =
    activeCategory === "All"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold text-center">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-center text-cream/70 max-w-2xl mx-auto">
          Find clear answers about our sourcing, payments, logistics, and
          consultation services. If you need more help, reach out directly.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-gold text-navy"
                  : "bg-navy-light text-cream/80 border border-gold/20 hover:border-gold/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <FAQAccordion items={filteredItems} />
        </div>

        <div className="mt-16 rounded-xl border border-gold/30 bg-navy-light p-6 sm:p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-gold">
            Still have questions?
          </h2>
          <p className="mt-2 text-cream/80">
            We would love to help. Contact us through any channel below.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
            >
              Contact Us
            </a>
            <a
              href={buildWhatsAppLink(
                "Hi, I have a question about OpulenPort Trading."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-gold px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
