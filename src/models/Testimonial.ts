import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITestimonial extends Document {
  customerName: string;
  customerLocation?: string;
  rating: number;
  content: string;
  relatedCategory?: string;
  approved?: boolean;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true },
    customerLocation: { type: String },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: { type: String, required: true },
    relatedCategory: { type: String },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
