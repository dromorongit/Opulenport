import SupplierContactForm from "@/components/forms/SupplierContactForm";

export const metadata = {
  title: "Supplier Contact | OpulenPort Trading",
  description: "Contact us to verify suppliers and source products from trusted global partners.",
};

export default function SupplierContactPage() {
  return (
    <section className="py-16 sm:py-24 bg-navy min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            Supplier Verification & Contact
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            Need to verify an overseas supplier or source specific products? Our due diligence 
            process ensures you work with trusted partners worldwide.
          </p>
        </div>

        <div className="rounded-lg border border-gold/20 bg-navy-light p-6 sm:p-8">
          <SupplierContactForm />
        </div>
      </div>
    </section>
  );
}