// Step 2 Streaming API - Use Case Generation

import { NextRequest } from "next/server";
import { callAI, parseAIJSON } from "@/lib/explorer/ai-client";
import {
  formatSSE,
  ANALYSIS_STAGES,
  type StreamEvent,
  type StrategicPriority,
  type CompanyData,
  type TwoPathsResult,
} from "@/lib/explorer/types";

function createEvent(event: Omit<StreamEvent, "timestamp">): StreamEvent {
  return { ...event, timestamp: Date.now() };
}

function buildUseCasePrompt(companyData: CompanyData, strategicPriorities: string[]): string {
  return `You are a senior AI strategy consultant presenting to a BOARD-LEVEL AUDIENCE for ${companyData.companyName}.

**CONTEXT**
Company: ${companyData.companyName}
Industry: ${companyData.industry || "Unknown"}
Description: ${companyData.description || "Not available"}

**STRATEGIC PRIORITIES (these MUST drive your recommendations):**
${strategicPriorities.map((p, i) => `${i + 1}. ${p}`).join("\n")}

**CRITICAL REQUIREMENT: STRATEGY ALIGNMENT**
Every use case you suggest MUST directly support one or more of the strategic priorities listed above.
- Start by considering each priority and asking: "What AI capability would help achieve this?"
- Do NOT suggest generic AI use cases; tailor each one to THIS company's specific strategy
- In the strategicRationale, explicitly name which priority the use case supports

**TASK**
Generate AI opportunities in TWO categories:

**Path A: Business Reimagination** (2-3 opportunities)
• Fundamental changes to business model or customer offering
• High ambition, addresses the most important strategic priorities
• Creates new value or competitive advantages

**Path B: Efficiency & Optimisation** (3-4 opportunities)
• Operational improvements aligned to strategic priorities
• Cost reduction, speed, productivity
• Quicker wins that build AI capability

**FOR EACH OPPORTUNITY, PROVIDE:**
1. **Description**: 3-4 sentences explaining WHAT the opportunity is and HOW it would work in practice
2. **Strategic Rationale**: 2-3 sentences explicitly connecting this to a named strategic priority
3. **Advantages**: 3-4 practical benefits
4. **Risks**: 3-4 items including business drawbacks AND AI-specific risks (data leakage, bias, hallucinations, etc.)
5. **Uncertainties**: 2-3 unknowns
6. **Tradeoffs**: 2-3 balancing considerations

**OUTPUT FORMAT (JSON):**
{
  "reimagination": [
    {
      "id": "uc-r1",
      "title": "Specific, concrete title",
      "description": "3-4 sentences explaining WHAT this is and HOW it works in practice.",
      "path": "reimagination",
      "relevanceScore": 85,
      "tags": ["Priority Name Here"],
      "strategicRationale": "This directly supports [Priority Name] by... Explain the specific connection.",
      "advantages": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "risks": ["Risk 1", "Risk 2", "AI risk 1"],
      "uncertainties": ["Uncertainty 1", "Uncertainty 2"],
      "tradeoffs": ["Tradeoff 1", "Tradeoff 2"],
      "riskAssessment": {
        "rating": "high",
        "justification": "Brief explanation of overall risk level",
        "implementationRisks": ["Implementation risk 1", "Implementation risk 2"]
      }
    }
  ],
  "efficiency": [
    {
      "id": "uc-e1",
      "title": "Specific title",
      "description": "2-3 sentences explaining the use case",
      "path": "efficiency",
      "relevanceScore": 75,
      "timeframe": "3-6 months",
      "impact": "Medium: qualitative impact description",
      "tags": ["Priority Name Here"],
      "strategicRationale": "This directly addresses [Priority] by...",
      "advantages": ["Benefit 1", "Benefit 2"],
      "risks": ["Risk 1", "AI risk 1"],
      "uncertainties": ["Uncertainty 1"],
      "tradeoffs": ["Tradeoff 1"],
      "riskAssessment": {
        "rating": "low",
        "justification": "Brief explanation",
        "implementationRisks": ["Implementation risk 1"]
      }
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
        const { companyData, strategicPriorities } = body as {
          companyData: CompanyData;
          strategicPriorities: StrategicPriority[];
        };

        if (!companyData || !strategicPriorities) {
          send({ type: "error", error: "Company data and strategic priorities are required" });
          controller.close();
          return;
        }

        // Stage: Use Case Generation
        send({
          type: "stage_update",
          stage: ANALYSIS_STAGES.USE_CASE_GENERATION.name,
          stageDescription: ANALYSIS_STAGES.USE_CASE_GENERATION.description,
        });

        const strategicPrioritiesText = strategicPriorities.map((p) => p.priority);
        const useCasePrompt = buildUseCasePrompt(companyData, strategicPrioritiesText);

        send({
          type: "prompt_snippet",
          promptSnippet: `Generating AI opportunities for ${companyData.companyName}\n\nBased on priorities:\n${strategicPrioritiesText.map((p) => `• ${p}`).join("\n")}`,
        });

        const useCaseResponse = await callAI(
          [
            {
              role: "system",
              content: `You are a senior AI strategy consultant preparing board-level strategic recommendations. Your analysis must be balanced, honest, and actionable. Use BRITISH ENGLISH spelling. Always return valid JSON.`,
            },
            { role: "user", content: useCasePrompt },
          ],
          { temperature: 0.6, maxTokens: 6000 }
        );

        send({
          type: "response_snippet",
          responseSnippet: useCaseResponse.content.slice(0, 400) + "...",
        });

        const useCases = parseAIJSON<TwoPathsResult>(useCaseResponse.content);

        // Complete
        const result = {
          twoPaths: useCases,
        };

        send({
          type: "complete",
          data: result,
        });

        controller.close();
      } catch (error) {
        console.error("[Step2-Stream] Error:", error);
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
