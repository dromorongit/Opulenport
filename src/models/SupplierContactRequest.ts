import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISupplierContactRequest extends Document {
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  productCategory: string;
  sourceCountry: "china" | "dubai" | "france" | "other";
  details: string;
  status?: "new" | "in-progress" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

const SupplierContactRequestSchema = new Schema<ISupplierContactRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    businessName: { type: String },
    productCategory: { type: String, required: true },
    sourceCountry: {
      type: String,
      enum: ["china", "dubai", "france", "other"],
      required: true,
    },
    details: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in-progress", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

const SupplierContactRequest: Model<ISupplierContactRequest> =
  mongoose.models.SupplierContactRequest ||
  mongoose.model<ISupplierContactRequest>(
    "SupplierContactRequest",
    SupplierContactRequestSchema
  );

export default SupplierContactRequest;
