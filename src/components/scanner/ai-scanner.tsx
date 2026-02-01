"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  Mail,
  Send,
  Loader2,
  Lock,
} from "lucide-react";
import type { ScanProgress, ScanResult, AIOpportunity } from "@/lib/scanner/types";
import { sendScanReport } from "@/app/actions/send-scan-report";

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
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
      {/* Single clean progress ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground/[0.06]"
        />
        {/* Progress arc - orange accent */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`${progress * 2.89} 289`}
          className="text-accent-orange transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "flex flex-col items-center justify-center",
            "transition-all duration-700",
            isActive && "animate-pulse"
          )}
        >
          <span className="text-2xl sm:text-3xl font-normal text-foreground tabular-nums">
            {progress}
          </span>
          <span className="text-[10px] sm:text-xs text-foreground-muted font-mono tracking-wider">
            percent
          </span>
        </div>
      </div>
    </div>
  );
}

// Stage timeline
function ScanTimeline({ currentStage, stages }: { currentStage: string; stages: string[] }) {
  const stageIndex = stages.indexOf(currentStage);

  return (
    <div className="flex items-center justify-center gap-0.5 sm:gap-1 mt-6 sm:mt-8">
      {stages.map((stage, i) => (
        <div key={stage} className="flex items-center">
          <div
            className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500",
              i < stageIndex && "bg-accent-orange",
              i === stageIndex && "bg-accent-orange w-4 sm:w-6 animate-pulse",
              i > stageIndex && "bg-foreground/10"
            )}
          />
          {i < stages.length - 1 && (
            <div
              className={cn(
                "w-4 sm:w-8 h-px mx-0.5 sm:mx-1 transition-all duration-500",
                i < stageIndex ? "bg-accent-orange" : "bg-foreground/10"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Opportunity card with Foremost styling
function OpportunityCard({ opportunity, index }: { opportunity: AIOpportunity; index: number }) {
  const Icon = iconMap[opportunity.icon] || Sparkles;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={cn(
        "group relative",
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Card */}
      <div
        className={cn(
          "relative h-full p-4 sm:p-6 rounded-lg",
          "bg-background-card",
          "border border-border",
          "transition-all duration-300",
          "hover:border-foreground-secondary hover:-translate-y-0.5"
        )}
      >
        {/* Impact indicator - top right corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 overflow-hidden rounded-tr-lg">
          <div
            className={cn(
              "absolute -top-8 -right-8 sm:-top-12 sm:-right-12 w-16 h-16 sm:w-24 sm:h-24 rotate-45",
              "bg-gradient-to-br",
              opportunity.impact >= 4 ? "from-accent-orange/20 to-transparent" : "from-foreground/5 to-transparent"
            )}
          />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              "bg-accent-orange/10",
              "border border-accent-orange/20"
            )}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-orange" />
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-muted">
              {opportunity.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base sm:text-lg font-normal text-foreground mb-1.5 sm:mb-2 leading-tight">
          {opportunity.title}
        </h4>

        {/* Description */}
        <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed mb-4 sm:mb-6">
          {opportunity.description}
        </p>

        {/* Metrics bar */}
        <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1 sm:mb-1.5">
              <span className="text-foreground-muted font-mono">IMPACT</span>
              <span className="text-accent-orange font-medium">{opportunity.impact}/5</span>
            </div>
            <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-orange rounded-full transition-all duration-1000"
                style={{ width: `${opportunity.impact * 20}%` }}
              />
            </div>
          </div>

          <div className="w-px h-6 sm:h-8 bg-border" />

          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] text-foreground-muted font-mono block">EFFORT</span>
            <span className="text-[10px] sm:text-xs text-foreground-subtle">
              {["Trivial", "Low", "Medium", "High", "Complex"][opportunity.complexity - 1]}
            </span>
          </div>
        </div>

        {/* Pain points solved */}
        {opportunity.painPointsSolved.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground-subtle block mb-1.5 sm:mb-2">
              Problems Solved
            </span>
            <ul className="space-y-1.5 sm:space-y-2">
              {opportunity.painPointsSolved.slice(0, 2).map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-foreground-muted leading-relaxed"
                >
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
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
    } else {
      onUnlock();
    }
  };

  return (
    <div className="text-center px-2 sm:px-0">
      {/* Teaser - show what they'll get */}
      <div className="mb-6 sm:mb-8">
        <div className="relative inline-block mb-4 sm:mb-6">
          <div className="absolute inset-0 rounded-full bg-accent-orange/20 animate-pulse" />
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent-orange/10 border border-accent-orange/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-accent-orange" />
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-foreground mb-2 tracking-tight leading-tight">
          We found {result.opportunities.length} opportunities for{" "}
          <span className="text-accent-orange block sm:inline">{result.businessName}</span>
        </h3>

        <p className="text-sm sm:text-base text-foreground-muted max-w-md mx-auto font-mono">
          {result.industry} · {result.pagesAnalysed} pages analysed
        </p>
      </div>

      {/* Preview cards - blurred/teaser - hide on mobile */}
      <div className="relative mb-6 sm:mb-8 hidden sm:block">
        <div className="grid gap-4 md:grid-cols-3 opacity-40 blur-[2px] pointer-events-none">
          {result.opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 sm:p-6 rounded-lg bg-background-card border border-border"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent-orange/10 mb-3 sm:mb-4" />
              <div className="h-4 sm:h-5 w-3/4 bg-foreground/10 rounded mb-2" />
              <div className="h-2.5 sm:h-3 w-full bg-foreground/5 rounded mb-1" />
              <div className="h-2.5 sm:h-3 w-2/3 bg-foreground/5 rounded" />
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-foreground/20" />
        </div>
      </div>

      {/* Email capture form */}
      <div className="max-w-md mx-auto">
        <div className="relative p-5 sm:p-8 rounded-lg bg-background-card border border-border">
          <div className="relative">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent-orange mx-auto mb-3 sm:mb-4" />
            <h4 className="text-base sm:text-lg font-normal text-foreground mb-1.5 sm:mb-2">
              Get Your Full Report
            </h4>
            <p className="text-xs sm:text-sm text-foreground-muted mb-4 sm:mb-6">
              Enter your email to unlock all opportunities.
            </p>

            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className={cn(
                  "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg",
                  "bg-background border border-border",
                  "text-sm sm:text-base text-foreground placeholder:text-foreground-subtle",
                  "focus:outline-none focus:ring-2 focus:ring-accent-orange/30",
                  "transition-colors"
                )}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={cn(
                  "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg",
                  "bg-background border border-border",
                  "text-sm sm:text-base text-foreground placeholder:text-foreground-subtle",
                  "focus:outline-none focus:ring-2 focus:ring-accent-orange/30",
                  "transition-colors"
                )}
              />

              {error && (
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSending || !email.trim()}
                className={cn(
                  "w-full bg-background-button hover:bg-background-button/90 text-foreground-light",
                  "py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200 active:scale-[0.98]",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Unlock Report
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] sm:text-xs text-foreground-subtle mt-3 sm:mt-4 font-mono">
              No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full results display (shown after email capture)
function FullResults({ result }: { result: ScanResult }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-700 px-2 sm:px-0",
        showContent ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Success header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="relative inline-block mb-4 sm:mb-6">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-foreground mb-2 tracking-tight">
          {result.businessName}
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground-muted font-mono">
          <span>{result.industry}</span>
          <span className="w-1 h-1 rounded-full bg-foreground/30" />
          <span>{result.pagesAnalysed} pages</span>
        </div>

        <p className="text-xs sm:text-sm text-green-600 mt-3 sm:mt-4 font-mono">
          Report sent to your email
        </p>
      </div>

      {/* Summary card */}
      <div className="relative max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="relative p-5 sm:p-8 rounded-lg bg-background-card border border-border">
          <Sparkles className="absolute top-4 right-4 sm:top-6 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 text-accent-orange/30" />
          <p className="text-sm sm:text-lg text-foreground/80 leading-relaxed font-normal">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Opportunities */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
          <div className="w-8 sm:w-12 h-px bg-accent-orange" />
          <h4 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-foreground-muted">
            Opportunities
          </h4>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.opportunities.map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm sm:text-base text-foreground-muted mb-4 sm:mb-6 font-mono">
          Ready to discuss these?
        </p>
        <Link
          href="/contact"
          className={cn(
            "group inline-flex items-center gap-2",
            "bg-background-button hover:bg-background-button/90 text-foreground-light",
            "px-6 sm:px-8 py-4 rounded-lg text-sm sm:text-base font-medium",
            "transition-all duration-200 active:scale-[0.98]"
          )}
        >
          Discuss with an Advisor
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

// Results wrapper - handles email gate flow
function ScanResults({ result }: { result: ScanResult }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return <EmailCapture result={result} onUnlock={() => setIsUnlocked(true)} />;
  }

  return <FullResults result={result} />;
}

type ViewState = "input" | "scanning" | "error" | "results";

export function AIScanner() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stages = ["initialising", "discovering", "fetching", "analysing", "generating"];

  // Determine current view for transitions
  const currentView: ViewState = result
    ? "results"
    : error && !isScanning
    ? "error"
    : isScanning
    ? "scanning"
    : "input";

  const handleScan = useCallback(async () => {
    if (!url.trim()) return;

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    setIsScanning(true);
    setProgress(null);
    setResult(null);
    setError(null);

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
              const data = JSON.parse(line.slice(6)) as ScanProgress;
              setProgress(data);

              if (data.stage === "complete" && data.data) {
                setResult(data.data as ScanResult);
              } else if (data.stage === "error") {
                setError(data.detail || "An error occurred");
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsScanning(false);
    }
  }, [url]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isScanning) {
        handleScan();
      }
    },
    [handleScan, isScanning]
  );

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
          <div className="text-center mb-10 sm:mb-16">
            {/* Minimal accent - just a line, not a badge */}
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
              <div className="w-8 sm:w-12 h-px bg-accent-orange/40" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-foreground-muted">
                Free Analysis
              </span>
              <div className="w-8 sm:w-12 h-px bg-accent-orange/40" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-foreground mb-4 sm:mb-6 tracking-tight leading-[1.1]">
              Discover your{" "}
              <span className="text-accent-orange">AI</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              opportunities
            </h2>

            <p className="text-base sm:text-lg text-foreground-muted max-w-md mx-auto font-mono leading-relaxed px-4 sm:px-0">
              We&apos;ll analyse your website and show you exactly where AI can transform your business.
            </p>
          </div>

          {/* Input area */}
          <div className="max-w-lg mx-auto px-1 sm:px-0">
            {/* Input container */}
            <div className="relative group">
              <div className="relative bg-background-card border border-border rounded-lg p-1.5 sm:p-2 group-focus-within:border-accent-orange/30 transition-colors">
                {/* Mobile: stacked layout */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 flex-1">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-foreground-subtle flex-shrink-0" />
                    <input
                      ref={inputRef}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="yourwebsite.com"
                      className={cn(
                        "flex-1 bg-transparent border-none outline-none min-w-0",
                        "text-base sm:text-lg font-normal text-foreground",
                        "placeholder:text-foreground-subtle"
                      )}
                    />
                  </div>
                  <button
                    onClick={handleScan}
                    disabled={!url.trim()}
                    className={cn(
                      "bg-background-button hover:bg-background-button/90 text-foreground-light",
                      "w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-2 rounded-md",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "transition-all duration-200 active:scale-[0.98]",
                      "text-sm sm:text-base font-medium",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    <span>Analyse</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Helper text - simplified */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 text-[10px] sm:text-xs text-foreground-subtle font-mono">
              <span>~30 seconds</span>
              <span className="text-foreground/20">·</span>
              <span>No signup</span>
              <span className="text-foreground/20">·</span>
              <span>100% free</span>
            </div>
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
        >
          <div className="text-center px-2">
            <ScanningProgress isActive={currentView === "scanning"} progress={progress?.progress || 0} />

            <div className="mt-8 sm:mt-10 space-y-2">
              <p className="text-lg sm:text-xl font-normal text-foreground tracking-tight">
                {progress?.message || "Initialising..."}
              </p>
              {progress?.detail && (
                <p className="text-xs sm:text-sm text-foreground-muted font-mono truncate max-w-sm mx-auto">
                  {progress.detail}
                </p>
              )}
            </div>

            <div className="mt-8 sm:mt-10">
              <ScanTimeline currentStage={progress?.stage || "initialising"} stages={stages} />
            </div>
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
        >
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-normal text-foreground mb-2">Analysis Failed</h3>
            <p className="text-foreground-muted mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setProgress(null);
              }}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-background-card transition-colors"
            >
              Try Again
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
          {result && <ScanResults result={result} />}

          {/* Reset button */}
          {result && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  setResult(null);
                  setProgress(null);
                  setUrl("");
                }}
                className="text-sm text-foreground-muted hover:text-foreground font-mono transition-colors"
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
