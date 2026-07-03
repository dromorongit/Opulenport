import { z } from "zod";

export const quoteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  type: z.enum(["quote-request", "product-inquiry", "general"]),
  relatedProduct: z.string().optional(),
  relatedService: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type QuoteRequestFormValues = z.infer<typeof quoteRequestSchema>;

export const vehicleRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  makeModel: z.string().min(1, "Make/Model is required"),
  yearRange: z.string().optional(),
  budgetRangeGHS: z.string().optional(),
  sourceCountryPreference: z.string().optional(),
  additionalDetails: z.string().optional(),
});

export type VehicleRequestFormValues = z.infer<typeof vehicleRequestSchema>;

export const supplierContactRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  businessName: z.string().optional(),
  productCategory: z.string().min(1, "Product category is required"),
  sourceCountry: z.enum(["china", "dubai", "france", "other"]),
  details: z.string().min(10, "Details must be at least 10 characters"),
});

export type SupplierContactRequestFormValues = z.infer<
  typeof supplierContactRequestSchema
>;

export const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const depositPaymentSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  notes: z.string().optional(),
});

export type DepositPaymentFormValues = z.infer<typeof depositPaymentSchema>;