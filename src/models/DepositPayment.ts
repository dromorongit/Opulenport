import mongoose, { Document, Model, Schema } from "mongoose";
import Product from "./Product";

export interface IDepositPayment extends Document {
  product: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountGHS: number;
  paystackReference: string;
  paymentStatus: "pending" | "paid" | "failed";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepositPaymentSchema = new Schema<IDepositPayment>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    amountGHS: { type: Number, required: true },
    paystackReference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const DepositPayment: Model<IDepositPayment> =
  mongoose.models.DepositPayment ||
  mongoose.model<IDepositPayment>("DepositPayment", DepositPaymentSchema);

export default DepositPayment;
