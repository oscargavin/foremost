"use client";

import { m, AnimatePresence } from "motion/react";

interface TimeSlot {
  time: string;
}

interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  timeZone: string;
  isLoading?: boolean;
}

// Spring configurations
const gentleSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

const bouncySpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 25,
};

function formatTime(isoString: string, timeZone: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
}

// Group slots by morning/afternoon/evening
function groupSlotsByPeriod(slots: TimeSlot[], timeZone: string) {
  const groups: { morning: TimeSlot[]; afternoon: TimeSlot[]; evening: TimeSlot[] } = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  slots.forEach((slot) => {
    const date = new Date(slot.time);
    const hours = parseInt(
      date.toLocaleTimeString("en-GB", { hour: "2-digit", hour12: false, timeZone })
    );

    if (hours < 12) {
      groups.morning.push(slot);
    } else if (hours < 17) {
      groups.afternoon.push(slot);
    } else {
      groups.evening.push(slot);
    }
  });

  return groups;
}

export function TimeSlots({
  slots,
  selectedTime,
  onSelectTime,
  timeZone,
  isLoading,
}: TimeSlotsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <m.div
            key={i}
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...gentleSpring, delay: i * 0.1 }}
          >
            <m.div
              className="w-20 h-4 bg-surface-subtle rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, j) => (
                <m.div
                  key={j}
                  className="w-20 h-12 bg-surface-subtle rounded-lg"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: (i * 0.1) + (j * 0.05) }}
                />
              ))}
            </div>
          </m.div>
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <m.div
        className="py-16 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={gentleSpring}
      >
        <m.div
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-subtle flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...bouncySpring, delay: 0.1 }}
        >
          <m.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-foreground-subtle"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </m.svg>
        </m.div>
        <m.p
          className="text-foreground-muted font-mono text-sm mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          No times available
        </m.p>
        <m.p
          className="text-foreground-subtle text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Try selecting a different date.
        </m.p>
      </m.div>
    );
  }

  const groupedSlots = groupSlotsByPeriod(slots, timeZone);
  const periods = [
    { key: "morning", label: "Morning", icon: "M12 3v2M4.22 4.22l1.42 1.42M3 12h2M4.22 19.78l1.42-1.42M12 19v2M19.78 19.78l-1.42-1.42M21 12h-2M19.78 4.22l-1.42 1.42M12 7a5 5 0 000 10", slots: groupedSlots.morning },
    { key: "afternoon", label: "Afternoon", icon: "M12 3v2M4.22 4.22l1.42 1.42M3 12h2M12 7a5 5 0 000 10M12 17v4M21 12h-2M16 12a4 4 0 01-4 4", slots: groupedSlots.afternoon },
    { key: "evening", label: "Evening", icon: "M12 3c-1.2 0-2.4.6-3 1.7A5.5 5.5 0 0013.5 15a5.5 5.5 0 004.5-2.3A8 8 0 0112 21a8 8 0 010-16z", slots: groupedSlots.evening },
  ].filter((p) => p.slots.length > 0);

  return (
    <div className="space-y-8">
      {/* Timezone indicator with subtle animation */}
      <m.div
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-subtle rounded-full"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={gentleSpring}
      >
        <m.svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-foreground-muted"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
          <path d="M7 3.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </m.svg>
        <span className="font-mono text-xs text-foreground-muted">
          {timeZone.replace(/_/g, " ")}
        </span>
      </m.div>

      {/* Time periods with staggered animations */}
      {periods.map((period, periodIndex) => (
        <m.div
          key={period.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...gentleSpring, delay: periodIndex * 0.12 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <m.span
              className="font-mono text-xs text-accent-orange uppercase tracking-wider"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...bouncySpring, delay: periodIndex * 0.12 + 0.05 }}
            >
              {period.label}
            </m.span>
            <m.span
              className="flex-1 h-px bg-border"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ ...gentleSpring, delay: periodIndex * 0.12 + 0.1 }}
              style={{ originX: 0 }}
            />
            <m.span
              className="font-mono text-xs text-foreground-subtle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: periodIndex * 0.12 + 0.15 }}
            >
              {period.slots.length} slot{period.slots.length !== 1 ? "s" : ""}
            </m.span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            <AnimatePresence>
              {period.slots.map((slot, index) => {
                const isSelected = slot.time === selectedTime;

                return (
                  <m.button
                    key={slot.time}
                    type="button"
                    onClick={() => onSelectTime(slot.time)}
                    className={`
                      relative min-h-12 px-4 py-3 rounded-lg font-mono text-sm
                      border
                      focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2
                      ${
                        isSelected
                          ? "bg-accent-orange text-white border-accent-orange"
                          : "bg-background-card border-border text-foreground"
                      }
                    `}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      ...bouncySpring,
                      delay: periodIndex * 0.08 + index * 0.025,
                    }}
                    whileHover={!isSelected ? {
                      scale: 1.03,
                      borderColor: "rgba(238, 96, 24, 0.5)",
                      transition: { duration: 0.15 },
                    } : undefined}
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={isSelected}
                    layout
                  >
                    {formatTime(slot.time, timeZone)}

                    {/* Selection checkmark with enhanced animation */}
                    <AnimatePresence>
                      {isSelected && (
                        <m.span
                          className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={bouncySpring}
                        >
                          <m.svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <m.path
                              d="M2 5l2 2 4-5"
                              stroke="#ee6018"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.25, delay: 0.1 }}
                            />
                          </m.svg>
                        </m.span>
                      )}
                    </AnimatePresence>

                    {/* Subtle pulse on selected */}
                    {isSelected && (
                      <m.span
                        className="absolute inset-0 rounded-lg bg-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </m.button>
                );
              })}
            </AnimatePresence>
          </div>
        </m.div>
      ))}
    </div>
  );
}
