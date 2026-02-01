import { NextRequest } from "next/server";
import { scanWebsite } from "@/lib/scanner";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Note: runtime config removed for cacheComponents compatibility
// Next.js 16 uses Node.js runtime by default for API routes
export const maxDuration = 60;

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 3,  // 3 requests per minute per IP
};

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = getClientIp(request.headers);

  // Check rate limit
  const rateLimitResult = await checkRateLimit(`scan:${ip}`, RATE_LIMIT_CONFIG);

  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Please wait a moment before scanning another website.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetAt),
        },
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
