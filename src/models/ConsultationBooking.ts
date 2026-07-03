import mongoose, { Document, Model, Schema } from "mongoose";
import Service from "./Service";

export interface IConsultationBooking extends Document {
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTimeSlot: string;
  serviceType?: mongoose.Types.ObjectId;
  notes?: string;
  paymentStatus?: "pending" | "paid" | "waived";
  paystackReference?: string;
  amountGHS?: number;
  status?: "requested" | "confirmed" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const ConsultationBookingSchema = new Schema<IConsultationBooking>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTimeSlot: { type: String, required: true },
    serviceType: { type: Schema.Types.ObjectId, ref: "Service" },
    notes: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "waived"],
      default: "pending",
    },
     paystackReference: { type: String, index: true },
    amountGHS: { type: Number },
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled"],
      default: "requested",
    },
  },
  { timestamps: true }
);

const ConsultationBooking: Model<IConsultationBooking> =
  mongoose.models.ConsultationBooking ||
  mongoose.model<IConsultationBooking>(
    "ConsultationBooking",
    ConsultationBookingSchema
  );

export default ConsultationBooking;
