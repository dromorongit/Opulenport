import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import TestimonialForm from "../../TestimonialForm";

async function getTestimonial(id: string): Promise<any | null> {
  await connectDB();
  const testimonial = await Testimonial.findById(id).lean();

  if (!testimonial) return null;

  return {
    _id: testimonial._id.toString(),
    customerName: testimonial.customerName,
    customerLocation: testimonial.customerLocation,
    rating: testimonial.rating,
    content: testimonial.content,
    relatedCategory: testimonial.relatedCategory,
    approved: testimonial.approved ?? false,
    featured: testimonial.featured ?? false,
  };
}

export default async function EditTestimonialPage({
  params,
}: {
  params: { id: string };
}) {
  const testimonial = await getTestimonial(params.id);

  if (!testimonial) {
    notFound();
  }

  return <TestimonialForm initialData={testimonial} />;
}