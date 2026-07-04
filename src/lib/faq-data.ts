export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "general-1",
    category: "General",
    question: "What does OpulenPort Trading do?",
    answer:
      "We specialize in international sourcing, procurement, and importation of vehicles, gold jewelry, perfumes, machinery, and general goods from China, Dubai, France, and other global markets into Ghana.",
  },
  {
    id: "general-2",
    category: "General",
    question: "How long does importation take from China, Dubai, or France?",
    answer:
      "Timelines vary by product, origin, and shipping method. Typically, sea freight takes 4 to 8 weeks, while air freight can take 1 to 3 weeks. We provide accurate estimates during the consultation phase.",
  },
  {
    id: "general-3",
    category: "General",
    question: "Do you deliver to all areas in Ghana?",
    answer:
      "We deliver to major cities and regions across Ghana. For remote locations, additional arrangements may apply. Contact our team for specific delivery details.",
  },
  {
    id: "payments-1",
    category: "Payments & Deposits",
    question: "Do I need to pay the full amount upfront?",
    answer:
      "No. We use a milestone-based payment structure. For vehicles and high-value goods, a deposit is required to secure the order, with the balance payable upon shipping or delivery confirmation.",
  },
  {
    id: "payments-2",
    category: "Payments & Deposits",
    question: "Is my payment secure?",
    answer:
      "Yes. Payments are processed through verified channels with transparent invoices and receipts. We never request full payment without clear milestones and documentation.",
  },
  {
    id: "payments-3",
    category: "Payments & Deposits",
    question: "What is the consultation booking fee for?",
    answer:
      "The consultation fee covers expert sourcing strategy, supplier verification, and a detailed procurement roadmap. It is credited toward your final order value when you proceed.",
  },
  {
    id: "sourcing-1",
    category: "Sourcing & Importation",
    question: "What happens after I submit a quote request?",
    answer:
      "Once your quote request is received, our team verifies suppliers, negotiates pricing, and prepares a detailed quote. We then walk you through options before any commitment.",
  },
  {
    id: "sourcing-2",
    category: "Sourcing & Importation",
    question: "Do you handle customs clearance?",
    answer:
      "Yes. We manage customs documentation, duties, and clearance on your behalf to ensure smooth entry into Ghana. Specific timelines depend on Ghana Revenue Authority processing.",
  },
  {
    id: "sourcing-3",
    category: "Sourcing & Importation",
    question: "Can I request a product not listed on the site?",
    answer:
      "Absolutely. Use our quote request form or book a consultation. We source niche and out-of-catalog items from our global supplier network.",
  },
  {
    id: "vehicles-1",
    category: "Vehicles",
    question: "Can I request a specific vehicle model not shown on the site?",
    answer:
      "Yes. We source vehicles on demand. Provide the make, model, year, and preferred origin, and we will locate, inspect, and ship it to Ghana for you.",
  },
  {
    id: "vehicles-2",
    category: "Vehicles",
    question: "Are the vehicles verified before shipping?",
    answer:
      "Every vehicle undergoes a verification process, including mechanical checks, documentation review, and condition reports before export.",
  },
  {
    id: "consultation-1",
    category: "Consultation",
    question: "How do I verify a supplier through OpulenPort?",
    answer:
      "During consultation, our team conducts due diligence, including factory audits, trade history checks, and sample reviews to ensure supplier reliability.",
  },
  {
    id: "consultation-2",
    category: "Consultation",
    question: "What if the product I receive doesn't match the description?",
    answer:
      "If a product does not match the agreed specifications, we assist with claims, replacements, or refunds based on our sourcing agreement terms.",
  },
];

export const FAQ_CATEGORIES = [
  "All",
  "General",
  "Payments & Deposits",
  "Sourcing & Importation",
  "Vehicles",
  "Consultation",
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];
