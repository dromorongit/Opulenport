import mongoose, { Document, Model, Schema } from "mongoose";
import Product from "./Product";
import Service from "./Service";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  type: "quote-request" | "product-inquiry" | "general";
  relatedProduct?: mongoose.Types.ObjectId;
  relatedService?: mongoose.Types.ObjectId;
  message: string;
  status?: "new" | "contacted" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    type: {
      type: String,
      enum: ["quote-request", "product-inquiry", "general"],
      required: true,
    },
    relatedProduct: { type: Schema.Types.ObjectId, ref: "Product" },
    relatedService: { type: Schema.Types.ObjectId, ref: "Service" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
