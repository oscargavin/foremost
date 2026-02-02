/**
 * Cal.com API v2 Client
 *
 * Handles fetching available slots and creating bookings via Cal.com API.
 */

import { z } from "zod";

// Environment validation
const envSchema = z.object({
  CAL_API_KEY: z.string().startsWith("cal_"),
  CAL_EVENT_TYPE_ID: z.string().transform(Number),
  CAL_API_URL: z.string().url().default("https://api.cal.com"),
});

function getEnv() {
  return envSchema.parse({
    CAL_API_KEY: process.env.CAL_API_KEY,
    CAL_EVENT_TYPE_ID: process.env.CAL_EVENT_TYPE_ID,
    CAL_API_URL: process.env.CAL_API_URL || "https://api.cal.com",
  });
}

// Types
export interface TimeSlot {
  time: string; // ISO 8601
}

export interface AvailableSlots {
  [date: string]: TimeSlot[];
}

export interface Attendee {
  name: string;
  email: string;
  timeZone: string;
  notes?: string;
}

export interface BookingResponse {
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: Array<{
    name: string;
    email: string;
    timeZone: string;
  }>;
  status: string;
}

export interface CalComError {
  status: "error";
  message: string;
}

// API response schemas for validation
// Cal.com v2 returns { start: "ISO_DATE" } for each slot
const slotSchema = z.object({
  start: z.string(),
});

// Response is { data: { "YYYY-MM-DD": [{ start: "..." }, ...] } }
const slotsResponseSchema = z.object({
  data: z.record(z.string(), z.array(slotSchema)),
});

// Cal.com v2 booking response schema
const bookingDataSchema = z.object({
  uid: z.string(),
  title: z.string(),
  start: z.string(),
  end: z.string(),
  attendees: z.array(
    z.object({
      name: z.string(),
      email: z.string(),
      timeZone: z.string(),
    })
  ),
  status: z.string(),
  meetingUrl: z.string().optional(),
});

const bookingResponseSchema = z.object({
  status: z.literal("success"),
  data: bookingDataSchema,
});

const errorResponseSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
});

// Cal.com API version headers
const CAL_API_VERSION_SLOTS = "2024-09-04";
const CAL_API_VERSION_BOOKINGS = "2024-08-13";

/**
 * Fetch available booking slots from Cal.com
 */
export async function getAvailableSlots(
  startDate: string,
  endDate: string,
  timeZone: string = "Europe/London"
): Promise<AvailableSlots> {
  const env = getEnv();

  const params = new URLSearchParams({
    start: startDate,
    end: endDate,
    eventTypeId: String(env.CAL_EVENT_TYPE_ID),
    timeZone,
  });

  const response = await fetch(`${env.CAL_API_URL}/v2/slots?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.CAL_API_KEY}`,
      "Content-Type": "application/json",
      "cal-api-version": CAL_API_VERSION_SLOTS,
    },
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cal.com API error:", response.status, errorText);
    let errorMessage = "Failed to fetch available slots";
    try {
      const error = JSON.parse(errorText);
      const parsed = errorResponseSchema.safeParse(error);
      if (parsed.success) {
        errorMessage = parsed.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
    } catch {
      // Keep default message
    }
    throw new Error(errorMessage);
  }

  const json = await response.json();

  const parsed = slotsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Invalid slots response format");
  }

  // Transform { start: "..." } to { time: "..." } for our UI components
  const slots: AvailableSlots = {};
  for (const [date, dateSlots] of Object.entries(parsed.data.data)) {
    slots[date] = dateSlots.map((slot) => ({ time: slot.start }));
  }

  return slots;
}

/**
 * Create a booking via Cal.com
 */
export async function createBooking(
  startTime: string,
  attendee: Attendee
): Promise<BookingResponse> {
  const env = getEnv();

  const response = await fetch(`${env.CAL_API_URL}/v2/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CAL_API_KEY}`,
      "Content-Type": "application/json",
      "cal-api-version": CAL_API_VERSION_BOOKINGS,
    },
    body: JSON.stringify({
      start: startTime,
      eventTypeId: env.CAL_EVENT_TYPE_ID,
      attendee: {
        name: attendee.name,
        email: attendee.email,
        timeZone: attendee.timeZone,
      },
      metadata: attendee.notes ? { notes: attendee.notes } : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    const parsed = errorResponseSchema.safeParse(error);
    throw new Error(
      parsed.success ? parsed.data.message : "Failed to create booking"
    );
  }

  const json = await response.json();

  const bookingParsed = bookingResponseSchema.safeParse(json);
  if (!bookingParsed.success) {
    throw new Error("Invalid booking response format");
  }

  // Transform to our interface format
  const { data } = bookingParsed.data;
  return {
    uid: data.uid,
    title: data.title,
    startTime: data.start,
    endTime: data.end,
    attendees: data.attendees,
    status: data.status,
  };
}

/**
 * Get a booking by UID
 */
export async function getBooking(uid: string): Promise<BookingResponse> {
  const env = getEnv();

  const response = await fetch(`${env.CAL_API_URL}/v2/bookings/${uid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.CAL_API_KEY}`,
      "Content-Type": "application/json",
      "cal-api-version": CAL_API_VERSION_BOOKINGS,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    const parsed = errorResponseSchema.safeParse(error);
    throw new Error(
      parsed.success ? parsed.data.message : "Failed to get booking"
    );
  }

  const json = await response.json();
  const parsed = bookingResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Invalid booking response format");
  }

  // Transform to our interface format
  const { data } = parsed.data;
  return {
    uid: data.uid,
    title: data.title,
    startTime: data.start,
    endTime: data.end,
    attendees: data.attendees,
    status: data.status,
  };
}

/**
 * Cancel a booking by UID
 */
export async function cancelBooking(
  uid: string,
  reason: string = "Cancelled"
): Promise<void> {
  const env = getEnv();

  const response = await fetch(`${env.CAL_API_URL}/v2/bookings/${uid}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CAL_API_KEY}`,
      "Content-Type": "application/json",
      "cal-api-version": CAL_API_VERSION_BOOKINGS,
    },
    body: JSON.stringify({
      cancellationReason: reason,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cal.com cancel booking error:", response.status, errorText);
    throw new Error("Failed to cancel booking");
  }
}

/**
 * Generate calendar add links for a booking
 */
export function generateCalendarLinks(booking: BookingResponse) {
  const { title, startTime, endTime } = booking;
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Format for Google Calendar
  const googleStart = start.toISOString().replace(/-|:|\.\d+/g, "");
  const googleEnd = end.toISOString().replace(/-|:|\.\d+/g, "");

  const googleCalendarUrl = new URL("https://calendar.google.com/calendar/render");
  googleCalendarUrl.searchParams.set("action", "TEMPLATE");
  googleCalendarUrl.searchParams.set("text", title);
  googleCalendarUrl.searchParams.set("dates", `${googleStart}/${googleEnd}`);
  googleCalendarUrl.searchParams.set("details", "Booked via Foremost.ai");

  // Format for Outlook
  const outlookUrl = new URL("https://outlook.live.com/calendar/0/action/compose");
  outlookUrl.searchParams.set("subject", title);
  outlookUrl.searchParams.set("startdt", startTime);
  outlookUrl.searchParams.set("enddt", endTime);

  // Generate ICS content
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Foremost.ai//Booking//EN",
    "BEGIN:VEVENT",
    `DTSTART:${googleStart}`,
    `DTEND:${googleEnd}`,
    `SUMMARY:${title}`,
    "DESCRIPTION:Booked via Foremost.ai",
    `UID:${booking.uid}@foremost.ai`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const icsDataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return {
    google: googleCalendarUrl.toString(),
    outlook: outlookUrl.toString(),
    ics: icsDataUri,
  };
}
