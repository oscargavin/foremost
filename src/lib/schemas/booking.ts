import { z } from "zod";

export const bookingDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export type BookingDetails = z.infer<typeof bookingDetailsSchema>;

export const bookingSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string(), // ISO 8601 timestamp
  timeZone: z.string().default("Europe/London"),
});

export type BookingSlot = z.infer<typeof bookingSlotSchema>;

export const createBookingRequestSchema = z.object({
  slot: bookingSlotSchema,
  details: bookingDetailsSchema,
});

export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;

export const slotsQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T/, "Invalid ISO date"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T/, "Invalid ISO date"),
  timeZone: z.string().default("Europe/London"),
});

export type SlotsQuery = z.infer<typeof slotsQuerySchema>;
