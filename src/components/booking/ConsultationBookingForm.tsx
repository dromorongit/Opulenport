"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, XCircle } from "lucide-react";
import DatePicker from "@/components/booking/DatePicker";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import {
  consultationBookingSchema,
  ConsultationBookingFormValues,
} from "@/lib/validations/booking";

type ServiceOption = {
  id: string;
  name: string;
  category: string;
};

type Props = {
  defaultServiceTypeId?: string;
};

export default function ConsultationBookingForm({
  defaultServiceTypeId,
}: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slotConflict, setSlotConflict] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ConsultationBookingFormValues>({
    resolver: zodResolver(consultationBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTimeSlot: "",
      serviceType: defaultServiceTypeId ?? "",
      notes: "",
    },
  });

  const watchedDate = watch("preferredDate");
  const watchedSlot = watch("preferredTimeSlot");

  useEffect(() => {
    let cancelled = false;
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) return;
        const data: ServiceOption[] = await res.json();
        if (!cancelled) {
          setServices(data);
        }
      } catch {
        if (!cancelled) {
          setServices([]);
        }
      }
    }

    loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (defaultServiceTypeId && services.length > 0) {
      setValue("serviceType", defaultServiceTypeId);
    }
  }, [defaultServiceTypeId, services, setValue]);

  useEffect(() => {
    let cancelled = false;
    async function initializePaymentAndRedirect(id: string | null) {
      if (!id) {
        setIsSubmitted(true);
        return;
      }

      setIsRedirectingToPayment(true);
      try {
        const res = await fetch("/api/payments/consultation/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: id }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error ?? "Payment initialization failed");
        }

        const data = (await res.json()) as {
          authorization_url?: string;
        };

        if (data.authorization_url) {
          window.location.href = data.authorization_url;
          return;
        }

        throw new Error("No authorization URL returned");
      } catch (err) {
        if (!cancelled) {
          setPaymentError(
            err instanceof Error ? err.message : "Payment initialization failed."
          );
          setIsSubmitted(true);
        }
      }
    }

    if (bookingId) {
      void initializePaymentAndRedirect(bookingId);
    }
  }, [bookingId]);

  const onSubmit = async (data: ConsultationBookingFormValues) => {
    setSubmitError(null);
    setSlotConflict(false);
    setPaymentError(null);
    try {
      const response = await fetch("/api/consultation-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 409) {
        const error = await response.json();
        setSlotConflict(true);
        setSubmitError(error.error ?? "That slot was just booked — please choose another time.");
        setRefreshKey((k) => k + 1);
        setValue("preferredTimeSlot", "");
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        setSubmitError(error.error ?? "Submission failed");
        if (error.details) {
          error.details.forEach(
            (e: { field: string; message: string }) =>
              setError(e.field as any, { type: "server", message: e.message })
          );
        }
        return;
      }

      const result = (await response.json()) as { id?: string };
      setBookingId(result.id ?? null);
    } catch {
      setSubmitError("Unable to submit. Please check your connection and try again.");
    }
  };

  if (isSubmitted) {
    const formattedDate = watchedDate
      ? new Date(watchedDate + "T00:00:00Z").toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "your selected date";

    return (
      <div className="rounded-lg border border-gold bg-navy-light p-6 sm:p-8 text-center">
        {paymentError ? (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20">
              <XCircle className="h-6 w-6 text-rose-400" />
            </div>
            <p className="text-cream font-medium">
              Booking saved — payment setup failed
            </p>
            <p className="mt-2 text-sm text-cream/70">
              Your consultation for {formattedDate} at {watchedSlot} has been saved, but we could not
              redirect you to the secure payment page. Please contact our team via WhatsApp to
              arrange manual payment and finalize your booking.
            </p>
            <p className="mt-2 text-sm text-cream/50">{paymentError}</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold">
              <Check className="h-6 w-6 text-navy" />
            </div>
            <p className="text-cream font-medium">
              Consultation requested for {formattedDate} at {watchedSlot}
            </p>
            <p className="mt-2 text-sm text-cream/70">
              This reservation is pending payment confirmation. Our team will follow up to confirm
              payment and finalize your booking.
            </p>
          </>
        )}
      </div>
    );
  }

  if (isRedirectingToPayment) {
    return (
      <div className="rounded-lg border border-gold bg-navy-light p-6 sm:p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
        <p className="text-cream font-medium">Redirecting to secure payment...</p>
        <p className="mt-2 text-sm text-cream/70">
          Please wait while we take you to Paystack to complete your consultation fee payment.
        </p>
      </div>
    );
  }

  const isFormValid = Boolean(
    watchedDate && watchedSlot
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DatePicker
          selectedDate={watchedDate}
          onChange={(date) => {
            setValue("preferredDate", date, { shouldValidate: true });
            setSlotConflict(false);
            setSubmitError(null);
          }}
        />

        <TimeSlotPicker
          selectedDate={watchedDate}
          refreshKey={refreshKey}
          onChange={(slot) => {
            setValue("preferredTimeSlot", slot, { shouldValidate: true });
            setSlotConflict(false);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label htmlFor="serviceType" className="block text-sm font-medium text-cream mb-1">
            Service Type (optional)
          </label>
          <select
            {...register("serviceType")}
            id="serviceType"
            disabled={isSubmitting}
            className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
          >
            <option value="">Select a service...</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.serviceType && (
            <p className="mt-1 text-xs text-rose-400">{errors.serviceType.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-cream mb-1">
          Notes (optional)
        </label>
        <textarea
          {...register("notes")}
          id="notes"
          rows={4}
          disabled={isSubmitting}
          placeholder="Any specific requirements or questions..."
          className="w-full rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-rose-400">{errors.notes.message}</p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-rose-400">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="w-full rounded-md bg-gold px-4 py-3 text-base font-semibold text-navy transition-colors hover:bg-gold-bright disabled:opacity-50"
      >
        {isSubmitting ? "Booking..." : "Book Consultation"}
      </button>
    </form>
  );
}
