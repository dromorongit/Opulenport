"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { quoteRequestSchema, QuoteRequestFormValues } from "@/lib/validations/forms";

type Props = {
  relatedProductId?: string;
  relatedServiceId?: string;
  defaultType?: "quote-request" | "product-inquiry" | "general";
};

export default function QuoteRequestForm({
  relatedProductId,
  relatedServiceId,
  defaultType = "general",
}: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<QuoteRequestFormValues>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      type: defaultType,
    },
  });

  const onSubmit = async (data: QuoteRequestFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          relatedProduct: relatedProductId ?? data.relatedProduct,
          relatedService: relatedServiceId ?? data.relatedService,
        }),
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
        <label htmlFor="type" className="block text-sm font-medium text-cream mb-1">
          Type
        </label>
        <select
          {...register("type")}
          id="type"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        >
          <option value="general">General Inquiry</option>
          <option value="quote-request">Quote Request</option>
          <option value="product-inquiry">Product Inquiry</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-xs text-rose-400">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-cream mb-1">
          Message
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={4}
          disabled={isSubmitting}
          placeholder="How can we help you?"
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-rose-400">{errors.message.message}</p>
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
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}