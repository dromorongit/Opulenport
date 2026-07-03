import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVehicleRequest extends Document {
  name: string;
  email: string;
  phone: string;
  makeModel: string;
  yearRange?: string;
  budgetRangeGHS?: string;
  sourceCountryPreference?: string;
  additionalDetails?: string;
  status?: "new" | "sourcing" | "quoted" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

const VehicleRequestSchema = new Schema<IVehicleRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    makeModel: { type: String, required: true },
    yearRange: { type: String },
    budgetRangeGHS: { type: String },
    sourceCountryPreference: { type: String },
    additionalDetails: { type: String },
    status: {
      type: String,
      enum: ["new", "sourcing", "quoted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

const VehicleRequest: Model<IVehicleRequest> =
  mongoose.models.VehicleRequest ||
  mongoose.model<IVehicleRequest>("VehicleRequest", VehicleRequestSchema);

export default VehicleRequest;
