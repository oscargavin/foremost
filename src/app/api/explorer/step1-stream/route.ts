// Step 1 Streaming API - Company Analysis + Strategic Inference

import { NextRequest } from "next/server";
import { analyseCompany } from "@/lib/explorer/company-analyser";
import { callAI, parseAIJSON } from "@/lib/explorer/ai-client";
import {
  formatSSE,
  ANALYSIS_STAGES,
  type StreamEvent,
  type StrategicPriority,
  type CompanyData,
} from "@/lib/explorer/types";

function createEvent(event: Omit<StreamEvent, "timestamp">): StreamEvent {
  return { ...event, timestamp: Date.now() };
}

function buildStrategicInferencePrompt(companyData: CompanyData): string {
  const currentDate = new Date().toISOString().split("T")[0];

  const competitorContext =
    companyData.competitors && companyData.competitors.length > 0
      ? `\n**Competitor Intelligence (for context only, do NOT mention by name in rationale):**\n${companyData.competitors.map((c) => `• ${c.name}: ${c.strategicFocus}`).join("\n")}`
      : "";

  return `You are advising the board of ${companyData.companyName} (Today: ${currentDate})

**COMPANY CONTEXT**
Company: ${companyData.companyName}
Website: ${companyData.url}
Industry: ${companyData.industry || "Not specified"}
Description: ${companyData.description || "Not available"}
Key Themes: ${companyData.keyThemes?.join(", ") || "Not available"}
Recent Initiatives: ${companyData.recentInitiatives?.join("; ") || "Not available"}
${competitorContext}

**TASK**
Infer the top 2-3 strategic business priorities the board is likely focused on.

**KEY REQUIREMENT**
For each priority, provide a STRATEGIC RATIONALE that:
- Explains WHY this specific priority applies to THIS company
- Connects to INDUSTRY TRENDS and market dynamics (do NOT name specific competitors)
- Is DIRECTLY RELEVANT to the priority it accompanies

**RATIONALE LENGTH BY CONFIDENCE:**
- HIGH confidence: 3-4 sentences with rich context
- MEDIUM confidence: 2-3 sentences with reasonable explanation
- LOW confidence: 1-2 sentences acknowledging it's based on typical industry patterns

**TONE:**
- Use PLAIN ENGLISH; avoid jargon and buzzwords
- Write in a quietly confident, advisory style
- Be direct and clear; sound like a trusted adviser

**CRITICAL:** Do NOT name competitors. Refer to "industry trends", "sector dynamics", "market pressures" instead.

**OUTPUT FORMAT (JSON):**
{
  "priorities": [
    {
      "priority": "Strategic priority title",
      "rationale": "Direct, plain-English explanation. Length varies by confidence.",
      "confidence": "high" | "medium" | "low",
      "evidence": []
    }
  ]
}

Return ONLY valid JSON.`;
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
        const { companyName, companyUrl, industry } = body;

        if (!companyUrl) {
          send({ type: "error", error: "Company URL is required" });
          controller.close();
          return;
        }

        let fullUrl = companyUrl;
        if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
          fullUrl = `https://${fullUrl}`;
        }

        // Stage 1: Company Analysis
        send({
          type: "stage_update",
          stage: ANALYSIS_STAGES.COMPANY_ANALYSIS.name,
          stageDescription: ANALYSIS_STAGES.COMPANY_ANALYSIS.description,
        });

        send({
          type: "prompt_snippet",
          promptSnippet: `Analysing company website: ${fullUrl}\n\nExtracting:\n• Company name and industry\n• Business description and key themes\n• Recent initiatives and strategic signals\n• Competitor information`,
        });

        const companyData = await analyseCompany(fullUrl);
        if (industry) companyData.industry = industry;
        if (companyName) companyData.companyName = companyName;

        send({
          type: "response_snippet",
          responseSnippet: `Company: ${companyData.companyName}\nIndustry: ${companyData.industry}\n\nKey Themes:\n${companyData.keyThemes?.map((t) => `• ${t}`).join("\n") || "None identified"}\n\nRecent Initiatives:\n${companyData.recentInitiatives?.slice(0, 3).map((i) => `• ${i}`).join("\n") || "None identified"}`,
        });

        // Stage 2: Strategic Inference
        send({
          type: "stage_update",
          stage: ANALYSIS_STAGES.STRATEGIC_INFERENCE.name,
          stageDescription: ANALYSIS_STAGES.STRATEGIC_INFERENCE.description,
        });

        const strategyPrompt = buildStrategicInferencePrompt(companyData);
        send({
          type: "prompt_snippet",
          promptSnippet: strategyPrompt.slice(0, 500) + "...",
        });

        const strategyResponse = await callAI(
          [
            {
              role: "system",
              content: `You are a senior business strategy consultant analysing companies to infer their strategic priorities. Use BRITISH ENGLISH spelling throughout. Always return valid JSON.`,
            },
            { role: "user", content: strategyPrompt },
          ],
          { temperature: 0.6, maxTokens: 3000 }
        );

        send({
          type: "response_snippet",
          responseSnippet: strategyResponse.content.slice(0, 300) + "...",
        });

        const strategyData = parseAIJSON<{ priorities: StrategicPriority[] }>(strategyResponse.content);
        const companyPriorities = strategyData.priorities;

        // Complete
        const result = {
          strategicInference: {
            priorities: companyPriorities,
            disclaimer:
              "This analysis is based on your company's public information. Strategic priorities are inferred from available signals.",
          },
          companyData,
        };

        send({
          type: "complete",
          data: result,
        });

        controller.close();
      } catch (error) {
        console.error("[Step1-Stream] Error:", error);
        send({
          type: "error",
          error: error instanceof Error ? error.message : "Analysis failed",
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
