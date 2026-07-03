import { z } from "zod";
import {
  MAX_BOOKING_DAYS_AHEAD,
  BOOKING_LEAD_TIME_HOURS,
  isWorkingDay,
  isWithinBookingWindow,
  startOfDay,
  addDays,
  addHours,
  isBefore,
  isAfter,
} from "@/lib/booking-config";

export const consultationBookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  preferredDate: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Valid date is required")
    .superRefine((val, ctx) => {
      const date = startOfDay(new Date(val));
      const now = new Date();
      const earliest = startOfDay(addHours(now, BOOKING_LEAD_TIME_HOURS));
      const latest = startOfDay(addDays(now, MAX_BOOKING_DAYS_AHEAD));

      if (isBefore(date, earliest)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Bookings must be made at least ${BOOKING_LEAD_TIME_HOURS} hours in advance`,
        });
      }

      if (isAfter(date, latest)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Bookings cannot be made more than ${MAX_BOOKING_DAYS_AHEAD} days ahead`,
        });
      }

      if (!isWorkingDay(date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bookings are only available on weekdays (Mon-Fri)",
        });
      }
    }),
  preferredTimeSlot: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
  serviceType: z.string().optional(),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export type ConsultationBookingFormValues = z.infer<
  typeof consultationBookingSchema
>;
