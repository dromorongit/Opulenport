"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import {
  supplierContactRequestSchema,
  SupplierContactRequestFormValues,
} from "@/lib/validations/forms";

export default function SupplierContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SupplierContactRequestFormValues>({
    resolver: zodResolver(supplierContactRequestSchema),
  });

  const onSubmit = async (data: SupplierContactRequestFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/supplier-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.details) {
          error.details.forEach(
            (e: { field: string; message: string }) => setError(e.field as any, { type: "server", message: e.message })
          );
        } else {
          setSubmitError(error.error ?? "Submission failed");
        }
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("Unable to submit. Please check your connection and try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-gold bg-navy-light p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold">
          <Check className="h-6 w-6 text-navy" />
        </div>
        <p className="text-cream">
          Thank you &mdash; we&apos;ll be in touch within 24 hours
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-cream mb-1">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-cream mb-1">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-cream mb-1">
          Phone
        </label>
        <input
          {...register("phone")}
          id="phone"
          type="tel"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-rose-400">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-cream mb-1">
          Business Name (optional)
        </label>
        <input
          {...register("businessName")}
          id="businessName"
          type="text"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.businessName && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.businessName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="productCategory" className="block text-sm font-medium text-cream mb-1">
          Product Category
        </label>
        <input
          {...register("productCategory")}
          id="productCategory"
          type="text"
          disabled={isSubmitting}
          placeholder="e.g., Electronics"
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.productCategory && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.productCategory.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="sourceCountry" className="block text-sm font-medium text-cream mb-1">
          Source Country
        </label>
        <select
          {...register("sourceCountry")}
          id="sourceCountry"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        >
          <option value="">Select a country</option>
          <option value="china">China</option>
          <option value="dubai">Dubai</option>
          <option value="france">France</option>
          <option value="other">Other</option>
        </select>
        {errors.sourceCountry && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.sourceCountry.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-cream mb-1">
          Details
        </label>
        <textarea
          {...register("details")}
          id="details"
          rows={4}
          disabled={isSubmitting}
          placeholder="Describe your supplier requirements..."
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.details && (
          <p className="mt-1 text-xs text-rose-400">{errors.details.message}</p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-rose-400">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}