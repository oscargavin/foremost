"use client";

import { useReducer, useCallback, useEffect, useRef, useId, memo, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Zap,
  Target,
  BarChart,
  FileText,
  Search,
  Loader2,
} from "lucide-react";
import type { ScanResult, AIOpportunity } from "@/lib/scanner/types";
import { sendScanReport } from "@/app/actions/send-scan-report";
import {
  scannerReducer,
  initialScannerState,
  type ScannerState,
} from "./scanner-reducer";

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  Zap,
  Target,
  Search,
  BarChart,
  FileText,
  Sparkles,
};

// Minimal progress indicator - Foremost style
function ScanningProgress({ isActive, progress }: { isActive: boolean; progress: number }) {
  return (
    <div
      className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Scanning progress: ${progress}%`}
    >
      {/* Single clean progress ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-foreground/[0.08]"
        />
        {/* Progress arc - orange accent */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${progress * 2.76} 276`}
          className="text-accent-orange transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl sm:text-5xl font-light text-foreground tabular-nums tracking-tight">
          {progress}
        </span>
      </div>
    </div>
  );
}

// Stage timeline - simple dots
function ScanTimeline({ currentStage, stages }: { currentStage: string; stages: string[] }) {
  const stageIndex = stages.indexOf(currentStage);

  return (
    <nav aria-label="Scan progress stages" className="mt-8 sm:mt-10">
      <ol className="flex items-center justify-center gap-2">
        {stages.map((stage, i) => {
          const isComplete = i < stageIndex;
          const isCurrent = i === stageIndex;

          return (
            <li key={stage} className="flex items-center">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  isComplete && "bg-accent-orange",
                  isCurrent && "bg-accent-orange scale-150",
                  !isComplete && !isCurrent && "bg-foreground/10"
                )}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={stage}
              />
              {i < stages.length - 1 && (
                <div
                  className={cn(
                    "w-8 sm:w-12 h-px mx-1",
                    isComplete ? "bg-accent-orange/50" : "bg-foreground/[0.06]"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Opportunity card with Foremost styling
function OpportunityCard({ opportunity, index }: { opportunity: AIOpportunity; index: number }) {
  const Icon = iconMap[opportunity.icon] || Sparkles;
  const [isVisible, setIsVisible] = useState(false);
  const cardId = useId();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReducedMotion ? 10 : index * 100 + 10;
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [index]);

  const effortLabels = ["Trivial", "Low", "Medium", "High", "Complex"];
  const effortLabel = effortLabels[opportunity.complexity - 1] || "Unknown";

  return (
    <article
      aria-labelledby={`${cardId}-title`}
      className={cn(
        "group relative",
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div
        className={cn(
          "relative h-full p-5 sm:p-6 rounded-lg",
          "bg-background-card border border-border",
          "transition-all duration-200",
          "hover:border-border-secondary"
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <Icon className="w-5 h-5 text-accent-orange" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle block mb-0.5">
              {opportunity.category}
            </span>
            <h3
              id={`${cardId}-title`}
              className="text-base font-normal text-foreground leading-snug"
            >
              {opportunity.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground-muted leading-relaxed mb-5">
          {opportunity.description}
        </p>

        {/* Metrics */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-foreground-subtle font-mono">Impact</span>
              <span className="text-foreground font-medium">{opportunity.impact}/5</span>
            </div>
            <div
              className="h-1 bg-foreground/[0.06] rounded-full overflow-hidden"
              role="meter"
              aria-valuenow={opportunity.impact}
              aria-valuemin={1}
              aria-valuemax={5}
              aria-label={`Impact: ${opportunity.impact}/5`}
            >
              <div
                className="h-full bg-accent-orange rounded-full transition-all duration-500"
                style={{ width: `${opportunity.impact * 20}%` }}
              />
            </div>
          </div>

          <div className="w-px h-6 bg-border" aria-hidden="true" />

          <div className="text-right">
            <span className="text-[11px] text-foreground-subtle font-mono block">Effort</span>
            <span className="text-xs text-foreground-muted">{effortLabel}</span>
          </div>
        </div>

        {/* Pain points */}
        {opportunity.painPointsSolved.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <ul className="space-y-1.5" aria-label="Problems solved">
              {opportunity.painPointsSolved.slice(0, 2).map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-foreground-muted"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

// Email capture gate component
function EmailCapture({
  result,
  onUnlock,
}: {
  result: ScanResult;
  onUnlock: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formId = useId();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);
    setError(null);

    const response = await sendScanReport({
      result,
      email: email.trim(),
      name: name.trim() || undefined,
    });

    setIsSending(false);

    if (response.error) {
      setError(response.error);
      // Focus back to email input on error
      emailInputRef.current?.focus();
    } else {
      onUnlock();
    }
  };

  return (
    <div className="text-center px-2 sm:px-0">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h3 className="text-2xl sm:text-3xl font-normal text-foreground mb-2 tracking-tight">
          We found{" "}
          <span className="text-accent-orange">{result.opportunities.length} opportunities</span>
        </h3>
        <p className="text-base text-foreground-muted">
          for {result.businessName}
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-foreground-subtle font-mono">
          <span>{result.industry}</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" aria-hidden="true" />
          <span>{result.pagesAnalysed} pages</span>
        </div>
      </div>

      {/* Email capture form */}
      <div className="max-w-sm mx-auto">
        <div className="p-6 rounded-lg bg-background-card border border-border">
          <h4 className="text-base font-normal text-foreground mb-1">
            Get your full report
          </h4>
          <p className="text-sm text-foreground-muted mb-5">
            We&apos;ll email you the complete analysis.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3" aria-describedby={`${formId}-privacy`}>
            <div>
              <label htmlFor={`${formId}-name`} className="sr-only">
                Your name (optional)
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                autoComplete="name"
                className={cn(
                  "w-full px-3 py-2.5 rounded-md",
                  "bg-background border border-border",
                  "text-sm text-foreground placeholder:text-foreground-subtle",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange/20 focus-visible:border-accent-orange/40",
                  "transition-colors"
                )}
              />
            </div>

            <div>
              <label htmlFor={`${formId}-email`} className="sr-only">
                Email address
              </label>
              <input
                ref={emailInputRef}
                id={`${formId}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${formId}-error` : undefined}
                className={cn(
                  "w-full px-3 py-2.5 rounded-md",
                  "bg-background border",
                  error ? "border-red-500/50" : "border-border",
                  "text-sm text-foreground placeholder:text-foreground-subtle",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange/20 focus-visible:border-accent-orange/40",
                  "transition-colors"
                )}
              />
            </div>

            {error && (
              <p
                id={`${formId}-error`}
                role="alert"
                className="text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSending || !email.trim()}
              className={cn(
                "w-full bg-background-button text-foreground-light",
                "py-2.5 rounded-md text-sm font-medium",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "enabled:hover:bg-foreground/90",
                "transition-colors cursor-pointer",
                "flex items-center justify-center gap-2"
              )}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Report</span>
              )}
            </button>
          </form>

          <p id={`${formId}-privacy`} className="text-[11px] text-foreground-subtle mt-3 font-mono">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

// Full results display (shown after email capture)
function FullResults({ result }: { result: ScanResult }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setShowContent(true), prefersReducedMotion ? 10 : 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "transition-opacity duration-300 px-2 sm:px-0",
        showContent ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Header */}
      <header className="text-center mb-8 sm:mb-10">
        <p className="text-sm text-green-600 font-mono mb-3">Report sent to your email</p>
        <h3 className="text-2xl sm:text-3xl font-normal text-foreground mb-2 tracking-tight">
          {result.businessName}
        </h3>
        <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted font-mono">
          <span>{result.industry}</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" aria-hidden="true" />
          <span>{result.pagesAnalysed} pages</span>
        </div>
      </header>

      {/* Summary */}
      <section className="max-w-2xl mx-auto mb-10" aria-labelledby="summary-heading">
        <h4 id="summary-heading" className="sr-only">Analysis Summary</h4>
        <p className="text-base sm:text-lg text-foreground-muted leading-relaxed text-center">
          {result.summary}
        </p>
      </section>

      {/* Opportunities */}
      <section className="mb-10" aria-labelledby="opportunities-heading">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-accent-orange/50" aria-hidden="true" />
          <h4
            id="opportunities-heading"
            className="text-[11px] font-mono uppercase tracking-widest text-foreground-subtle"
          >
            {result.opportunities.length} Opportunities
          </h4>
        </div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.opportunities.map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <footer className="text-center pt-6 border-t border-border">
        <p className="text-sm text-foreground-muted mb-4">
          Ready to discuss these opportunities?
        </p>
        <Link
          href="/contact"
          className={cn(
            "group inline-flex items-center gap-2",
            "bg-background-button text-foreground-light",
            "px-6 py-3 rounded-md text-sm font-medium",
            "hover:bg-foreground/90",
            "transition-colors cursor-pointer"
          )}
        >
          <span>Schedule a Discussion</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}

// Results wrapper - handles email gate flow
interface ScanResultsWithUnlockProps {
  result: ScanResult;
  unlocked: boolean;
  onUnlock: () => void;
}

function ScanResultsWithUnlock({ result, unlocked, onUnlock }: ScanResultsWithUnlockProps) {
  if (!unlocked) {
    return <EmailCapture result={result} onUnlock={onUnlock} />;
  }

  return <FullResults result={result} />;
}

const SCAN_STAGES = ["initialising", "discovering", "fetching", "analysing", "generating"] as const;

export function AIScanner() {
  const [state, dispatch] = useReducer(scannerReducer, initialScannerState);
  const inputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  // Derive current view from state
  const currentView = state.view;

  const handleScan = useCallback(async () => {
    if (state.view !== "input" || !state.url.trim()) return;

    let targetUrl = state.url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    dispatch({ type: "START_SCAN" });

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || err.error || "Scan failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              dispatch({ type: "UPDATE_PROGRESS", progress: data });

              if (data.stage === "complete" && data.data) {
                dispatch({ type: "SCAN_COMPLETE", result: data.data as ScanResult });
              } else if (data.stage === "error") {
                dispatch({ type: "SCAN_ERROR", error: data.detail || "An error occurred" });
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      dispatch({
        type: "SCAN_ERROR",
        error: err instanceof Error ? err.message : "An error occurred"
      });
    }
  }, [state]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && state.view === "input") {
        handleScan();
      }
    },
    [handleScan, state.view]
  );

  const handleUnlock = useCallback(() => {
    dispatch({ type: "UNLOCK_RESULTS" });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  return (
    <div className="relative">
      {/*
        Fixed-height container for input/scanning views to prevent layout shift.
        Results view is allowed to expand beyond this.
      */}
      <div
        className={cn(
          "relative",
          // Only apply min-height when not showing results (results can be taller)
          currentView !== "results" && "min-h-[420px] sm:min-h-[460px]"
        )}
      >
        {/* Input view */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            currentView === "input"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
          )}
        >
          {/* Header */}
          <header className="text-center mb-10 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-5" aria-hidden="true">
              <div className="w-8 h-px bg-accent-orange/40" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-subtle">
                Free Analysis
              </span>
              <div className="w-8 h-px bg-accent-orange/40" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-foreground mb-4 tracking-tight leading-[1.1]">
              Discover your{" "}
              <span className="text-accent-orange">AI</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              opportunities
            </h2>

            <p className="text-base text-foreground-muted max-w-md mx-auto leading-relaxed px-4 sm:px-0">
              Enter your website and we&apos;ll show you where AI can help.
            </p>
          </header>

          {/* Input area */}
          <div className="max-w-lg mx-auto px-2 sm:px-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleScan();
              }}
            >
              <label htmlFor={`${formId}-url`} className="sr-only">
                Website URL
              </label>

              <div
                className={cn(
                  "bg-background-card border border-border rounded-lg p-1.5",
                  "transition-colors",
                  "focus-within:border-border-secondary"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 flex-1">
                    <Globe
                      className="w-5 h-5 text-foreground-subtle flex-shrink-0"
                      aria-hidden="true"
                    />
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
                      className={cn(
                        "flex-1 bg-transparent border-none min-w-0",
                        "text-base text-foreground",
                        "placeholder:text-foreground-subtle",
                        "focus:outline-none"
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state.view !== "input" || !state.url.trim()}
                    className={cn(
                      "bg-background-button text-foreground-light",
                      "w-full sm:w-auto px-5 py-2.5 rounded-md",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "enabled:hover:bg-foreground/90",
                      "transition-colors cursor-pointer",
                      "text-sm font-medium",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    <span>Analyse</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </form>

            <p className="text-center mt-4 text-xs text-foreground-subtle font-mono">
              ~30 seconds · No signup · Free
            </p>
          </div>
        </div>

        {/* Scanning view */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            currentView === "scanning"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
          )}
          role="status"
          aria-live="polite"
          aria-busy={currentView === "scanning"}
        >
          <div className="text-center px-2">
            <ScanningProgress
              isActive={currentView === "scanning"}
              progress={state.view === "scanning" ? (state.progress.progress ?? 0) : 0}
            />

            <p className="mt-6 text-lg text-foreground">
              {state.view === "scanning" ? state.progress.message : "Initialising…"}
            </p>

            {state.view === "scanning" && state.progress.detail && (
              <p className="mt-2 text-sm text-foreground-subtle font-mono truncate max-w-sm mx-auto">
                {state.progress.detail}
              </p>
            )}

            <ScanTimeline
              currentStage={state.view === "scanning" ? state.progress.stage : "initialising"}
              stages={[...SCAN_STAGES]}
            />
          </div>
        </div>

        {/* Error view */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            currentView === "error"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
          )}
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-sm mx-auto text-center px-4">
            <div
              className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>

            <h3 className="text-lg font-normal text-foreground mb-2">
              Analysis failed
            </h3>

            <p className="text-sm text-foreground-muted mb-6">
              {state.view === "error" ? state.error : "An error occurred"}
            </p>

            <button
              onClick={handleReset}
              className={cn(
                "inline-flex items-center gap-2",
                "px-5 py-2.5 rounded-md",
                "bg-background-button text-foreground-light",
                "hover:bg-foreground/90",
                "transition-colors cursor-pointer",
                "text-sm font-medium"
              )}
            >
              <span>Try again</span>
            </button>
          </div>
        </div>

        {/* Results view */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            currentView === "results"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
          )}
        >
          {state.view === "results" && (
            <ScanResultsWithUnlock
              result={state.result}
              unlocked={state.unlocked}
              onUnlock={handleUnlock}
            />
          )}

          {/* Reset button */}
          {state.view === "results" && (
            <div className="text-center mt-10">
              <button
                onClick={handleReset}
                className="text-sm text-foreground-muted hover:text-foreground font-mono transition-colors cursor-pointer"
              >
                ← Scan another website
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
