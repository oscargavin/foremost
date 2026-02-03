// Types for AI Use Case Explorer

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface ExplorerInput {
  companyUrl: string;
  companyName?: string;
  industry?: string;
}

// ============================================================================
// COMPANY DATA
// ============================================================================

export interface CompetitorInsight {
  name: string;
  strategicFocus: string;
  relevance: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface CompanyData {
  companyName: string;
  url: string;
  industry: string;
  description: string;
  keyThemes: string[];
  recentInitiatives: string[];
  competitors?: CompetitorInsight[];
  sources?: GroundingSource[];
  isGrounded?: boolean;
}

// ============================================================================
// STRATEGIC INFERENCE
// ============================================================================

export interface EvidencePoint {
  point: string;
  source: string;
  url?: string;
  date?: string;
}

export interface StrategicPriority {
  priority: string;
  rationale?: string;
  confidence: "high" | "medium" | "low";
  evidence: EvidencePoint[];
}

export interface StrategicInferenceResult {
  priorities: StrategicPriority[];
  disclaimer: string;
}

// ============================================================================
// TWO PATHS (USE CASES)
// ============================================================================

export type UseCasePath = "reimagination" | "efficiency";

export type RiskRating = "low" | "medium" | "high";

export interface RiskAssessment {
  rating: RiskRating;
  justification: string;
  implementationRisks: string[];
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  path: UseCasePath;
  relevanceScore: number;
  timeframe?: string;
  impact?: string;
  tags: string[];
  strategicRationale: string;
  advantages: string[];
  risks: string[];
  uncertainties: string[];
  tradeoffs: string[];
  riskAssessment: RiskAssessment;
}

export interface TwoPathsResult {
  reimagination: UseCase[];
  efficiency: UseCase[];
}

// ============================================================================
// MARKET SIGNALS
// ============================================================================

export interface MarketSignal {
  company: string;
  country: string;
  industry: string;
  initiative: string;
  source: string;
  date: string;
}

export interface MarketSignalsResult {
  signals: MarketSignal[];
  disclaimer: string;
  sources?: GroundingSource[];
  isGrounded?: boolean;
}

// ============================================================================
// STREAMING TYPES
// ============================================================================

export type StreamEventType =
  | "stage_update"
  | "prompt_snippet"
  | "response_snippet"
  | "complete"
  | "error";

export interface StreamEvent {
  type: StreamEventType;
  stage?: string;
  stageDescription?: string;
  promptSnippet?: string;
  responseSnippet?: string;
  data?: unknown;
  error?: string;
  timestamp: number;
}

export const ANALYSIS_STAGES = {
  COMPANY_ANALYSIS: {
    name: "Company Analysis",
    description: "Analysing your company website to understand business context.",
  },
  STRATEGIC_INFERENCE: {
    name: "Strategic Inference",
    description: "Identifying strategic priorities based on public signals.",
  },
  USE_CASE_GENERATION: {
    name: "Use Case Generation",
    description: "Creating AI use cases aligned with your priorities.",
  },
  MARKET_INTELLIGENCE: {
    name: "Market Intelligence",
    description: "Researching competitor AI initiatives.",
  },
} as const;

// ============================================================================
// COMPLETE ANALYSIS RESULT
// ============================================================================

export interface AnalysisResult {
  input: ExplorerInput;
  companyData?: CompanyData;
  strategicInference: StrategicInferenceResult;
  twoPaths: TwoPathsResult;
  marketSignals?: MarketSignalsResult;
  generatedAt: string;
  analysisId: string;
}

// ============================================================================
// UI STATE
// ============================================================================

export type AnalysisStep = 1 | 2 | 3;

export interface ExplorerState {
  currentStep: AnalysisStep;
  isAnalysing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  streamEvents: StreamEvent[];
  selectedPriorities: StrategicPriority[];
}

// Helper to format SSE event
export function formatSSE(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}
