import TestimonialsClient from "./TestimonialsClient";
import Testimonial from "@/models/Testimonial";
import connectDB from "@/lib/db";

async function getTestimonials() {
  await connectDB();
  return Testimonial.find({})
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      items.map((t: any) => ({
        id: t._id.toString(),
        customerName: t.customerName,
        customerLocation: t.customerLocation,
        rating: t.rating,
        content: t.content,
        relatedCategory: t.relatedCategory,
        approved: t.approved ?? false,
        featured: t.featured ?? false,
        createdAt: t.createdAt,
      }))
    );
}

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsClient testimonials={testimonials} />;
}