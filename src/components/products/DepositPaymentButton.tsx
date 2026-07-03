"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";

type DepositPaymentButtonProps = {
  productId: string;
  depositAmountGHS: number;
};

export default function DepositPaymentButton({
  productId,
  depositAmountGHS,
}: DepositPaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      productId,
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      const res = await fetch("/api/payments/deposit/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to initialize deposit payment");
      }

      const data = (await res.json()) as { authorization_url?: string };

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
        return;
      }

      throw new Error("No authorization URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-md bg-gold px-4 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright"
      >
        Pay Deposit (GHS {depositAmountGHS.toLocaleString()})
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 px-4">
          <div className="w-full max-w-md rounded-lg border border-gold/20 bg-navy-light p-6 sm:p-8">
            <h3 className="font-serif text-xl font-semibold text-gold">
              Secure Your Deposit
            </h3>
            <p className="mt-2 text-sm text-cream/70">
              Complete the form below to proceed to secure payment for your GHS{" "}
              {depositAmountGHS.toLocaleString()} deposit.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium text-cream mb-1"
                >
                  Full Name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-medium text-cream mb-1"
                >
                  Email
                </label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-sm font-medium text-cream mb-1"
                >
                  Phone
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-cream mb-1"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3">
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-400" />
                  <p className="text-sm text-rose-300">{error}</p>
                </div>
              )}

              {isSubmitting && (
                <p className="text-sm text-cream/70">Redirecting to secure payment...</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-md bg-gold px-4 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Proceed to Payment"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-md border border-gold/40 px-4 py-3 text-base font-semibold text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
