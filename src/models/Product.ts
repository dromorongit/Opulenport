import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: "vehicles" | "gold-jewelry" | "perfumes" | "merchandise" | "machinery";
  description?: string;
  images: string[];
  priceGHS?: number;
  priceIsEstimate?: boolean;
  depositRequired?: boolean;
  depositAmountGHS?: number;
  specs?: Record<string, unknown>;
  status?: "available" | "sold" | "on-request";
  featured?: boolean;
  seedTag?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: {
      type: String,
      enum: ["vehicles", "gold-jewelry", "perfumes", "merchandise", "machinery"],
      required: true,
    },
    description: { type: String },
    images: { type: [String], default: [] },
    priceGHS: { type: Number },
    priceIsEstimate: { type: Boolean, default: true },
    depositRequired: { type: Boolean, default: false },
    depositAmountGHS: { type: Number },
    specs: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["available", "sold", "on-request"],
      default: "available",
    },
    featured: { type: Boolean, default: false },
    seedTag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
