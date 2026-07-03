"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { newsletterSchema, NewsletterFormValues } from "@/lib/validations/forms";

export default function NewsletterForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/newsletter", {
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
      setSubmitError("Unable to subscribe. Please check your connection and try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center gap-2 text-gold">
        <Check className="h-4 w-4" />
        <span className="text-sm font-medium">Subscribed!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md gap-2">
      <label htmlFor="newsletter" className="sr-only">
        Email for newsletter
      </label>
      <input
        {...register("email")}
        id="newsletter"
        type="email"
        placeholder="Enter your email for updates"
        disabled={isSubmitting}
        className="flex-1 rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright disabled:opacity-50"
      >
        Subscribe
      </button>
      {errors.email && (
        <p className="absolute mt-12 text-xs text-rose-400">{errors.email.message}</p>
      )}
      {submitError && (
        <p className="absolute mt-12 text-xs text-rose-400">{submitError}</p>
      )}
    </form>
  );
}