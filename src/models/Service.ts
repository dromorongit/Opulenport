import mongoose, { Document, Model, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  category:
    | "sourcing"
    | "logistics"
    | "vehicle-sourcing"
    | "china-sourcing"
    | "dubai-sourcing"
    | "france-sourcing"
    | "supplier-verification"
    | "consultation";
  description?: string;
  consultationBookable?: boolean;
  consultationFeeGHS?: number;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: {
      type: String,
      enum: [
        "sourcing",
        "logistics",
        "vehicle-sourcing",
        "china-sourcing",
        "dubai-sourcing",
        "france-sourcing",
        "supplier-verification",
        "consultation",
      ],
      required: true,
    },
    description: { type: String },
    consultationBookable: { type: Boolean, default: false },
    consultationFeeGHS: { type: Number },
    icon: { type: String },
  },
  { timestamps: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
