import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables.");
  process.exit(1);
}

interface SeedProduct {
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  priceGHS?: number;
  priceIsEstimate: boolean;
  depositRequired: boolean;
  depositAmountGHS?: number;
  specs: Record<string, unknown>;
  status: "available" | "sold" | "on-request";
  featured: boolean;
  seedTag: true;
}

const seedProducts: SeedProduct[] = [
  {
    name: "2021 Toyota Land Cruiser",
    slug: "2021-toyota-land-cruiser",
    category: "vehicles",
    description:
      "Well-maintained 2021 Toyota Land Cruiser with full service history. Perfect for both urban and off-road use.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Toyota+Land+Cruiser",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Toyota+Interior",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Toyota+Side",
    ],
    priceGHS: 850000,
    priceIsEstimate: false,
    depositRequired: true,
    depositAmountGHS: 85000,
    specs: {
      year: 2021,
      mileage: "45,000 km",
      engine: "5.7L V8 Petrol",
      transmission: "Automatic",
      color: "White",
    },
    status: "available",
    featured: true,
    seedTag: true,
  },
  {
    name: "2019 Mercedes-Benz GLE",
    slug: "2019-mercedes-benz-gle",
    category: "vehicles",
    description:
      "Luxury 2019 Mercedes-Benz GLE 450 with premium features and excellent driving dynamics.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Mercedes+GLE",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Mercedes+Interior",
    ],
    priceGHS: 720000,
    priceIsEstimate: false,
    depositRequired: true,
    depositAmountGHS: 72000,
    specs: {
      year: 2019,
      mileage: "38,000 km",
      engine: "3.0L V6 Petrol",
      transmission: "Automatic",
      color: "Black",
    },
    status: "available",
    featured: false,
    seedTag: true,
  },
  {
    name: "18K Gold Chain Necklace",
    slug: "18k-gold-chain-necklace",
    category: "gold-jewelry",
    description:
      "Elegant 18K solid gold chain necklace, handcrafted by skilled artisans. A timeless addition to any collection.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=18K+Gold+Chain",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Gold+Chain+Detail",
    ],
    priceGHS: 12000,
    priceIsEstimate: false,
    depositRequired: true,
    depositAmountGHS: 2000,
    specs: {
      karat: "18K",
      weight: "12 grams",
      style: "Cuban Link",
      clasp: "Lobster Clasp",
    },
    status: "available",
    featured: true,
    seedTag: true,
  },
  {
    name: "22K Gold Bangle Set",
    slug: "22k-gold-bangle-set",
    category: "gold-jewelry",
    description:
      "Stunning 22K gold bangle set, featuring three intricately designed bangles.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=22K+Gold+Bangle",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Bangle+Set",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Gold+Detail",
    ],
    priceGHS: 28000,
    priceIsEstimate: false,
    depositRequired: true,
    depositAmountGHS: 5000,
    specs: {
      karat: "22K",
      weight: "28 grams",
      style: "Traditional",
      quantity: "Set of 3",
    },
    status: "available",
    featured: true,
    seedTag: true,
  },
  {
    name: "Creed Aventus 100ml",
    slug: "creed-aventus-100ml",
    category: "perfumes",
    description:
      "Legendary Creed Aventus fragrance. Notes of pineapple, birch, and musk create an unforgettable scent.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Creed+Aventus",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Aventus+Packaging",
    ],
    priceGHS: 4500,
    priceIsEstimate: false,
    depositRequired: false,
    specs: {
      size: "100ml",
      concentration: "EDP",
      notes: "Pineapple, Birch, Musk",
      origin: "France",
    },
    status: "available",
    featured: false,
    seedTag: true,
  },
  {
    name: "Tom Ford Oud Wood 50ml",
    slug: "tom-ford-oud-wood-50ml",
    category: "perfumes",
    description:
      "Tom Ford Oud Wood Eau de Parfum. Rich oud, rosewood, and cardamom blend for a warm, woody aroma.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Tom+Ford+Oud+Wood",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Oud+Wood+Bottle",
    ],
    priceGHS: 3800,
    priceIsEstimate: false,
    depositRequired: false,
    specs: {
      size: "50ml",
      concentration: "EDP",
      notes: "Oud, Rosewood, Cardamom",
      origin: "France",
    },
    status: "available",
    featured: false,
    seedTag: true,
  },
  {
    name: "Samsung 55-inch QLED TV",
    slug: "samsung-55-inch-qled-tv",
    category: "merchandise",
    description:
      "Crisp Samsung 55-inch QLED 4K Smart TV with vibrant colors and smart connectivity.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Samsung+QLED+TV",
      "https://placehold.co/800x600/151B2C/C9A24B?text=TV+Box+View",
    ],
    priceGHS: 18500,
    priceIsEstimate: false,
    depositRequired: true,
    depositAmountGHS: 3000,
    specs: {
      brand: "Samsung",
      screen: "55-inch QLED",
      resolution: "4K UHD",
      condition: "Brand New",
    },
    status: "available",
    featured: false,
    seedTag: true,
  },
  {
    name: "Bulk Office Furniture Set",
    slug: "bulk-office-furniture-set",
    category: "merchandise",
    description:
      "Complete bulk office furniture set including 10 desks, 10 ergonomic chairs, and filing cabinets.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Office+Furniture",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Desk+and+Chair",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Office+Setup",
    ],
    priceGHS: 95000,
    priceIsEstimate: false,
    depositRequired: true,
    depositAmountGHS: 15000,
    specs: {
      brand: "Mixed",
      quantity: "10 desks + 10 chairs",
      condition: "New",
      material: "Wood/Metal",
    },
    status: "available",
    featured: false,
    seedTag: true,
  },
  {
    name: "Industrial Generator 20kVA",
    slug: "industrial-generator-20kva",
    category: "machinery",
    description:
      "Reliable 20kVA industrial diesel generator, ideal for backup power and construction sites.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Industrial+Generator",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Generator+Control",
    ],
    priceGHS: 32000,
    priceIsEstimate: false,
    depositRequired: true,
    depositAmountGHS: 5000,
    specs: {
      power: "20kVA",
      fuelType: "Diesel",
      condition: "Refurbished",
      origin: "China",
    },
    status: "available",
    featured: false,
    seedTag: true,
  },
  {
    name: "Used Forklift 3-ton",
    slug: "used-forklift-3-ton",
    category: "machinery",
    description:
      "Heavy-duty 3-ton used forklift in excellent working condition. Regularly serviced.",
    images: [
      "https://placehold.co/800x600/151B2C/C9A24B?text=Forklift+3-ton",
      "https://placehold.co/800x600/151B2C/C9A24B?text=Forklift+View",
    ],
    priceGHS: 28000,
    priceIsEstimate: false,
    depositRequired: false,
    specs: {
      power: "3-ton",
      fuelType: "Diesel",
      condition: "Used",
      origin: "Germany",
    },
    status: "available",
    featured: false,
    seedTag: true,
  },
];

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({ seedTag: true });
    console.log("Cleared existing seed products");

    const result = await Product.insertMany(seedProducts);
    console.log(`Inserted ${result.length} products:`);
    result.forEach((p) => {
      console.log(
        `  - ${p.name} (${p.category}) | depositRequired=${p.depositRequired} | featured=${p.featured}`
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
