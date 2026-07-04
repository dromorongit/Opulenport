import mongoose from "mongoose";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables.");
  process.exit(1);
}

interface SeedPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  published: boolean;
  publishedAt: Date;
  seedTag: true;
}

const now = new Date();
const posts: SeedPost[] = [
  {
    title: "A Guide to Importing Vehicles from Dubai to Ghana",
    slug: "guide-to-importing-vehicles-from-dubai-to-ghana",
    excerpt:
      "Importing a vehicle from Dubai offers access to a wide range of quality cars, but the process requires careful planning, documentation, and compliance with Ghana's import regulations.",
    content: `## Why Source Vehicles from Dubai?

Dubai has established itself as a premier hub for re-exporting high-quality vehicles to markets across Africa. With thousands of cars auctioned weekly, buyers can find well-maintained used vehicles at competitive prices. For Ghanaian importers, the journey from Dubai to Accra is well-trodden, but it still demands attention to detail.

### Key Steps in the Import Process

- **Verify the exporter** and request vehicle history reports before committing funds
- Prepare the required documents: bill of lading, certificate of origin, and insurance certificate
- Engage a licensed customs broker familiar with Ghana Revenue Authority (GRA) procedures
- Budget for **import duty, VAT, and clearing fees**, which can add 30-50% to the vehicle's CIF value
- Register the vehicle with the DVLA upon arrival

### Smart Tips for First-Time Importers

If this is your first time importing a vehicle from Dubai, start with a reputable sourcing agent who can inspect the car physically before shipping. Many buyers rely on third-party inspection services to avoid purchasing vehicles with hidden accident history or mileage discrepancies.

> **Always confirm the vehicle's chassis number matches all paperwork — mismatched details are the single most common cause of clearance delays at Ghanaian ports.**

By partnering with a trusted sourcing partner like OpulenPort Trading, you can streamline this process and reduce your exposure to costly mistakes.`,
    category: "Vehicles",
    coverImage:
      "https://placehold.co/1200x630/151B2C/C9A24B?text=Importing+Vehicles+from+Dubai",
    published: true,
    publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    seedTag: true,
  },
  {
    title: "How to Verify a Trusted Supplier in China",
    slug: "how-to-verify-a-trusted-supplier-in-china",
    excerpt:
      "With millions of manufacturers across China, finding a reliable supplier can feel like searching for a needle in a haystack. Here is how to vet suppliers effectively.",
    content: `## Understanding Supplier Credibility

China remains the world's manufacturing powerhouse, producing everything from electronics to textiles. However, not every supplier with a polished Alibaba profile is trustworthy. Fraudulent listings, counterfeit products, and shipment delays are real risks that can derail your business.

### Practical Verification Methods

- **Business License Check**: Request a copy of the supplier's business license and verify it against official Chinese business registries
- **Factory Audit**: Hire a third-party inspection agency to visit the factory and assess production capacity
- **Sample Orders**: Always place a small sample order before committing to bulk production
- **Payment Terms**: Avoid full upfront payments. Use secure methods like letters of credit or escrow services

### Red Flags to Watch For

Suppliers offering prices significantly below market rate may be cutting corners on quality or materials. If a supplier refuses to provide factory footage or declines an on-site audit, treat that as a warning sign.

> **A legitimate supplier will be proud to show you their operations. Transparency is your strongest indicator of trustworthiness.**

OpulenPort Trading's supplier verification service takes the guesswork out of sourcing. We conduct physical audits, financial checks, and sample assessments so you can trade with confidence.`,
    category: "Sourcing Tips",
    coverImage:
      "https://placehold.co/1200x630/151B2C/C9A24B?text=Verify+Trusted+Supplier+China",
    published: true,
    publishedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    seedTag: true,
  },
  {
    title: "5 Things to Know Before Buying Gold Jewelry Abroad",
    slug: "5-things-to-know-before-buying-gold-jewelry-abroad",
    excerpt:
      "Buying gold jewelry from international markets can yield significant savings, but ignorance of purity standards, certification, and import restrictions can turn a bargain into a burden.",
    content: `## The Appeal of International Gold Purchases

Gold jewelry purchased from global markets such as Dubai, Turkey, or India often comes at a fraction of the retail price you would pay locally. However, purchasing gold abroad is not as simple as spotting a beautiful design and handing over cash.

### What You Absolutely Must Check

- **Karat Certification**: Ensure the piece is hallmarked by an internationally recognized assay office
- **Weight Accuracy**: Weigh the jewelry in front of the seller and compare it to the stated weight
- **Maker's Fee vs. Gold Value**: Understand the separation between the gold's melt value and the craftsmanship premium
- **Import Duty**: Research Ghana's current gold import tariffs to avoid unexpected costs at the port
- **Resale Value**: Designer pieces and certified bullion-backed jewelry hold value far better than generic fashion items

### Making the Right Choice

When deciding between designer and niche brands, consider your long-term goals. Designer pieces carry brand premiums but enjoy strong liquidity. Niche pieces often offer superior craftsmanship at lower prices, though resale can be slower.

> **Never buy gold jewelry without verifying its authenticity certificate — especially when purchasing from informal markets.**

At OpulenPort Trading, we help clients source certified gold jewelry from trusted international suppliers, ensuring both value and authenticity.`,
    category: "Jewelry & Perfumes",
    coverImage:
      "https://placehold.co/1200x630/151B2C/C9A24B?text=Buying+Gold+Jewelry+Abroad",
    published: true,
    publishedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
    seedTag: true,
  },
  {
    title: "Understanding Ghana's Import Duties and Customs Process",
    slug: "understanding-ghanas-import-duties-and-customs-process",
    excerpt:
      "Ghana's customs framework can seem intimidating, but understanding duty classifications, HS codes, and the GRA assessment process helps you budget accurately and avoid delays.",
    content: `## How Import Duties Work in Ghana

Ghana Revenue Authority (GRA) assesses import duty based on the Harmonized System (HS) code assigned to each product. The duty rate varies by category, with vehicles, electronics, and textiles each falling under different tariff bands.

### The Customs Clearance Timeline

- **Pre-Arrival**: Submit your shipping documents through GRA's Customs Data Entry (CDE) system
- **Assessment**: An officer classifies the goods and calculates duty, VAT, and ECOWAS levy if applicable
- **Payment**: Duties must be paid before the goods are released from the port
- **Inspection**: Physical inspection may be required for high-value or restricted items
- **Release**: Once cleared, your clearing agent arranges delivery to your warehouse

### Common Pitfalls

Misclassification of goods is the leading cause of delayed clearances. Using the wrong HS code can trigger a full re-assessment and significant penalties.

> **Budget an additional 30-40% of your CIF value for duties, VAT, and clearing fees — this is the most common mistake first-time importers make.**

Our logistics team at OpulenPort Trading manages end-to-end customs clearance for all our clients, ensuring accurate classification and timely release.`,
    category: "Import Guide",
    coverImage:
      "https://placehold.co/1200x630/151B2C/C9A24B?text=Ghana+Import+Duties+Customs",
    published: true,
    publishedAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
    seedTag: true,
  },
  {
    title: "Niche vs Designer Perfumes: What's the Difference?",
    slug: "niche-vs-designer-perfumes-whats-the-difference",
    excerpt:
      "The perfume aisle has expanded far beyond mainstream designer scents. Niche perfumes offer artistry and exclusivity, but understanding the differences helps you choose the right investment.",
    content: `## Designer Fragrances

Designer perfumes are produced by major fashion houses and distributed through mass retail channels. They prioritize broad appeal, trend-driven marketing, and consistent scent profiles that appeal to large demographics.

### Characteristics

- **Wide availability** across department stores and online retailers
- **Consistent formulations** that rarely change over the years
- **Strong brand recognition** and gift appeal
- **Lower price points** compared to niche alternatives

## Niche Perfumes

Niche perfumes are crafted by independent houses with smaller production runs, unusual ingredients, and a focus on artistic expression. They often feature complex, multi-layered compositions that evolve throughout the day.

### Characteristics

- **Limited distribution**, often only available through specialized retailers or directly from the house
- **Unique ingredient profiles**, including rare absolutes and natural extracts
- **Higher concentration** of aromatic compounds, typically 20-30% compared to 10-15% in designer scents
- **Longer lasting scent** and more distinctive sillage

> **Neither category is inherently better — the right choice depends on your personal style, budget, and how you plan to wear the fragrance.**

OpulenPort Trading sources both designer and niche fragrances from verified suppliers across Europe and the Middle East, ensuring authenticity and competitive pricing for our clients.`,
    category: "Jewelry & Perfumes",
    coverImage:
      "https://placehold.co/1200x630/151B2C/C9A24B?text=Niche+vs+Designer+Perfumes",
    published: true,
    publishedAt: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000),
    seedTag: true,
  },
  {
    title: "Why Supplier Verification Matters for International Trade",
    slug: "why-supplier-verification-matters-for-international-trade",
    excerpt:
      "Supplier verification is not just a formality — it is a risk management tool that protects your capital, ensures product quality, and safeguards your reputation in the market.",
    content: `## The Hidden Costs of Unverified Suppliers

In international trade, the distance between buyer and supplier creates an information gap that bad actors can exploit. Without proper verification, you risk receiving counterfeit goods, facing shipment cancellations, or partnering with companies that lack the financial stability to fulfill large orders.

### What Supplier Verification Covers

- **Legitimacy**: Confirming the registered business exists through government databases
- **Capacity**: Assessing whether the factory can realistically handle your order volume
- **Financial Health**: Checking credit ratings and trade history
- **Quality Compliance**: Verifying adherence to relevant industry standards
- **Legal Standing**: Ensuring no ongoing disputes or sanctions

### Building Trust in Global Markets

For businesses importing into Ghana, supplier verification is particularly critical. The financial exposure per transaction is high, and recovering losses from overseas suppliers can be extremely difficult.

> **A thorough supplier verification process reduces your risk profile and strengthens your negotiating position — you trade from a position of knowledge, not assumption.**

OpulenPort Trading has conducted hundreds of supplier verifications across China, the UAE, and Europe, helping our clients make confident sourcing decisions.`,
    category: "Sourcing Tips",
    coverImage:
      "https://placehold.co/1200x630/151B2C/C9A24B?text=Supplier+Verification+Trade",
    published: true,
    publishedAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000),
    seedTag: true,
  },
];

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await BlogPost.deleteMany({ seedTag: true });
    console.log("Cleared existing seed posts");

    const result = await BlogPost.insertMany(posts);
    console.log(`Inserted ${result.length} blog posts:`);
    result.forEach((post) => {
      console.log(
        `  - ${post.title} | category=${post.category} | slug=${post.slug}`
      );
    });

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

void main();
