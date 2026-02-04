"use client";

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Pencil, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import type { StrategicInferenceResult, CompanyData, StrategicPriority, StreamEvent } from "@/lib/explorer/types";
import { ProgressiveLoading } from "./progressive-loading";

interface StrategicInferenceStepProps {
  data: StrategicInferenceResult;
  companyData?: CompanyData;
  onNext: (selectedPriorities: StrategicPriority[]) => void;
  onBack: () => void;
  isAnalysing?: boolean;
  streamEvents?: StreamEvent[];
  initialSelectedPriorities?: StrategicPriority[];
}

const confidenceColors = {
  high: "border-accent-orange text-accent-orange",
  medium: "border-border text-foreground-muted",
  low: "border-border text-foreground-subtle",
};

export function StrategicInferenceStep({
  data,
  companyData,
  onNext,
  onBack,
  isAnalysing = false,
  streamEvents = [],
  initialSelectedPriorities = [],
}: StrategicInferenceStepProps) {
  // Sort priorities by confidence
  const confidenceOrder = { high: 0, medium: 1, low: 2 };
  const sortedPriorities = [...(data?.priorities || [])].sort(
    (a, b) => confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
  );

  // Determine initial approved state
  const getInitialApproved = (): Set<number> => {
    if (initialSelectedPriorities.length > 0) {
      const approvedSet = new Set<number>();
      const storedPriorityTexts = new Set(initialSelectedPriorities.map((p) => p.priority));
      sortedPriorities.forEach((p, index) => {
        if (storedPriorityTexts.has(p.priority)) {
          approvedSet.add(index);
        }
      });
      return approvedSet;
    }
    return new Set(sortedPriorities.map((_, i) => i));
  };

  const getInitialCustomStrategies = (): string[] => {
    if (initialSelectedPriorities.length > 0) {
      return initialSelectedPriorities
        .filter((p) => p.rationale === "User-defined strategic priority")
        .map((p) => p.priority);
    }
    return [];
  };

  const [approvedPriorities, setApprovedPriorities] = useState<Set<number>>(getInitialApproved);
  const [rejectedPriorities, setRejectedPriorities] = useState<Set<number>>(new Set());
  const [customStrategies, setCustomStrategies] = useState<string[]>(getInitialCustomStrategies);
  const [showCustomInput, setShowCustomInput] = useState(getInitialCustomStrategies().length > 0);
  const [newCustomStrategy, setNewCustomStrategy] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedPriorities, setEditedPriorities] = useState<Map<number, string>>(new Map());
  const [editingCustomIndex, setEditingCustomIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Consistent easing
  const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];

  const handleThumbsUp = (index: number) => {
    const newApproved = new Set(approvedPriorities);
    const newRejected = new Set(rejectedPriorities);
    if (!approvedPriorities.has(index)) {
      newApproved.add(index);
      newRejected.delete(index);
    }
    setApprovedPriorities(newApproved);
    setRejectedPriorities(newRejected);
  };

  const handleThumbsDown = (index: number) => {
    const newApproved = new Set(approvedPriorities);
    const newRejected = new Set(rejectedPriorities);
    if (!rejectedPriorities.has(index)) {
      newRejected.add(index);
      newApproved.delete(index);
    }
    setApprovedPriorities(newApproved);
    setRejectedPriorities(newRejected);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    if (!editedPriorities.has(index)) {
      const newEdited = new Map(editedPriorities);
      newEdited.set(index, sortedPriorities[index].priority);
      setEditedPriorities(newEdited);
    }
  };

  const handleSaveEdit = (index: number, newText: string) => {
    const newEdited = new Map(editedPriorities);
    newEdited.set(index, newText.trim());
    setEditedPriorities(newEdited);
    setEditingIndex(null);
  };

  const handleNext = () => {
    const selectedPriorities: StrategicPriority[] = [];

    sortedPriorities.forEach((priority, index) => {
      if (approvedPriorities.has(index)) {
        const priorityText = editedPriorities.get(index) || priority.priority;
        selectedPriorities.push({
          ...priority,
          priority: priorityText,
        });
      }
    });

    customStrategies.forEach((strategy) => {
      if (strategy.trim()) {
        selectedPriorities.unshift({
          priority: strategy.trim(),
          confidence: "high",
          evidence: [],
          rationale: "User-defined strategic priority",
        });
      }
    });

    onNext(selectedPriorities);
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

  return (
    <m.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease }}
      className="max-w-6xl mx-auto px-2 sm:px-4"
    >
      {/* Editorial frame */}
      <div className="relative border border-white/10">
        {/* Corner accent marks */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent-orange" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent-orange" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent-orange" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent-orange" />

        <div className="p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Top label */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-orange" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">
                Step 2 · Strategic Priorities
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-foreground tracking-[-0.02em] leading-[1.1] mb-4">
            Strategic Inference
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted mb-10 md:mb-12 leading-relaxed max-w-3xl">
            Based on public signals, here&apos;s our inferred view of your strategic priorities.
            <span className="text-foreground"> Vote on each or add your own.</span>
          </p>

      {/* Two-column layout - mobile first: stack, then side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Priorities Column */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle mb-3">
            Likely Strategic Priorities
          </p>

          {sortedPriorities.map((priority, index) => {
            const isApproved = approvedPriorities.has(index);
            const isRejected = rejectedPriorities.has(index);
            const isEditing = editingIndex === index;
            const displayPriority = editedPriorities.get(index) || priority.priority;

            return (
              <m.div
                key={index}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08, ease }}
                className={cn(
                  "bg-background-card border rounded-md p-5",
                  isRejected && "border-border opacity-50",
                  isApproved && !isRejected && "border-accent-orange/50",
                  !isApproved && !isRejected && "border-border"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  {isEditing ? (
                    <div className="flex-1 mr-3">
                      <textarea
                        value={editedPriorities.get(index) || priority.priority}
                        onChange={(e) => {
                          const newEdited = new Map(editedPriorities);
                          newEdited.set(index, e.target.value);
                          setEditedPriorities(newEdited);
                        }}
                        className="w-full px-3 py-2 border border-accent-orange rounded-md focus:outline-none focus:ring-2 focus:ring-accent-orange/20 resize-none text-base"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(index, editedPriorities.get(index) || priority.priority)}
                          className="px-3 py-1 bg-accent-orange text-white rounded-md text-sm font-medium hover:bg-accent-orange-light transition-colors cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1 text-foreground-muted hover:text-foreground text-sm transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h4 className="text-base font-normal text-foreground flex-1">
                      {index + 1}. {displayPriority}
                      {editedPriorities.has(index) && (
                        <span className="ml-2 text-xs text-accent-orange">(edited)</span>
                      )}
                    </h4>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-1 sm:gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleStartEdit(index)}
                        className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-2 sm:p-1.5 rounded-full text-foreground-subtle hover:bg-surface-subtle hover:text-accent-orange transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleThumbsUp(index)}
                        className={cn(
                          "min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-2 sm:p-1.5 rounded-full border cursor-pointer",
                          isApproved
                            ? "border-accent-orange text-accent-orange"
                            : "border-transparent text-foreground-subtle hover:bg-surface-subtle hover:text-accent-orange"
                        )}
                        title="Include"
                      >
                        <ThumbsUp className="w-4 h-4" fill={isApproved ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => handleThumbsDown(index)}
                        className={cn(
                          "min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-2 sm:p-1.5 rounded-full border cursor-pointer",
                          isRejected
                            ? "border-border text-foreground-muted"
                            : "border-transparent text-foreground-subtle hover:bg-surface-subtle hover:text-foreground-muted"
                        )}
                        title="Exclude"
                      >
                        <ThumbsDown className="w-4 h-4" fill={isRejected ? "currentColor" : "none"} />
                      </button>
                    </div>
                  )}
                </div>

                {priority.rationale && !isRejected && !isEditing && (
                  <div className="bg-accent-orange/5 rounded-md p-3">
                    <p className="text-xs font-medium text-accent-orange mb-1">Strategic Rationale</p>
                    <p className="text-foreground-muted text-sm leading-relaxed">{priority.rationale}</p>
                  </div>
                )}
              </m.div>
            );
          })}

          {/* Custom Priorities Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle">
                Your Strategic Priorities
              </p>
              {!showCustomInput && (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="flex items-center gap-1.5 text-accent-orange hover:text-accent-orange-light transition-colors text-sm font-medium cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add priority
                </button>
              )}
            </div>

            {/* Existing custom strategies */}
            {customStrategies.length > 0 && (
              <div className="space-y-2 mb-3">
                {customStrategies.map((strategy, index) => {
                  const isEditingCustom = editingCustomIndex === index;

                  return (
                    <m.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-accent-orange/5 border border-accent-orange/20 rounded-md p-4 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="px-2 py-0.5 bg-accent-orange/20 text-accent-orange text-[10px] font-mono uppercase rounded mb-2 inline-block">
                            Custom
                          </span>
                          {isEditingCustom ? (
                            <div className="mt-2">
                              <textarea
                                value={strategy}
                                onChange={(e) => {
                                  setCustomStrategies((prev) =>
                                    prev.map((s, i) => (i === index ? e.target.value : s))
                                  );
                                }}
                                className="w-full px-3 py-2 border border-accent-orange rounded-md focus:outline-none focus:ring-2 focus:ring-accent-orange/20 resize-none"
                                rows={2}
                                autoFocus
                              />
                              <button
                                onClick={() => setEditingCustomIndex(null)}
                                className="mt-2 px-3 py-1 bg-accent-orange text-white rounded-md text-sm font-medium hover:bg-accent-orange-light transition-colors cursor-pointer"
                              >
                                Done
                              </button>
                            </div>
                          ) : (
                            <p className="text-foreground font-normal">{strategy}</p>
                          )}
                        </div>
                        {!isEditingCustom && (
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                            <button
                              onClick={() => setEditingCustomIndex(index)}
                              className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-2 sm:p-1.5 text-foreground-subtle hover:text-accent-orange hover:bg-accent-orange/10 rounded-full transition-all cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCustomStrategies((prev) => prev.filter((_, i) => i !== index))}
                              className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-2 sm:p-1.5 text-foreground-subtle hover:text-foreground-muted hover:bg-surface-subtle rounded-full transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </m.div>
                  );
                })}
              </div>
            )}

            {/* Add new custom strategy input */}
            {showCustomInput && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background-card border-2 border-dashed border-accent-orange/30 rounded-md p-4 hover:border-accent-orange/50 transition-colors"
              >
                <label className="text-sm font-medium text-accent-orange mb-2 block">
                  Add a strategic priority
                </label>
                <textarea
                  value={newCustomStrategy}
                  onChange={(e) => setNewCustomStrategy(e.target.value)}
                  placeholder="e.g., Expand into adjacent markets through strategic acquisitions"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-colors resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-3">
                  <p className="text-xs text-foreground-subtle">
                    This will be prioritised when generating AI opportunities.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setNewCustomStrategy("");
                      }}
                      className="min-h-11 px-4 py-2 sm:py-1.5 text-foreground-muted hover:text-foreground text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newCustomStrategy.trim()) {
                          setCustomStrategies((prev) => [...prev, newCustomStrategy.trim()]);
                          setNewCustomStrategy("");
                        }
                      }}
                      disabled={!newCustomStrategy.trim()}
                      className={cn(
                        "min-h-11 px-4 py-2 sm:py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
                        newCustomStrategy.trim()
                          ? "bg-accent-orange text-white hover:bg-accent-orange-light"
                          : "bg-surface-subtle text-foreground-subtle cursor-not-allowed"
                      )}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </m.div>
            )}

            {customStrategies.length > 0 && !showCustomInput && (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full mt-2 min-h-12 py-3 border-2 border-dashed border-border rounded-md text-foreground-muted hover:border-accent-orange/50 hover:text-accent-orange transition-colors flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add another priority
              </button>
            )}
          </div>

          {/* Continue Button */}
          <div className="mt-6 pt-5 border-t border-border">
            <button
              onClick={handleNext}
              disabled={isAnalysing || (approvedPriorities.size === 0 && customStrategies.length === 0)}
              className={cn(
                "w-full min-h-12 px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer",
                isAnalysing || (approvedPriorities.size === 0 && customStrategies.length === 0)
                  ? "bg-surface-subtle text-foreground-subtle cursor-not-allowed"
                  : "bg-background-button text-foreground-light hover:bg-[#1a1a1a]"
              )}
            >
              {isAnalysing ? (
                <>
                  <m.div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  Explore AI Use Cases
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Company Context Column */}
        <div className="space-y-4">
          {companyData && (
            <div className="bg-background-card border border-border rounded-md p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle mb-2">
                Company Overview
              </p>
              <h4 className="text-base font-normal text-foreground mb-0.5">{companyData.companyName}</h4>
              <p className="text-xs text-foreground-subtle mb-2">{companyData.industry}</p>
              <p className="text-foreground-muted text-sm leading-relaxed">{companyData.description}</p>

              {companyData.keyThemes && companyData.keyThemes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle mb-2">
                    Key Themes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {companyData.keyThemes.slice(0, 5).map((theme, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-surface-subtle text-foreground-muted rounded text-xs"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {companyData?.competitors && companyData.competitors.length > 0 && (
            <div className="bg-background-card border border-border rounded-md p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle mb-2">
                Example Competitors
              </p>
              <ul className="space-y-2">
                {companyData.competitors.map((competitor, i) => (
                  <li key={i} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <p className="font-medium text-foreground text-sm">{competitor.name}</p>
                    <p className="text-foreground-muted text-xs mt-0.5 leading-relaxed">
                      {competitor.strategicFocus}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Selection Summary */}
          <div className="bg-surface-subtle border border-border rounded-md p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle mb-1">
              Selection Summary
            </p>
            <p className="text-sm text-foreground-muted">
              <span className="font-medium text-accent-orange">{approvedPriorities.size}</span> priorities selected
              {customStrategies.length > 0 && (
                <span className="text-foreground"> + {customStrategies.length} custom</span>
              )}
            </p>
          </div>
        </div>
      </div>

          {/* Disclaimer */}
          <div className="bg-surface-subtle border border-border rounded-md p-4 mt-10 md:mt-12">
            <p className="text-sm text-foreground-muted leading-relaxed">
              <strong className="text-foreground">Note:</strong> This analysis is based on your company&apos;s
              public information. Strategic priorities are inferred from available signals and should be validated
              against your internal strategy.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-start pt-6 md:pt-8 border-t border-white/10 mt-10 md:mt-12">
            <button
              onClick={onBack}
              className="min-h-11 px-4 py-2 text-foreground-muted hover:text-foreground transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </m.div>
  );
}
