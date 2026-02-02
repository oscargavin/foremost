import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/calcom";
import { slotsQuerySchema } from "@/lib/schemas/booking";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
};

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = await checkRateLimit(`slots:${ip}`, RATE_LIMIT_CONFIG);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetAt),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);

  const parsed = slotsQuerySchema.safeParse({
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    timeZone: searchParams.get("timeZone") || "Europe/London",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(
      parsed.data.startDate,
      parsed.data.endDate,
      parsed.data.timeZone
    );

    return NextResponse.json(
      { slots },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch slots:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
