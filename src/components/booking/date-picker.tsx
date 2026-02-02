"use client";

import { useState, useMemo, useRef } from "react";
import { m, AnimatePresence } from "motion/react";

interface DatePickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  availableDates: Set<string>;
}

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Get day of week (0 = Sunday, but we want Monday = 0)
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const days: (Date | null)[] = [];

  // Add empty cells for days before the first of the month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function DatePicker({ selectedDate, onSelectDate, availableDates }: DatePickerProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const prevMonthRef = useRef(viewDate.getMonth());

  const days = useMemo(
    () => getMonthDays(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  const canGoBack = viewDate > new Date(today.getFullYear(), today.getMonth(), 1);

  const goToPrevMonth = () => {
    if (canGoBack) {
      setDirection(-1);
      prevMonthRef.current = viewDate.getMonth();
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    }
  };

  const goToNextMonth = () => {
    setDirection(1);
    prevMonthRef.current = viewDate.getMonth();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Count available days in current month
  const availableCount = days.filter((date) => {
    if (!date) return false;
    const dateKey = formatDateKey(date);
    return availableDates.has(dateKey) && !isPast(date) && !isWeekend(date);
  }).length;

  // Month key for AnimatePresence
  const monthKey = `${viewDate.getFullYear()}-${viewDate.getMonth()}`;

  return (
    <div className="w-full">
      {/* Month navigation - minimal, editorial style */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={monthKey}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={gentleSpring}
            >
              <h3 className="text-xl sm:text-2xl text-foreground" style={{ letterSpacing: '-0.02em' }}>
                {MONTHS[viewDate.getMonth()]}
              </h3>
              <m.span
                className="font-mono text-xs text-foreground-muted block"
                key={`count-${monthKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {viewDate.getFullYear()} • {availableCount} available
              </m.span>
            </m.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-1">
          <m.button
            type="button"
            onClick={goToPrevMonth}
            disabled={!canGoBack}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-full hover:bg-surface-subtle active:bg-surface-subtle disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous month"
            whileHover={canGoBack ? { scale: 1.05 } : undefined}
            whileTap={canGoBack ? { scale: 0.95 } : undefined}
          >
            <m.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              whileHover={canGoBack ? { x: -2 } : undefined}
              transition={bouncySpring}
            >
              <path
                d="M12 14l-4-4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </m.svg>
          </m.button>
          <m.button
            type="button"
            onClick={goToNextMonth}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-full hover:bg-surface-subtle active:bg-surface-subtle"
            aria-label="Next month"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <m.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              whileHover={{ x: 2 }}
              transition={bouncySpring}
            >
              <path
                d="M8 6l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </m.svg>
          </m.button>
        </div>
      </div>

      {/* Calendar grid - clean, spacious */}
      <m.div
        className="border border-border rounded-xl overflow-hidden bg-background-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={gentleSpring}
      >
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((day, i) => (
            <m.div
              key={`${day}-${i}`}
              className="py-3 text-center font-mono text-xs text-foreground-subtle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              {day}
            </m.div>
          ))}
        </div>

        {/* Days grid with AnimatePresence for month transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={monthKey}
            className="grid grid-cols-7"
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={gentleSpring}
          >
            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${viewDate.getFullYear()}-${viewDate.getMonth()}-${index}`}
                    className="aspect-square border-b border-r border-border/50 last:border-r-0 [&:nth-child(7n)]:border-r-0"
                  />
                );
              }

              const dateKey = formatDateKey(date);
              const isSelected = dateKey === selectedDate;
              const isDisabled = isPast(date) || isWeekend(date);
              const hasSlots = availableDates.has(dateKey);
              const isToday = formatDateKey(date) === formatDateKey(today);
              const isSelectable = !isDisabled && hasSlots;

              // Calculate stagger delay based on row and column
              const row = Math.floor(index / 7);
              const col = index % 7;
              const staggerDelay = (row * 0.02) + (col * 0.015);

              return (
                <m.button
                  key={dateKey}
                  type="button"
                  disabled={!isSelectable}
                  onClick={() => onSelectDate(dateKey)}
                  className={`
                    aspect-square relative font-mono text-sm
                    border-b border-r border-border/50 last:border-r-0 [&:nth-child(7n)]:border-r-0
                    disabled:cursor-not-allowed
                    focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-inset
                    ${
                      isSelected
                        ? "bg-accent-orange text-white"
                        : isSelectable
                          ? "text-foreground"
                          : "text-foreground-subtle/30"
                    }
                  `}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    ...bouncySpring,
                    delay: staggerDelay,
                  }}
                  whileHover={isSelectable && !isSelected ? {
                    backgroundColor: "rgba(238, 96, 24, 0.08)",
                    scale: 1.05,
                  } : undefined}
                  whileTap={isSelectable ? { scale: 0.9 } : undefined}
                  aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]}${!isSelectable ? " (unavailable)" : ""}`}
                  aria-pressed={isSelected}
                >
                  <span className={isToday && !isSelected ? "relative" : ""}>
                    {date.getDate()}
                    {/* Today indicator - subtle underline with pulse */}
                    {isToday && !isSelected && (
                      <m.span
                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent-orange/60 rounded-full"
                        layoutId="today-indicator"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </span>

                  {/* Availability indicator - corner dot with entrance */}
                  {hasSlots && !isDisabled && !isSelected && (
                    <m.span
                      className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-accent-orange"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...bouncySpring, delay: staggerDelay + 0.1 }}
                    />
                  )}

                  {/* Selection ring animation */}
                  {isSelected && (
                    <m.span
                      className="absolute inset-0 rounded-sm"
                      initial={{ boxShadow: "inset 0 0 0 0 rgba(238, 96, 24, 0)" }}
                      animate={{ boxShadow: "inset 0 0 0 2px rgba(238, 96, 24, 0.3)" }}
                      transition={bouncySpring}
                    />
                  )}
                </m.button>
              );
            })}
          </m.div>
        </AnimatePresence>
      </m.div>

      {/* Legend - minimal with fade-in */}
      <m.div
        className="mt-6 flex items-center gap-6 text-xs font-mono text-foreground-muted"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...gentleSpring, delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <m.span
            className="w-1 h-1 rounded-full bg-accent-orange"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <m.span
            className="w-4 border-b-2 border-accent-orange/60"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Today</span>
        </div>
      </m.div>
    </div>
  );
}
