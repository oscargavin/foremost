import { NextRequest } from "next/server";
import { scanWebsite } from "@/lib/scanner";

export const runtime = "nodejs";
export const maxDuration = 60;

// Rate limiting - simple in-memory store (use Redis in production)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Clean old entries
  const entries = Array.from(rateLimitMap.entries());
  for (const [k, v] of entries) {
    if (now - v > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(k);
    }
  }

  const requests = entries.filter(([k]) => k.startsWith(ip)).length;

  if (requests >= MAX_REQUESTS) {
    return true;
  }

  rateLimitMap.set(`${ip}-${now}`, now);
  return false;
}

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Please wait a moment before scanning another website.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Parse request body
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { url } = body;

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate URL
  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid URL format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create SSE stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Run scanner directly and stream progress
        for await (const progress of scanWebsite({ targetUrl: url, maxPages: 8 })) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(progress)}\n\n`)
          );
        }
      } catch (error) {
        const errorData = `data: ${JSON.stringify({
          stage: "error",
          message: "Analysis failed",
          detail: error instanceof Error ? error.message : "Unknown error",
          progress: 0,
        })}\n\n`;
        controller.enqueue(encoder.encode(errorData));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
