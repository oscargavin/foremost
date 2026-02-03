"use client";

import { useReducer, useCallback, useRef, useId, useState, useEffect } from "react";
import { m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Globe, ArrowRight } from "lucide-react";
import type {
  StreamEvent,
  StrategicPriority,
  CompanyData,
  StrategicInferenceResult,
  TwoPathsResult,
  MarketSignalsResult,
  AnalysisStep,
} from "@/lib/explorer/types";
import { ProgressiveLoading } from "./progressive-loading";
import { StrategicInferenceStep } from "./strategic-inference-step";
import { TwoPathsStep } from "./two-paths-step";

// State management
interface ExplorerState {
  step: AnalysisStep;
  url: string;
  isAnalysing: boolean;
  streamEvents: StreamEvent[];
  companyData: CompanyData | null;
  strategicInference: StrategicInferenceResult | null;
  selectedPriorities: StrategicPriority[];
  twoPaths: TwoPathsResult | null;
  marketSignals: MarketSignalsResult | null;
  error: string | null;
}

type ExplorerAction =
  | { type: "SET_URL"; url: string }
  | { type: "START_ANALYSIS" }
  | { type: "ADD_STREAM_EVENT"; event: StreamEvent }
  | { type: "STEP1_COMPLETE"; companyData: CompanyData; strategicInference: StrategicInferenceResult }
  | { type: "SET_SELECTED_PRIORITIES"; priorities: StrategicPriority[] }
  | { type: "START_STEP2" }
  | { type: "STEP2_COMPLETE"; twoPaths: TwoPathsResult }
  | { type: "START_STEP3" }
  | { type: "STEP3_COMPLETE"; marketSignals: MarketSignalsResult }
  | { type: "SET_ERROR"; error: string }
  | { type: "GO_TO_STEP"; step: AnalysisStep }
  | { type: "RESET" };

const initialState: ExplorerState = {
  step: 1,
  url: "",
  isAnalysing: false,
  streamEvents: [],
  companyData: null,
  strategicInference: null,
  selectedPriorities: [],
  twoPaths: null,
  marketSignals: null,
  error: null,
};

function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
  switch (action.type) {
    case "SET_URL":
      return { ...state, url: action.url };
    case "START_ANALYSIS":
      return { ...state, isAnalysing: true, streamEvents: [], error: null };
    case "ADD_STREAM_EVENT":
      return { ...state, streamEvents: [...state.streamEvents, action.event] };
    case "STEP1_COMPLETE":
      return {
        ...state,
        isAnalysing: false,
        companyData: action.companyData,
        strategicInference: action.strategicInference,
        step: 2,
        streamEvents: [],
      };
    case "SET_SELECTED_PRIORITIES":
      return { ...state, selectedPriorities: action.priorities };
    case "START_STEP2":
      return { ...state, isAnalysing: true, streamEvents: [] };
    case "STEP2_COMPLETE":
      return {
        ...state,
        isAnalysing: false,
        twoPaths: action.twoPaths,
        step: 3,
        streamEvents: [],
      };
    case "START_STEP3":
      return { ...state, isAnalysing: true, streamEvents: [] };
    case "STEP3_COMPLETE":
      return {
        ...state,
        isAnalysing: false,
        marketSignals: action.marketSignals,
        streamEvents: [],
      };
    case "SET_ERROR":
      return { ...state, isAnalysing: false, error: action.error };
    case "GO_TO_STEP":
      return { ...state, step: action.step };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Helper to parse SSE stream
async function* parseSSEStream(response: Response): AsyncGenerator<StreamEvent> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) throw new Error("No response stream");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const event = JSON.parse(line.slice(6)) as StreamEvent;
          yield event;
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}

// Minimum heights for each step to prevent layout shift (mobile-first)
const STEP_MIN_HEIGHTS = {
  input: "min-h-[350px] sm:min-h-[400px]",
  loading: "min-h-[280px] sm:min-h-[300px]",
  priorities: "min-h-[500px] sm:min-h-[600px]",
  results: "min-h-[600px] sm:min-h-[800px]",
} as const;

export function AIExplorer() {
  const [state, dispatch] = useReducer(explorerReducer, initialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const prefersReducedMotion = useReducedMotion();

  // Animation config respecting reduced motion
  const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];
  const motionConfig = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? undefined : { opacity: 0, y: -20 },
    transition: { duration: prefersReducedMotion ? 0 : 0.4, ease },
  };

  // Step 1: Company Analysis + Strategic Inference
  const runStep1 = useCallback(async () => {
    if (!state.url.trim()) return;

    dispatch({ type: "START_ANALYSIS" });

    try {
      const response = await fetch("/api/explorer/step1-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyUrl: state.url.trim() }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: "Analysis failed" }));
        throw new Error(err.message || err.error || "Analysis failed");
      }

      for await (const event of parseSSEStream(response)) {
        dispatch({ type: "ADD_STREAM_EVENT", event });

        if (event.type === "complete" && event.data) {
          const data = event.data as {
            companyData: CompanyData;
            strategicInference: StrategicInferenceResult;
          };
          dispatch({
            type: "STEP1_COMPLETE",
            companyData: data.companyData,
            strategicInference: data.strategicInference,
          });
        } else if (event.type === "error") {
          dispatch({ type: "SET_ERROR", error: event.error || "Analysis failed" });
        }
      }
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }, [state.url]);

  // Step 2: Use Case Generation
  const runStep2 = useCallback(
    async (priorities: StrategicPriority[]) => {
      dispatch({ type: "SET_SELECTED_PRIORITIES", priorities });
      dispatch({ type: "START_STEP2" });

      try {
        const response = await fetch("/api/explorer/step2-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyData: state.companyData,
            strategicPriorities: priorities,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ message: "Use case generation failed" }));
          throw new Error(err.message || err.error || "Use case generation failed");
        }

        for await (const event of parseSSEStream(response)) {
          dispatch({ type: "ADD_STREAM_EVENT", event });

          if (event.type === "complete" && event.data) {
            const data = event.data as { twoPaths: TwoPathsResult };
            dispatch({ type: "STEP2_COMPLETE", twoPaths: data.twoPaths });

            // Automatically start step 3 (market intelligence)
            runStep3();
          } else if (event.type === "error") {
            dispatch({ type: "SET_ERROR", error: event.error || "Use case generation failed" });
          }
        }
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: err instanceof Error ? err.message : "An error occurred",
        });
      }
    },
    [state.companyData]
  );

  // Step 3: Market Intelligence (runs automatically after step 2)
  const runStep3 = useCallback(async () => {
    dispatch({ type: "START_STEP3" });

    try {
      const response = await fetch("/api/explorer/step3-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: state.companyData?.industry,
          companyName: state.companyData?.companyName,
          competitors: state.companyData?.competitors,
        }),
      });

      if (!response.ok) {
        // Don't fail the whole flow for market intelligence
        console.warn("Market intelligence failed");
        return;
      }

      for await (const event of parseSSEStream(response)) {
        if (event.type === "complete" && event.data) {
          const data = event.data as { marketSignals: MarketSignalsResult };
          dispatch({ type: "STEP3_COMPLETE", marketSignals: data.marketSignals });
        }
      }
    } catch (err) {
      // Don't fail the whole flow for market intelligence
      console.warn("Market intelligence error:", err);
    }
  }, [state.companyData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      runStep1();
    },
    [runStep1]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && state.step === 1 && !state.isAnalysing) {
        runStep1();
      }
    },
    [runStep1, state.step, state.isAnalysing]
  );

  const handleBackToInput = useCallback(() => {
    dispatch({ type: "RESET" });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleBackToPriorities = useCallback(() => {
    dispatch({ type: "GO_TO_STEP", step: 2 });
  }, []);

  // Input Step
  const renderInputStep = () => (
    <m.div
      initial={motionConfig.initial}
      animate={motionConfig.animate}
      exit={motionConfig.exit}
      transition={motionConfig.transition}
      className={cn(STEP_MIN_HEIGHTS.input, "flex flex-col justify-center py-8 sm:py-12")}
    >
      {/* Header */}
      <header className="text-center mb-8 sm:mb-10 md:mb-14 px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-4 sm:mb-5 tracking-tight leading-[1.1]">
          Explore your{" "}
          <span className="text-accent-orange">AI</span>
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          opportunities
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-foreground-muted max-w-lg mx-auto leading-relaxed">
          Enter your website and we&apos;ll identify strategic AI opportunities tailored to your business priorities.
        </p>
      </header>

      {/* Input area */}
      <div className="max-w-xl mx-auto px-2 sm:px-0">
        <form onSubmit={handleSubmit}>
          <label htmlFor={`${formId}-url`} className="sr-only">
            Website URL
          </label>

          <div
            className={cn(
              "bg-background-card border border-border rounded-lg p-2",
              "focus-within:border-accent-orange/50 focus-within:shadow-md focus-within:shadow-accent-orange/5"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-3 px-3 sm:px-4 py-3 flex-1">
                <Globe className="w-5 h-5 text-foreground-subtle flex-shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  id={`${formId}-url`}
                  type="url"
                  value={state.url}
                  onChange={(e) => dispatch({ type: "SET_URL", url: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="yourwebsite.com"
                  autoComplete="url"
                  spellCheck={false}
                  disabled={state.isAnalysing}
                  className={cn(
                    "flex-1 bg-transparent border-none min-w-0",
                    "text-base sm:text-lg text-foreground",
                    "placeholder:text-foreground-subtle",
                    "focus:outline-none",
                    "disabled:opacity-50"
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={state.isAnalysing || !state.url.trim()}
                className={cn(
                  "bg-background-button text-foreground-light",
                  "w-full sm:w-auto min-h-12 px-6 py-3 rounded-md",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  "enabled:hover:bg-[#1a1a1a]",
                  "transition-colors cursor-pointer",
                  "text-base font-medium",
                  "flex items-center justify-center gap-2"
                )}
              >
                <span>Analyse</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-5 sm:mt-6 text-xs sm:text-sm text-foreground-subtle font-mono">
          ~45 seconds · Multi-step analysis
        </p>
      </div>
    </m.div>
  );

  // Error display
  if (state.error) {
    return (
      <div className={cn(STEP_MIN_HEIGHTS.input, "flex flex-col justify-center max-w-lg mx-auto text-center px-4")}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">!</span>
        </div>
        <h2 className="text-base sm:text-lg font-normal text-foreground mb-2">Analysis failed</h2>
        <p className="text-sm text-foreground-muted mb-6">{state.error}</p>
        <button
          onClick={handleBackToInput}
          className="min-h-11 px-5 py-2.5 bg-background-button text-foreground-light rounded-md text-sm font-medium hover:bg-[#1a1a1a] transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  // Step 1: Input or analysing
  if (state.step === 1) {
    if (state.isAnalysing) {
      return (
        <div data-explorer-content className={cn(STEP_MIN_HEIGHTS.loading, "flex flex-col justify-center")}>
          <div className="w-full max-w-xl mx-auto">
            <ProgressiveLoading isAnalysing={state.isAnalysing} streamEvents={state.streamEvents} />
          </div>
        </div>
      );
    }
    return renderInputStep();
  }

  // Step 2: Strategic Inference
  if (state.step === 2 && state.strategicInference) {
    return (
      <div data-explorer-content className={STEP_MIN_HEIGHTS.priorities}>
        <StrategicInferenceStep
          data={state.strategicInference}
          companyData={state.companyData || undefined}
          onNext={runStep2}
          onBack={handleBackToInput}
          isAnalysing={state.isAnalysing}
          streamEvents={state.streamEvents}
          initialSelectedPriorities={state.selectedPriorities}
        />
      </div>
    );
  }

  // Step 3: Two Paths (use cases)
  if (state.step === 3 && state.twoPaths) {
    return (
      <div data-explorer-content className={STEP_MIN_HEIGHTS.results}>
        <TwoPathsStep
          data={state.twoPaths}
          companyData={state.companyData || undefined}
          selectedPriorities={state.selectedPriorities}
          marketSignals={state.marketSignals || undefined}
          onBack={handleBackToPriorities}
          isAnalysing={state.isAnalysing}
          streamEvents={state.streamEvents}
        />
      </div>
    );
  }

  // Fallback to input
  return renderInputStep();
}
