"use client";

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Rocket,
  Gauge,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Scale,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type {
  TwoPathsResult,
  UseCase,
  CompanyData,
  StrategicPriority,
  MarketSignalsResult,
  StreamEvent,
} from "@/lib/explorer/types";
import { ProgressiveLoading } from "./progressive-loading";

interface TwoPathsStepProps {
  data: TwoPathsResult;
  companyData?: CompanyData;
  selectedPriorities?: StrategicPriority[];
  marketSignals?: MarketSignalsResult;
  onBack: () => void;
  onComplete?: () => void;
  isAnalysing?: boolean;
  streamEvents?: StreamEvent[];
}

interface UseCaseCardProps {
  useCase: UseCase;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  pathType: "reimagination" | "efficiency";
  prefersReducedMotion: boolean | null;
}

const riskConfig = {
  low: { label: "Low Risk", border: "border-border" },
  medium: { label: "Medium Risk", border: "border-border" },
  high: { label: "High Risk", border: "border-accent-orange/50" },
};

function UseCaseCard({ useCase, index, isExpanded, onToggle, pathType, prefersReducedMotion }: UseCaseCardProps) {
  const risk = useCase.riskAssessment?.rating || "medium";
  const riskStyle = riskConfig[risk];
  const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];

  return (
    <m.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08, ease }}
      className="group"
    >
      <div
        className={cn(
          "relative bg-background-card rounded-md overflow-hidden",
          "border",
          isExpanded ? "border-accent-orange" : "border-border hover:border-border-secondary"
        )}
      >
        {/* Header - touch-friendly with min-height for mobile */}
        <button
          onClick={onToggle}
          className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 sm:gap-4 cursor-pointer min-h-[88px]"
        >
          <div className="flex-1 min-w-0">
            {/* Tags row - wrap on small screens */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
              {/* Path indicator */}
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded border border-border text-foreground-subtle">
                {pathType === "reimagination" ? "Transform" : "Optimise"}
              </span>
              {/* Risk indicator */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase rounded border",
                  risk === "high" ? "border-accent-orange/50 text-accent-orange" : "border-border text-foreground-subtle"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    risk === "low" ? "bg-foreground-subtle" : risk === "medium" ? "bg-foreground-muted" : "bg-accent-orange"
                  )}
                />
                {riskStyle.label}
              </span>
            </div>

            {/* Title */}
            <h4
              className={cn(
                "text-base font-normal text-foreground",
                isExpanded && "text-accent-orange"
              )}
            >
              {useCase.title}
            </h4>

            {/* Description */}
            <p className="text-sm text-foreground-muted mt-1.5 leading-relaxed line-clamp-2 font-mono">
              {useCase.description}
            </p>
          </div>

          {/* Expand icon - larger touch target on mobile */}
          <m.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: "transform" }}
            className={cn(
              "flex-shrink-0 w-10 h-10 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center",
              isExpanded
                ? "border-accent-orange text-accent-orange"
                : "border-border text-foreground-subtle group-hover:border-border-secondary group-hover:text-foreground"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </m.div>
        </button>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 sm:space-y-4">
                {/* Strategic Rationale */}
                <div className="rounded-md p-4 border border-accent-orange/20 bg-accent-orange/5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-accent-orange mb-2">
                    Strategic Rationale
                  </p>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {useCase.strategicRationale}
                  </p>
                </div>

                {/* Analysis grid - single column on mobile, 2 cols on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Advantages */}
                  <div className="bg-surface-subtle rounded-md p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-foreground-muted" />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle">
                        Advantages
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {useCase.advantages?.map((item, i) => (
                        <li key={i} className="text-sm text-foreground-muted flex items-start gap-2">
                          <span className="text-accent-orange mt-1.5 text-[8px]">●</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="bg-surface-subtle rounded-md p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-foreground-muted" />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle">
                        Risks
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {useCase.risks?.map((item, i) => (
                        <li key={i} className="text-sm text-foreground-muted flex items-start gap-2">
                          <span className="text-accent-orange mt-1.5 text-[8px]">●</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Uncertainties */}
                  <div className="bg-surface-subtle rounded-md p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-4 h-4 text-foreground-muted" />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle">
                        Uncertainties
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {useCase.uncertainties?.map((item, i) => (
                        <li key={i} className="text-sm text-foreground-muted flex items-start gap-2">
                          <span className="text-accent-orange mt-1.5 text-[8px]">●</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tradeoffs */}
                  <div className="bg-surface-subtle rounded-md p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-4 h-4 text-foreground-muted" />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle">
                        Tradeoffs
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {useCase.tradeoffs?.map((item, i) => (
                        <li key={i} className="text-sm text-foreground-muted flex items-start gap-2">
                          <span className="text-accent-orange mt-1.5 text-[8px]">●</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Implementation Assessment */}
                {useCase.riskAssessment?.justification && (
                  <div className="bg-surface-subtle rounded-md p-4 border border-border">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle mb-2">
                      Implementation Assessment
                    </p>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {useCase.riskAssessment.justification}
                    </p>
                  </div>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
}

export function TwoPathsStep({
  data,
  companyData,
  selectedPriorities,
  marketSignals,
  onBack,
  onComplete,
  isAnalysing = false,
  streamEvents = [],
}: TwoPathsStepProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const prefersReducedMotion = useReducedMotion();
  const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  if (isAnalysing && streamEvents.length > 0) {
    return (
      <div className="flex flex-col justify-center min-h-[280px] sm:min-h-[300px]">
        <div className="w-full max-w-xl mx-auto">
          <ProgressiveLoading isAnalysing={isAnalysing} streamEvents={streamEvents} />
        </div>
      </div>
    );
  }

  const totalOpportunities = (data?.reimagination?.length || 0) + (data?.efficiency?.length || 0);

  return (
    <m.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease }}
    >
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 px-2">
        <m.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.1, ease }}
        >
          {/* Section label with orange dot indicator */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <span className="w-2 h-2 bg-accent-orange rounded-full" />
            <span className="text-[10px] sm:text-xs font-mono text-foreground-subtle uppercase tracking-wider">
              {totalOpportunities} Opportunities Identified
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-foreground tracking-tight mb-2 sm:mb-3">
            Your AI Opportunities
          </h2>
          <p className="text-sm sm:text-base text-foreground-muted max-w-xl mx-auto leading-relaxed font-mono">
            Based on your strategic priorities, we&apos;ve identified two paths to AI value.
            Tap each opportunity to explore the full analysis.
          </p>
        </m.div>
      </div>

      {/* Two Paths Grid - stack on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Path A: Reimagination */}
        <m.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.2, ease }}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="w-10 h-10 flex-shrink-0 rounded-md border border-border bg-background-card flex items-center justify-center">
              <Rocket className="w-5 h-5 text-accent-orange" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-normal text-foreground">Business Reimagination</h3>
              <p className="text-xs sm:text-sm text-foreground-subtle font-mono truncate">High ambition, strategic transformation</p>
            </div>
          </div>
          <div className="space-y-3">
            {data?.reimagination?.map((useCase, index) => (
              <UseCaseCard
                key={useCase.id}
                useCase={useCase}
                index={index}
                isExpanded={expandedCards.has(useCase.id)}
                onToggle={() => toggleCard(useCase.id)}
                pathType="reimagination"
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
            {(!data?.reimagination || data.reimagination.length === 0) && (
              <div className="bg-surface-subtle border border-border rounded-md p-8 text-center">
                <p className="text-foreground-muted text-sm font-mono">No reimagination opportunities identified.</p>
              </div>
            )}
          </div>
        </m.div>

        {/* Path B: Efficiency */}
        <m.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.3, ease }}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="w-10 h-10 flex-shrink-0 rounded-md border border-border bg-background-card flex items-center justify-center">
              <Gauge className="w-5 h-5 text-foreground-muted" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-normal text-foreground">Efficiency & Optimisation</h3>
              <p className="text-xs sm:text-sm text-foreground-subtle font-mono truncate">Quick wins, operational improvements</p>
            </div>
          </div>
          <div className="space-y-3">
            {data?.efficiency?.map((useCase, index) => (
              <UseCaseCard
                key={useCase.id}
                useCase={useCase}
                index={index}
                isExpanded={expandedCards.has(useCase.id)}
                onToggle={() => toggleCard(useCase.id)}
                pathType="efficiency"
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
            {(!data?.efficiency || data.efficiency.length === 0) && (
              <div className="bg-surface-subtle border border-border rounded-md p-8 text-center">
                <p className="text-foreground-muted text-sm font-mono">No efficiency opportunities identified.</p>
              </div>
            )}
          </div>
        </m.div>
      </div>

      {/* CTA Section - dark card style like Factory.ai */}
      <m.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.4, ease }}
        className="rounded-xl sm:rounded-2xl bg-background-dark p-6 sm:p-8 md:p-10"
      >
        <div className="max-w-2xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-foreground-light mb-2 sm:mb-3 tracking-tight">
            Ready to explore these opportunities?
          </h3>
          <p className="text-sm sm:text-base text-foreground-light-muted mb-6 sm:mb-8 leading-relaxed font-mono">
            Let&apos;s discuss how Foremost can help you implement these AI initiatives,
            from strategy through to deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-background text-foreground min-h-12 px-6 py-3 rounded-md font-normal border border-border-secondary hover:bg-surface-subtle transition-colors duration-200 cursor-pointer"
            >
              Schedule a Discussion
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 border border-border-darker text-foreground-light min-h-12 px-6 py-3 rounded-md font-normal hover:bg-white/5 transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Adjust Priorities
            </button>
          </div>
        </div>
      </m.div>

      {/* Back link */}
      <div className="flex items-center justify-start pt-6 sm:pt-8">
        <button
          onClick={onBack}
          className="min-h-11 text-foreground-muted hover:text-foreground transition-colors duration-200 flex items-center gap-2 text-sm cursor-pointer px-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to priorities
        </button>
      </div>
    </m.div>
  );
}
