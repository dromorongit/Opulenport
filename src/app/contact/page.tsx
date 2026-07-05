import QuoteRequestForm from "@/components/forms/QuoteRequestForm";
import { Facebook, Instagram, Music, MapPin, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Contact Us | OpulenPort Trading",
    description:
      "Located in Accra, Ghana. Contact us via phone, WhatsApp, email, or our online form for vehicle sourcing, gold jewelry, perfumes, machinery, and logistics services.",
  };
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24 bg-navy min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-cream/80">
            Ready to source premium products or need logistics support? We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div>
            <QuoteRequestForm defaultType="general" />
          </div>

          {/* Right: Contact Info */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gold/20 bg-navy-light p-6">
              <h2 className="font-serif text-2xl font-semibold text-gold mb-4">
                Get in Touch
              </h2>

              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <span className="block text-cream/60">Phone / WhatsApp</span>
                    <a
                      href="tel:+233538499395"
                      className="text-cream hover:text-gold-bright"
                    >
                      +233 538 499 395
                    </a>
                    <br />
                    <a
                      href="https://wa.me/233538499395"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream hover:text-gold-bright"
                    >
                      +233 538 499 395 (WhatsApp)
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <span className="block text-cream/60">Email</span>
                    <a
                      href="mailto:opulenciaholdingsgh@gmail.com"
                      className="text-cream hover:text-gold-bright"
                    >
                      opulenciaholdingsgh@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <span className="block text-cream/60">Location</span>
                    <span className="text-cream">Accra, Ghana</span>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <h3 className="font-serif text-lg font-medium text-gold mb-3">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="text-gold hover:text-gold-bright"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="text-gold hover:text-gold-bright"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://wa.me/233538499395"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="text-gold hover:text-gold-bright"
                  >
                    <span className="text-sm font-semibold">WA</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-lg border border-gold/20 bg-navy-light overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.980552462949!2d-0.12775379999999998!3d5.5628857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf423c8a88e1f:0x90e0108000000000!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Accra, Ghana"
                className="grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}