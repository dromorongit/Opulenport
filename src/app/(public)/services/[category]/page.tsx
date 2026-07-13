import connectDB from "@/lib/db";
import Service from "@/models/Service";
import ServiceCard from "@/components/services/ServiceCard";
import QuoteRequestForm from "@/components/forms/QuoteRequestForm";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return SERVICE_CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

export const dynamic = "force-dynamic";

export default async function ServiceCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryInfo = SERVICE_CATEGORIES.find((c) => c.slug === category);

  if (!categoryInfo) {
    notFound();
  }

  let services: Array<Record<string, unknown>> = [];
  let firstServiceId: string | null = null;

  try {
    await connectDB();
    services = await Service.find({ category }).lean();
    if (services.length > 0 && services[0]?._id) {
      firstServiceId = services[0]._id.toString();
    }
  } catch {
    services = [];
  }

  if (category === "supplier-verification") {
    return (
      <section className="py-16 sm:py-24 bg-navy min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
              {categoryInfo.label}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
              {categoryInfo.description}
            </p>
          </div>

          <div className="rounded-lg border border-gold/20 bg-navy-light p-6 sm:p-8">
            <QuoteRequestForm defaultType="general" />
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/services/supplier-verification/contact"
              className="inline-block rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy hover:bg-gold-bright"
            >
              Need to contact us about supplier verification?
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (category === "consultation") {
    return (
      <section className="py-16 sm:py-24 bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
              {categoryInfo.label}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
              {categoryInfo.description}
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
            <div className="mt-12">
              <p className="text-cream/70 text-center">
                No specific services have been published for this category yet.
                Below is an overview of what we offer.
              </p>
              <div className="mt-8 rounded-lg border border-gold/20 bg-navy-light p-8">
                <p className="text-cream/80">{categoryInfo.description}</p>
                <Link
                  href="/services/consultation/book"
                  className="mt-6 inline-block rounded-md bg-gold px-6 py-3 text-base font-semibold text-navy hover:bg-gold-bright"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            {categoryInfo.label}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            {categoryInfo.description}
          </p>
        </div>

        {services.length > 0 ? (
          <>
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
            <div className="mt-12 rounded-lg border border-gold/20 bg-navy-light p-6">
              <h3 className="font-serif text-xl font-semibold text-gold mb-4">
                Have questions about this service?
              </h3>
              <QuoteRequestForm
                defaultType="product-inquiry"
                relatedServiceId={firstServiceId ?? undefined}
              />
            </div>
          </>
        ) : (
          <div className="mt-12">
            <p className="text-cream/70 text-center">
              No specific services have been published for this category yet.
              Below is an overview of what we offer.
            </p>
            <div className="mt-8 rounded-lg border border-gold/20 bg-navy-light p-8">
              <p className="text-cream/80">{categoryInfo.description}</p>
              <QuoteRequestForm defaultType="product-inquiry" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}