import VehicleRequestForm from "@/components/forms/VehicleRequestForm";

export const metadata = {
  title: "Request a Vehicle | OpulenPort Trading",
  description: "Can&apos;t find the vehicle you&apos;re looking for? Request a specific vehicle and we&apos;ll source it for you.",
};

export default function VehicleRequestPage() {
  return (
    <section className="py-16 sm:py-24 bg-navy min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            Can&apos;t Find the Vehicle You&apos;re Looking For?
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            Tell us exactly what you need and we&apos;ll source it from trusted global suppliers.
            From budget to luxury, we handle the logistics so you don&apos;t have to.
          </p>
        </div>

        <div className="rounded-lg border border-gold/20 bg-navy-light p-6 sm:p-8">
          <VehicleRequestForm />
        </div>
      </div>
    </section>
  );
}