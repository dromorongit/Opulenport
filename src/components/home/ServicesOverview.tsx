import connectDB from "@/lib/db";
import Service from "@/models/Service";
import Link from "next/link";

export default async function ServicesOverview() {
  let services: Array<Record<string, unknown>> = [];

  try {
    await connectDB();
    services = await Service.find({}).lean();
  } catch {
    services = [];
  }

  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gold text-center">
          Our Services
        </h2>
        <p className="mt-4 text-center text-cream/70 max-w-2xl mx-auto">
          From sourcing to delivery, we manage the entire journey so you can
          focus on your business.
        </p>

        {services.length === 0 ? (
          <div className="mt-12 text-center text-cream/60">
            <p>No services have been published yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <div
                key={service._id?.toString()}
                className="rounded-lg border border-gold/20 bg-navy-light p-6"
              >
                <h3 className="font-serif text-xl font-semibold text-gold">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-cream/70 line-clamp-3">
                  {service.description}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-gold hover:text-gold-bright"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
