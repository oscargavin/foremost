import Anthropic from "@anthropic-ai/sdk";
import {
  ScannerConfig,
  ScanProgress,
  ScanResult,
  DiscoveredPage,
  PageContent,
  AIOpportunity,
} from "./types";

const anthropic = new Anthropic();

// Helper to extract JSON from Claude's response
function extractJSON<T>(text: string): T | null {
  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
                      text.match(/\{[\s\S]*\}/) ||
                      text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }
    return null;
  } catch {
    return null;
  }
}

// Fetch a URL and return its content
// Returns { content, ok } - ok is false for 404s, timeouts, etc.
async function fetchPage(url: string): Promise<{ content: string; ok: boolean }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Foremost-AI-Scanner/1.0 (AI Opportunity Analysis)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      // 404s and other HTTP errors are expected for some discovered URLs
      return { content: "", ok: false };
    }

    const html = await response.text();
    // Basic HTML to text conversion
    const content = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000); // Limit content size

    return { content, ok: true };
  } catch {
    // Network errors, timeouts - silently skip
    return { content: "", ok: false };
  }
}

// Stage 1: Discover pages from the website
async function discoverPages(
  baseUrl: string,
  maxPages: number
): Promise<{ pages: DiscoveredPage[]; businessInfo: { name: string; industry: string } }> {

  // Try to fetch sitemap first
  const origin = new URL(baseUrl).origin;
  let sitemapContent = "";

  try {
    const sitemapUrls = [
      `${origin}/sitemap.xml`,
      `${origin}/sitemap_index.xml`,
      `${origin}/sitemap1.xml`,
    ];

    for (const sitemapUrl of sitemapUrls) {
      try {
        const response = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
        if (response.ok) {
          sitemapContent = await response.text();
          break;
        }
      } catch {
        continue;
      }
    }
  } catch {
    // No sitemap found
  }

  // Fetch the homepage
  const { content: homepageContent } = await fetchPage(baseUrl);

  const prompt = `You must use British English spelling throughout (e.g., analyse, optimise, personalise, organisation, colour, centre).

Analyse this website to discover key pages and understand the business.

Website URL: ${baseUrl}
${sitemapContent ? `\nSitemap content:\n${sitemapContent.slice(0, 5000)}` : "No sitemap found."}

Homepage content:
${homepageContent.slice(0, 8000)}

Tasks:
1. Identify the business name and industry
2. Find up to ${maxPages} key pages to analyse (prioritise: services, products, about, features)
3. Categorise each page

Return JSON in this exact format:
{
  "businessName": "Company Name",
  "industry": "e.g., E-commerce, SaaS, Healthcare, etc.",
  "pages": [
    {
      "url": "https://example.com/page",
      "title": "Page Title",
      "category": "homepage|product|service|blog|documentation|about|contact|other",
      "priority": 1-10
    }
  ]
}

Only return the JSON, no other text.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  const result = extractJSON<{
    businessName: string;
    industry: string;
    pages: DiscoveredPage[];
  }>(content.text);

  if (!result) {
    // Fallback: return just the homepage
    return {
      pages: [{ url: baseUrl, title: "Homepage", category: "homepage", priority: 10 }],
      businessInfo: { name: "Unknown Business", industry: "Unknown" },
    };
  }

  return {
    pages: result.pages.slice(0, maxPages),
    businessInfo: { name: result.businessName, industry: result.industry },
  };
}

// Stage 2: Fetch and extract content from pages
async function extractPageContents(pages: DiscoveredPage[]): Promise<PageContent[]> {
  const contents: PageContent[] = [];

  for (const page of pages) {
    const { content, ok } = await fetchPage(page.url);
    // Skip pages that failed to fetch (404, timeout, etc.)
    if (!ok || !content) continue;

    contents.push({
      url: page.url,
      title: page.title,
      description: content.slice(0, 500),
      features: [],
      painPoints: [],
      audience: "",
      contentType: page.category,
    });
  }

  return contents;
}

// Stage 3: Analyse content for AI opportunities
async function analyseForOpportunities(
  businessName: string,
  industry: string,
  contents: PageContent[]
): Promise<AIOpportunity[]> {

  const contentSummary = contents
    .map((c) => `Page: ${c.title} (${c.url})\nContent: ${c.description}`)
    .join("\n\n");

  const prompt = `You must use British English spelling throughout (e.g., analyse, optimise, personalise, organisation, colour, centre).

You are an expert AI strategist for ${businessName}, a ${industry} business.

Analyse their website content and identify 3 specific, high-impact AI opportunities.

Website content:
${contentSummary}

For each opportunity, consider:
- What specific problem does it solve for this business?
- How would Claude/AI specifically help?
- What's the implementation complexity?
- What's the potential business impact?

Return JSON in this exact format:
{
  "opportunities": [
    {
      "id": "opp-1",
      "title": "Short, compelling title",
      "description": "2-3 sentences explaining the opportunity and its value",
      "category": "chatbot|automation|personalisation|search|analytics|content|other",
      "targetPages": ["relevant page URLs"],
      "painPointsSolved": ["specific pain point 1", "specific pain point 2"],
      "complexity": 1-5,
      "impact": 1-5,
      "implementationSketch": "Brief technical approach in 1-2 sentences",
      "icon": "MessageSquare|Zap|Target|Search|BarChart|FileText|Sparkles"
    }
  ]
}

Focus on opportunities that are:
1. Specific to THIS business (not generic)
2. Actionable and realistic
3. High impact relative to complexity

Only return the JSON, no other text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  const result = extractJSON<{ opportunities: AIOpportunity[] }>(content.text);
  return result?.opportunities || [];
}

// Stage 4: Generate final summary
async function generateSummary(
  businessName: string,
  industry: string,
  opportunities: AIOpportunity[]
): Promise<{ summary: string; topRecommendation: AIOpportunity | null }> {

  const topOpp = opportunities.reduce((best, current) => {
    const bestScore = (best?.impact || 0) * 2 - (best?.complexity || 5);
    const currentScore = current.impact * 2 - current.complexity;
    return currentScore > bestScore ? current : best;
  }, opportunities[0] || null);

  const prompt = `You must use British English spelling throughout (e.g., analyse, optimise, personalise, organisation, colour, centre).

Write a brief, compelling summary (2-3 sentences) for ${businessName} (${industry}) about their AI opportunities.

Opportunities found:
${opportunities.map((o) => `- ${o.title}: ${o.description}`).join("\n")}

Top recommendation: ${topOpp?.title}

The summary should:
- Be conversational and engaging
- Highlight the potential value
- Create urgency to explore further

Return only the summary text, nothing else.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  return {
    summary: content.text.trim(),
    topRecommendation: topOpp,
  };
}

// Main scanner function - yields progress updates
export async function* scanWebsite(
  config: ScannerConfig
): AsyncGenerator<ScanProgress> {
  const { targetUrl, maxPages = 8 } = config;

  try {
    // Validate URL
    const url = new URL(targetUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid URL protocol");
    }

    // Stage 1: Initialising
    yield {
      stage: "initialising",
      message: "Preparing to analyse your website",
      detail: targetUrl,
      progress: 5,
    };

    await new Promise((r) => setTimeout(r, 500));

    // Stage 2: Discovering pages
    yield {
      stage: "discovering",
      message: "Discovering your website structure",
      detail: "Looking for sitemap and key pages...",
      progress: 15,
    };

    const { pages, businessInfo } = await discoverPages(targetUrl, maxPages);

    yield {
      stage: "discovering",
      message: `Found ${pages.length} key pages`,
      detail: `Analysing ${businessInfo.name} (${businessInfo.industry})`,
      progress: 30,
    };

    // Stage 3: Fetching content
    yield {
      stage: "fetching",
      message: "Reading your website content",
      detail: `Extracting content from ${pages.length} pages...`,
      progress: 40,
    };

    const contents = await extractPageContents(pages);

    yield {
      stage: "fetching",
      message: "Content extracted successfully",
      detail: `Processed ${contents.length} pages`,
      progress: 55,
    };

    // Stage 4: Analysing for opportunities
    yield {
      stage: "analysing",
      message: "Identifying AI opportunities",
      detail: "Our AI is analysing your business for potential solutions...",
      progress: 65,
    };

    const opportunities = await analyseForOpportunities(
      businessInfo.name,
      businessInfo.industry,
      contents
    );

    yield {
      stage: "analysing",
      message: `Found ${opportunities.length} opportunities`,
      detail: "Ranking by impact and feasibility...",
      progress: 80,
    };

    // Stage 5: Generating summary
    yield {
      stage: "generating",
      message: "Generating your personalised insights",
      detail: "Creating actionable recommendations...",
      progress: 90,
    };

    const { summary, topRecommendation } = await generateSummary(
      businessInfo.name,
      businessInfo.industry,
      opportunities
    );

    // Complete
    const result: ScanResult = {
      url: targetUrl,
      businessName: businessInfo.name,
      industry: businessInfo.industry,
      pagesAnalysed: contents.length,
      opportunities,
      topRecommendation,
      summary,
    };

    yield {
      stage: "complete",
      message: "Analysis complete",
      detail: summary,
      progress: 100,
      data: result,
    };

  } catch (error) {
    console.error("Scanner error:", error);
    yield {
      stage: "error",
      message: "Analysis failed",
      detail: error instanceof Error ? error.message : "An unexpected error occurred",
      progress: 0,
    };
  }
}

export type { ScannerConfig, ScanProgress, ScanResult, AIOpportunity };
