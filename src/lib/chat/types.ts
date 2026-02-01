// Chat Orchestrator Types

export type OrchestratorMode =
  | 'idle'        // Initial state - show quick actions
  | 'quote'       // 5-question flow -> summary -> contact
  | 'services'    // Service selector -> tailored questions -> contact
  | 'freeform';   // Open chat with Claude

export type ServiceSlug =
  | 'ai-strategy'
  | 'board-education'
  | 'readiness-assessment'
  | 'implementation-oversight'
  | 'vendor-evaluation'
  | 'risk-governance';

export interface QuickAction {
  id: OrchestratorMode | 'contact';
  icon: string;
  label: string;
  description: string;
}

export interface ServicePath {
  slug: ServiceSlug;
  title: string;
  questions: string[];
  context: string;
}

export interface ChatState {
  mode: OrchestratorMode;
  selectedService: ServiceSlug | null;
  questionIndex: number;
  isComplete: boolean;
}

// Message metadata for orchestrator
export interface OrchestratorMessageData {
  isInitializing?: boolean;
  mode?: OrchestratorMode;
  selectedService?: ServiceSlug;
  questionIndex?: number;
}
