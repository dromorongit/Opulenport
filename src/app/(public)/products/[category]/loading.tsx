import { PRODUCT_CATEGORIES } from "@/lib/constants";

export default function CategoryLoading() {
  return (
    <section className="py-16 sm:py-24 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-10 w-64 mx-auto bg-navy-light rounded animate-pulse mb-4" />
          <div className="h-5 w-96 mx-auto bg-navy-light rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_CATEGORIES.map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gold/20 bg-navy-light overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-navy-light animate-pulse" />
              <div className="p-4 flex flex-col flex-1">
                <div className="h-3 w-20 bg-navy rounded animate-pulse mb-2" />
                <div className="h-6 w-3/4 bg-navy rounded animate-pulse mb-2" />
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="h-4 w-16 bg-navy rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}