import mongoose, { Document, Model, Schema } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  subscribedAt?: Date;
  active?: boolean;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, unique: true, required: true },
    subscribedAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>(
    "NewsletterSubscriber",
    NewsletterSubscriberSchema
  );

export default NewsletterSubscriber;
