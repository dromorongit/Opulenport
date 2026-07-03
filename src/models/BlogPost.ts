import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: string;
  category?: string;
  published?: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, default: "OpulenPort Trading" },
    category: { type: String },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
