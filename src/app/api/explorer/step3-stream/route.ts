// Step 3 Streaming API - Market Intelligence (Competitor AI Initiatives)

import { NextRequest } from "next/server";
import { callAIWithGrounding, parseAIJSON } from "@/lib/explorer/ai-client";
import {
  formatSSE,
  ANALYSIS_STAGES,
  type StreamEvent,
  type MarketSignalsResult,
  type CompetitorInsight,
  type StrategicInferenceResult,
} from "@/lib/explorer/types";

function createEvent(event: Omit<StreamEvent, "timestamp">): StreamEvent {
  return { ...event, timestamp: Date.now() };
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Omit<StreamEvent, "timestamp">) => {
        controller.enqueue(encoder.encode(formatSSE(createEvent(event))));
      };

      try {
        const body = await request.json();
        const { industry, companyName, competitors, strategicInference } = body as {
          industry?: string;
          companyName?: string;
          competitors?: CompetitorInsight[];
          strategicInference?: StrategicInferenceResult;
        };

        // Stage: Market Intelligence
        send({
          type: "stage_update",
          stage: ANALYSIS_STAGES.MARKET_INTELLIGENCE.name,
          stageDescription: ANALYSIS_STAGES.MARKET_INTELLIGENCE.description,
        });

        const competitorNames = competitors?.map((c) => c.name).slice(0, 5) || [];
        const competitorList = competitorNames.length > 0
          ? competitorNames.join(", ")
          : "major players in the industry";

        const prompt = `Search for recent AI initiatives by companies in the ${industry || "business"} sector.

**TARGET COMPANIES:**
${competitorList}

**COMPANY CONTEXT:**
Researching AI initiatives relevant to ${companyName || "the target company"} in ${industry || "their industry"}.

**SEARCH REQUIREMENTS:**
1. Find REAL, VERIFIABLE AI initiatives announced in the last 12 months
2. Focus on AI adoption, automation, machine learning, or digital transformation projects
3. Include source URLs where available
4. Only include initiatives you can verify through search

**OUTPUT FORMAT (JSON):**
{
  "signals": [
    {
      "company": "Company name",
      "country": "Country where headquartered",
      "industry": "${industry || "Industry"}",
      "initiative": "Brief description of the AI initiative (2-3 sentences)",
      "source": "URL to source article or press release",
      "date": "YYYY-MM format when announced"
    }
  ],
  "disclaimer": "This information is based on publicly available sources and may not be comprehensive."
}

**GUIDELINES:**
- Return 3-6 relevant signals
- Only include real, verifiable initiatives
- If you cannot find specific AI initiatives, return an empty signals array
- Focus on initiatives similar to what ${companyName || "the target company"} might pursue

Return ONLY valid JSON.`;

        send({
          type: "prompt_snippet",
          promptSnippet: `Researching AI initiatives in ${industry || "the industry"}\n\nLooking at: ${competitorList}`,
        });

        const response = await callAIWithGrounding(
          [
            {
              role: "system",
              content: `You are a market intelligence analyst researching AI adoption trends. Use BRITISH ENGLISH spelling. Only report verifiable information from your search results. Always return valid JSON.`,
            },
            { role: "user", content: prompt },
          ],
          { temperature: 0.3, maxTokens: 3000 }
        );

        send({
          type: "response_snippet",
          responseSnippet: response.content.slice(0, 300) + "...",
        });

        const marketSignals = parseAIJSON<MarketSignalsResult>(response.content);

        // Add grounding sources
        marketSignals.sources = response.sources || [];
        marketSignals.isGrounded = (response.sources?.length || 0) > 0;

        // Complete
        const result = {
          marketSignals,
        };

        send({
          type: "complete",
          data: result,
        });

        controller.close();
      } catch (error) {
        console.error("[Step3-Stream] Error:", error);
        send({
          type: "error",
          error: error instanceof Error ? error.message : "Market intelligence failed",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
