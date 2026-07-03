import connectDB from "@/lib/db";
import Service from "@/models/Service";
import ServiceCard from "@/components/services/ServiceCard";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
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
        <div className="text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            Our Services
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            From global sourcing to last-mile delivery, our end-to-end services
            are designed to make importing into Ghana simple, transparent, and
            reliable.
          </p>
        </div>

        {services.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <ServiceCard
                key={service._id?.toString()}
                name={service.name}
                slug={service.slug}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((category) => (
              <a
                key={category.slug}
                href={`/services/${category.slug}`}
                className="group rounded-lg border border-gold/20 bg-navy-light p-6 text-center transition-all hover:border-gold hover:shadow-lg"
              >
                <h3 className="font-serif text-xl font-semibold text-gold group-hover:text-gold-bright transition-colors">
                  {category.label}
                </h3>
                <p className="mt-2 text-sm text-cream/70">
                  {category.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-gold">
                  Learn More →
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
