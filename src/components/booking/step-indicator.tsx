"use client";

import { m } from "motion/react";

export type BookingStep = "date" | "time" | "details" | "confirmed";

const STEPS: { id: BookingStep; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "time", label: "Time" },
  { id: "details", label: "Details" },
  { id: "confirmed", label: "Confirmed" },
];

interface StepIndicatorProps {
  currentStep: BookingStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Booking progress" className="flex items-center justify-center gap-3">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <m.div
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  isActive
                    ? "bg-accent-orange"
                    : isCompleted
                      ? "bg-accent-orange/60"
                      : "bg-border"
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              />
              <span
                className={`font-mono text-xs transition-colors duration-300 ${
                  isActive
                    ? "text-foreground"
                    : isCompleted
                      ? "text-foreground-muted"
                      : "text-foreground-subtle"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 h-px transition-colors duration-300 -mt-5 ${
                  isCompleted ? "bg-accent-orange/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
