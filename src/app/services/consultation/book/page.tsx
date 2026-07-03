import ConsultationBookingForm from "@/components/booking/ConsultationBookingForm";
import { CONSULTATION_FEE_GHS } from "@/lib/booking-config";

export const metadata = {
  title: "Book a Consultation | OpulenPort Trading",
  description:
    "Schedule a consultation with our sourcing experts to discuss your global procurement needs.",
};

export default function BookConsultationPage() {
  return (
    <section className="py-16 sm:py-24 bg-navy min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            Book a Consultation
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            Connect with our team to discuss your sourcing, procurement, and logistics
            needs — and let us guide you through trusted global trade routes tailored
            to your goals.
          </p>
        </div>

        <div className="rounded-lg border border-gold/20 bg-navy-light p-6 sm:p-8">
          <ConsultationBookingForm />
        </div>

        <div className="mt-8 rounded-lg border border-gold/20 bg-navy-light p-4 sm:p-6 text-sm text-cream/70">
          <p className="mb-2">
            <span className="font-semibold text-gold">Business hours:</span> Monday – Friday, 9:00 AM – 5:00 PM (GMT / Africa-Accra)
          </p>
          <p className="mb-2">
            <span className="font-semibold text-gold">Notice required:</span> Bookings must be made at least 24 hours in advance.
          </p>
          <p>
            <span className="font-semibold text-gold">Consultation fee:</span> GHS {CONSULTATION_FEE_GHS} per session{" "}
            <span className="text-cream/50">
              — confirm with client before launch
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
