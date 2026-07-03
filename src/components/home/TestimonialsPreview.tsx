import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { Star } from "lucide-react";

export default async function TestimonialsPreview() {
  let testimonials: Array<Record<string, unknown>> = [];

  try {
    await connectDB();
    testimonials = await Testimonial.find({
      approved: true,
      featured: true,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  } catch {
    testimonials = [];
  }

  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold text-center">
          What Our Clients Say
        </h2>

        {testimonials.length === 0 ? (
          <div className="mt-12 text-center text-cream/60">
            <p>No testimonials have been published yet.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item: any) => (
              <div
                key={item._id?.toString()}
                className="rounded-lg border border-gold/20 bg-navy-light p-6"
              >
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < item.rating
                          ? "fill-gold text-gold"
                          : "text-gold/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-cream/80 italic">
                  &ldquo;{item.content}&rdquo;
                </p>
                <div className="mt-4 text-sm">
                  <span className="font-semibold text-gold">
                    {item.customerName}
                  </span>
                  {item.customerLocation && (
                    <span className="text-cream/60">
                      {" "}
                      — {item.customerLocation}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
