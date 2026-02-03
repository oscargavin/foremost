"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { StreamEvent } from "@/lib/explorer/types";

interface ProgressiveLoadingProps {
  isAnalysing: boolean;
  streamEvents?: StreamEvent[];
}

const STAGES = [
  { id: "company", label: "Analysing company", duration: 8000 },
  { id: "strategy", label: "Inferring strategy", duration: 12000 },
  { id: "opportunities", label: "Finding opportunities", duration: 15000 },
];

export function ProgressiveLoading({ isAnalysing, streamEvents = [] }: ProgressiveLoadingProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const allLinesRef = useRef<string[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Track stage progress based on time
  useEffect(() => {
    if (!isAnalysing) {
      setActiveStage(0);
      startTimeRef.current = Date.now();
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      let totalTime = 0;
      for (let i = 0; i < STAGES.length; i++) {
        totalTime += STAGES[i].duration;
        if (elapsed < totalTime) {
          setActiveStage(i);
          break;
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isAnalysing]);

  // Build lines from stream events
  useEffect(() => {
    if (!isAnalysing) {
      setDisplayedLines([]);
      setCurrentLineIndex(0);
      allLinesRef.current = [];
      return;
    }

    const lines: string[] = [];

    for (const event of streamEvents) {
      if (event.type === "prompt_snippet" && event.promptSnippet) {
        const promptLines = event.promptSnippet.split("\n").filter((l) => l.trim());
        lines.push(...promptLines.slice(0, 3));
      } else if (event.type === "response_snippet" && event.responseSnippet) {
        const responseLines = event.responseSnippet.split("\n").filter((l) => l.trim());
        lines.push(...responseLines.slice(0, 3));
      }
    }

    allLinesRef.current = lines;
  }, [streamEvents, isAnalysing]);

  // Reveal lines one at a time
  useEffect(() => {
    if (!isAnalysing) return;

    const interval = setInterval(() => {
      const allLines = allLinesRef.current;
      if (currentLineIndex < allLines.length) {
        const newLines = allLines.slice(Math.max(0, currentLineIndex - 3), currentLineIndex + 1);
        setDisplayedLines(newLines);
        setCurrentLineIndex((prev) => prev + 1);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isAnalysing, currentLineIndex]);

  if (!isAnalysing) return null;

  return (
    <div className="w-full">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="text-center w-full"
      >
        {/* Simple animated indicator */}
        <div className="relative w-12 h-12 mx-auto mb-8">
          {/* Outer ring */}
          <m.div
            className="absolute inset-0 rounded-full border border-accent-orange/30"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          />
          {/* Inner dot */}
          <m.div
            className="absolute inset-3 rounded-full bg-accent-orange"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "opacity" }}
          />
        </div>

        {/* Stage label */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-normal text-foreground mb-4 sm:mb-6 tracking-tight">
            {STAGES[activeStage]?.label || "Analysing"}...
          </h2>

          {/* Progress indicator - numbered steps */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-1.5 sm:gap-2">
                <m.div
                  animate={{
                    backgroundColor: i < activeStage ? "var(--accent-orange)" : "transparent",
                    borderColor: i <= activeStage ? "var(--accent-orange)" : "var(--border)",
                    color: i < activeStage ? "#fff" : i === activeStage ? "var(--accent-orange)" : "var(--foreground-subtle)",
                  }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono"
                >
                  {i + 1}
                </m.div>
                {i < STAGES.length - 1 && (
                  <m.div
                    animate={{
                      backgroundColor: i < activeStage ? "var(--accent-orange)" : "var(--border)",
                    }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="w-5 sm:w-8 h-px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Terminal window - matches Factory.ai code block style */}
        <div className="bg-background-card rounded-md overflow-hidden border border-border w-full">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-border" />
              <div className="w-2 h-2 rounded-full bg-border" />
              <div className="w-2 h-2 rounded-full bg-border" />
            </div>
            <span className="text-[10px] font-mono text-foreground-subtle ml-2 uppercase tracking-wider hidden sm:inline">
              Analysis Stream
            </span>
          </div>

          {/* Terminal content */}
          <div className="h-24 sm:h-28 w-full overflow-hidden p-3 sm:p-4 font-mono text-[11px] sm:text-xs text-left flex flex-col justify-end bg-surface-subtle">
            <AnimatePresence mode="popLayout">
              {displayedLines.length > 0 ? (
                displayedLines.map((line, index) => (
                  <m.div
                    key={`${currentLineIndex}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: index === displayedLines.length - 1 ? 0.9 : 0.5,
                      x: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="text-foreground-muted truncate leading-relaxed"
                  >
                    <span className="text-accent-orange mr-2">›</span>
                    {line.slice(0, 60)}{line.length > 60 ? "..." : ""}
                  </m.div>
                ))
              ) : (
                <div className="text-foreground-muted flex items-center">
                  <span className="text-accent-orange mr-2">›</span>
                  <span>Initialising analysis</span>
                  <m.span
                    className="ml-1 text-accent-orange"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    _
                  </m.span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Time estimate */}
        <p className="mt-6 text-sm text-foreground-subtle font-mono">
          ~30-45 seconds
        </p>
      </m.div>
    </div>
  );
}
