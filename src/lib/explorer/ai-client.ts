// AI client with Gemini search grounding support

import type { GroundingSource } from "./types";

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIResponse {
  content: string;
  model: string;
}

export interface GroundedAIResponse extends AIResponse {
  groundingMetadata?: {
    searchEntryPoint?: {
      renderedContent: string;
    };
    groundingChunks?: Array<{
      web?: {
        uri: string;
        title: string;
      };
    }>;
    webSearchQueries?: string[];
  };
  sources?: GroundingSource[];
}

/**
 * Retry utility with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = lastError.message || "";

      const isRetryable =
        errorMessage.includes("429") ||
        errorMessage.includes("500") ||
        errorMessage.includes("502") ||
        errorMessage.includes("503") ||
        errorMessage.includes("504") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ETIMEDOUT");

      if (!isRetryable || attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
      console.log(`[AI] Retrying after ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Call Gemini API
 */
async function callGemini(
  messages: AIMessage[],
  temperature: number,
  maxTokens: number
): Promise<AIResponse> {
  const systemMessage = messages.find((m) => m.role === "system")?.content || "";
  const userMessages = messages.filter((m) => m.role === "user");

  const prompt = systemMessage
    ? `${systemMessage}\n\n${userMessages.map((m) => m.content).join("\n\n")}`
    : userMessages.map((m) => m.content).join("\n\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("No content in Gemini response");
  }

  return { content, model: "gemini-2.0-flash" };
}

/**
 * Call AI with the given messages
 */
export async function callAI(
  messages: AIMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<AIResponse> {
  const { temperature = 0.7, maxTokens = 4000 } = options;

  if (process.env.GEMINI_API_KEY) {
    return await withRetry(() => callGemini(messages, temperature, maxTokens));
  }

  throw new Error("GEMINI_API_KEY is required");
}

/**
 * Call AI with Google Search grounding
 */
export async function callAIWithGrounding(
  messages: AIMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<GroundedAIResponse> {
  const { temperature = 0.5, maxTokens = 4000 } = options;

  if (!process.env.GEMINI_API_KEY) {
    console.warn("[AI] No Gemini API key for grounding");
    const response = await callAI(messages, options);
    return { ...response, sources: [] };
  }

  const systemMessage = messages.find((m) => m.role === "system")?.content || "";
  const userMessages = messages.filter((m) => m.role === "user");

  const prompt = systemMessage
    ? `${systemMessage}\n\n${userMessages.map((m) => m.content).join("\n\n")}`
    : userMessages.map((m) => m.content).join("\n\n");

  console.log("[AI] Calling Gemini with search grounding enabled");

  return await withRetry(async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
          tools: [{ googleSearch: {} }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[AI] Grounded search error:", error);
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const groundingMetadata = data.candidates?.[0]?.groundingMetadata;

    if (!content) {
      throw new Error("No content in Gemini grounded response");
    }

    // Extract sources from grounding chunks
    const sources: GroundingSource[] = [];
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri && chunk.web?.title) {
          if (!sources.some((s) => s.uri === chunk.web!.uri)) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title,
            });
          }
        }
      }
    }

    console.log(`[AI] Grounded response received with ${sources.length} sources`);

    return {
      content,
      model: "gemini-2.0-flash-grounded",
      groundingMetadata,
      sources,
    };
  });
}

/**
 * Parse JSON from AI response, handling markdown code blocks
 */
export function parseAIJSON<T>(content: string): T {
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
  cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("[AI] Failed to parse JSON:", cleaned.slice(0, 500));
    throw new Error("Failed to parse AI response as JSON");
  }
}
