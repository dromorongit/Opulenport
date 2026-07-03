"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import {
  vehicleRequestSchema,
  VehicleRequestFormValues,
} from "@/lib/validations/forms";

export default function VehicleRequestForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<VehicleRequestFormValues>({
    resolver: zodResolver(vehicleRequestSchema),
  });

  const onSubmit = async (data: VehicleRequestFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/vehicle-requests", {
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
        <label htmlFor="makeModel" className="block text-sm font-medium text-cream mb-1">
          Make / Model
        </label>
        <input
          {...register("makeModel")}
          id="makeModel"
          type="text"
          disabled={isSubmitting}
          placeholder="e.g., Toyota Camry 2020"
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.makeModel && (
          <p className="mt-1 text-xs text-rose-400">{errors.makeModel.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="yearRange" className="block text-sm font-medium text-cream mb-1">
          Year Range (optional)
        </label>
        <input
          {...register("yearRange")}
          id="yearRange"
          type="text"
          disabled={isSubmitting}
          placeholder="e.g., 2018-2022"
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.yearRange && (
          <p className="mt-1 text-xs text-rose-400">{errors.yearRange.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="budgetRangeGHS" className="block text-sm font-medium text-cream mb-1">
          Budget Range (GHS) (optional)
        </label>
        <input
          {...register("budgetRangeGHS")}
          id="budgetRangeGHS"
          type="text"
          disabled={isSubmitting}
          placeholder="e.g., 50,000-100,000"
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.budgetRangeGHS && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.budgetRangeGHS.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="sourceCountryPreference" className="block text-sm font-medium text-cream mb-1">
          Source Country Preference (optional)
        </label>
        <select
          {...register("sourceCountryPreference")}
          id="sourceCountryPreference"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        >
          <option value="">No preference</option>
          <option value="china">China</option>
          <option value="dubai">Dubai</option>
          <option value="france">France</option>
          <option value="other">Other</option>
        </select>
        {errors.sourceCountryPreference && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.sourceCountryPreference.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="additionalDetails" className="block text-sm font-medium text-cream mb-1">
          Additional Details (optional)
        </label>
        <textarea
          {...register("additionalDetails")}
          id="additionalDetails"
          rows={3}
          disabled={isSubmitting}
          placeholder="Any specific requirements?"
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.additionalDetails && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.additionalDetails.message}
          </p>
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