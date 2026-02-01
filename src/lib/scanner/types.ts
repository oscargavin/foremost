// Scanner Types

export interface ScannerConfig {
  targetUrl: string;
  maxPages?: number;
}

export interface DiscoveredPage {
  url: string;
  title: string;
  category: "homepage" | "product" | "service" | "blog" | "documentation" | "about" | "contact" | "other";
  priority: number;
}

export interface PageContent {
  url: string;
  title: string;
  description: string;
  features: string[];
  painPoints: string[];
  audience: string;
  contentType: string;
}

export interface AIOpportunity {
  id: string;
  title: string;
  description: string;
  category: "chatbot" | "automation" | "personalisation" | "search" | "analytics" | "content" | "other";
  targetPages: string[];
  painPointsSolved: string[];
  complexity: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  implementationSketch: string;
  icon: string;
}

export interface ScanResult {
  url: string;
  businessName: string;
  industry: string;
  pagesAnalysed: number;
  opportunities: AIOpportunity[];
  topRecommendation: AIOpportunity | null;
  summary: string;
}

export type ScanStage =
  | "initialising"
  | "discovering"
  | "fetching"
  | "analysing"
  | "generating"
  | "complete"
  | "error";

export interface ScanProgress {
  stage: ScanStage;
  message: string;
  detail?: string;
  progress?: number; // 0-100
  data?: Partial<ScanResult>;
}
