import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/calcom";
import { createBookingRequestSchema } from "@/lib/schemas/booking";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 bookings per minute (stricter limit)
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = await checkRateLimit(`booking:${ip}`, RATE_LIMIT_CONFIG);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetAt),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createBookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { slot, details } = parsed.data;

  try {
    const booking = await createBooking(slot.time, {
      name: details.name,
      email: details.email,
      timeZone: slot.timeZone,
      notes: details.notes,
    });

    return NextResponse.json(
      {
        success: true,
        booking: {
          uid: booking.uid,
          title: booking.title,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
        },
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create booking" },
      { status: 500 }
    );
  }
}
