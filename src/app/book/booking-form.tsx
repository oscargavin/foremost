"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { m, AnimatePresence, MotionConfig } from "motion/react";
import {
  DatePicker,
  TimeSlots,
  BookingDetailsForm,
  BookingSummary,
  type BookingStep,
} from "@/components/booking";
import { Text } from "@/components/ui";
import type { BookingDetails } from "@/lib/schemas/booking";
import type { BookingResponse, AvailableSlots } from "@/lib/calcom";

// Shared spring configurations for consistent motion feel
const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

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

const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London";

const STEPS: { id: BookingStep; label: string; number: string }[] = [
  { id: "date", label: "Pick a date", number: "01" },
  { id: "time", label: "Choose time", number: "02" },
  { id: "details", label: "Your details", number: "03" },
  { id: "confirmed", label: "Confirmed", number: "04" },
];

interface BookingFormState {
  step: BookingStep;
  selectedDate: string | null;
  selectedTime: string | null;
  slots: AvailableSlots;
  isLoadingSlots: boolean;
  isSubmitting: boolean;
  error: string | null;
  booking: BookingResponse | null;
}

export function BookingForm() {
  const [state, setState] = useState<BookingFormState>({
    step: "date",
    selectedDate: null,
    selectedTime: null,
    slots: {},
    isLoadingSlots: true,
    isSubmitting: false,
    error: null,
    booking: null,
  });

  const timeZone = DEFAULT_TIMEZONE;
  const currentStepIndex = STEPS.findIndex((s) => s.id === state.step);

  // Fetch available slots for the next 90 days
  const fetchSlots = useCallback(async () => {
    setState((s) => ({ ...s, isLoadingSlots: true, error: null }));

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        timeZone,
      });

      const response = await fetch(`/api/booking/slots?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load available times");
      }

      const data = await response.json();
      setState((s) => ({ ...s, slots: data.slots, isLoadingSlots: false }));
    } catch (error) {
      setState((s) => ({
        ...s,
        error: error instanceof Error ? error.message : "Failed to load available times",
        isLoadingSlots: false,
      }));
    }
  }, [timeZone]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Available dates derived from slots
  const availableDates = useMemo(() => {
    return new Set(Object.keys(state.slots));
  }, [state.slots]);

  // Slots for selected date
  const slotsForDate = useMemo(() => {
    if (!state.selectedDate) return [];
    return state.slots[state.selectedDate] || [];
  }, [state.slots, state.selectedDate]);

  const handleSelectDate = (date: string) => {
    setState((s) => ({
      ...s,
      selectedDate: date,
      selectedTime: null,
      step: "time",
      error: null,
    }));
  };

  const handleSelectTime = (time: string) => {
    setState((s) => ({
      ...s,
      selectedTime: time,
      step: "details",
      error: null,
    }));
  };

  const handleBack = () => {
    if (state.step === "time") {
      setState((s) => ({ ...s, step: "date", selectedTime: null }));
    } else if (state.step === "details") {
      setState((s) => ({ ...s, step: "time" }));
    }
  };

  const handleSubmitDetails = async (details: BookingDetails) => {
    if (!state.selectedDate || !state.selectedTime) return;

    setState((s) => ({ ...s, isSubmitting: true, error: null }));

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: {
            date: state.selectedDate,
            time: state.selectedTime,
            timeZone,
          },
          details,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setState((s) => ({
        ...s,
        booking: data.booking,
        step: "confirmed",
        isSubmitting: false,
      }));
    } catch (error) {
      setState((s) => ({
        ...s,
        error: error instanceof Error ? error.message : "Failed to create booking",
        isSubmitting: false,
      }));
    }
  };

  // Format selected date for display
  const formattedDate = state.selectedDate
    ? new Date(state.selectedDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  // Format selected time for display
  const formattedTime = state.selectedTime
    ? new Date(state.selectedTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      })
    : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Header - Compact version for small screens */}
        <div className="lg:hidden bg-background-card bg-pattern-grid-subtle border-b border-border px-4 py-6 sm:px-6 sm:py-8">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={gentleSpring}
          >
            <m.span
              className="font-mono text-xs text-accent-orange tracking-wider uppercase mb-2 block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...gentleSpring, delay: 0.1 }}
            >
              Schedule a call
            </m.span>
            <p className="text-2xl sm:text-3xl tracking-tight text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
              Let&apos;s talk about <span className="text-accent-orange">your vision</span>
            </p>

            {/* Mobile step indicator - horizontal dots with spring animations */}
            <div className="flex items-center gap-2 mt-4">
              {STEPS.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <m.div
                      className={`w-2 h-2 rounded-full ${
                        isActive
                          ? "bg-accent-orange"
                          : isCompleted
                            ? "bg-accent-orange/60"
                            : "bg-border"
                      }`}
                      initial={false}
                      animate={{
                        scale: isActive ? [1, 1.4, 1] : 1,
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: isActive ? Infinity : 0,
                        repeatDelay: 1.5,
                      }}
                    />
                    {index < STEPS.length - 1 && (
                      <m.div
                        className="w-6 sm:w-8 h-px bg-border"
                        initial={false}
                        animate={{
                          backgroundColor: isCompleted ? "rgba(238, 96, 24, 0.4)" : undefined,
                          scaleX: isCompleted ? 1 : 0.8,
                        }}
                        transition={gentleSpring}
                        style={{ originX: 0 }}
                      />
                    )}
                  </div>
                );
              })}
              <m.span
                className="ml-2 font-mono text-xs text-foreground-muted"
                key={currentStepIndex}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={bouncySpring}
              >
                {currentStepIndex + 1}/{STEPS.length}
              </m.span>
            </div>
          </m.div>
        </div>

        {/* Left Panel - Diagonal pattern context panel (desktop only) */}
        <div className="hidden lg:block lg:w-[45%] xl:w-[40%] bg-background-card bg-pattern-grid-subtle border-r border-border relative overflow-hidden">
          <div className="relative z-10 p-12 xl:p-16 pb-16 flex flex-col min-h-[300px] sticky top-0">
            {/* Header */}
            <div className="mb-auto">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={gentleSpring}
              >
                <m.span
                  className="font-mono text-xs text-accent-orange tracking-wider uppercase mb-4 block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...gentleSpring, delay: 0.15 }}
                >
                  Schedule a call
                </m.span>
                <m.h1
                  className="text-5xl xl:text-6xl tracking-tight text-foreground mb-6"
                  style={{ letterSpacing: '-0.02em' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...gentleSpring, delay: 0.2 }}
                >
                  Let&apos;s talk about
                  <br />
                  <m.span
                    className="text-accent-orange inline-block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...bouncySpring, delay: 0.35 }}
                  >
                    your vision
                  </m.span>
                </m.h1>
                <m.p
                  className="font-mono text-sm text-foreground-muted max-w-md leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                >
                  A 30-minute conversation to understand your goals
                  and explore how AI can transform your business.
                </m.p>
              </m.div>
            </div>

            {/* Step Timeline - Vertical with enhanced animations */}
            <nav aria-label="Booking progress">
              <div className="space-y-1">
                {STEPS.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <m.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...gentleSpring, delay: index * 0.08 + 0.5 }}
                      className="flex items-center gap-4 py-3"
                    >
                      {/* Step indicator with pulse */}
                      <div className="relative">
                        <m.div
                          className={`w-2.5 h-2.5 rounded-full ${
                            isActive
                              ? "bg-accent-orange"
                              : isCompleted
                                ? "bg-accent-orange/60"
                                : "bg-border"
                          }`}
                          initial={false}
                          animate={{
                            scale: isActive ? [1, 1.4, 1] : 1,
                            boxShadow: isActive
                              ? ["0 0 0 0 rgba(238, 96, 24, 0)", "0 0 0 8px rgba(238, 96, 24, 0.15)", "0 0 0 0 rgba(238, 96, 24, 0)"]
                              : "0 0 0 0 rgba(238, 96, 24, 0)",
                          }}
                          transition={{
                            duration: 2,
                            repeat: isActive ? Infinity : 0,
                            ease: "easeInOut",
                          }}
                        />
                        {/* Connecting line with fill animation */}
                        {index < STEPS.length - 1 && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-border/50 overflow-hidden">
                            <m.div
                              className="w-full bg-accent-orange/40"
                              initial={{ height: 0 }}
                              animate={{ height: isCompleted ? "100%" : 0 }}
                              transition={{ ...gentleSpring, delay: 0.1 }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Step label */}
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <m.span
                          className={`font-mono text-xs ${
                            isActive || isCompleted
                              ? "text-accent-orange"
                              : "text-foreground-subtle"
                          }`}
                          initial={false}
                          animate={{ opacity: isActive || isCompleted ? 1 : 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {step.number}
                        </m.span>
                        <m.span
                          className={`text-sm ${
                            isActive
                              ? "text-foreground"
                              : isCompleted
                                ? "text-foreground-secondary"
                                : "text-foreground-subtle"
                          }`}
                          initial={false}
                          animate={{
                            x: isActive ? 4 : 0,
                          }}
                          transition={bouncySpring}
                        >
                          {step.label}
                        </m.span>

                        {/* Show selection preview with slide-in */}
                        <AnimatePresence mode="wait">
                          {isCompleted && step.id === "date" && formattedDate && (
                            <m.span
                              key="date-preview"
                              className="font-mono text-xs text-foreground-muted"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={bouncySpring}
                            >
                              — {formattedDate}
                            </m.span>
                          )}
                          {isCompleted && step.id === "time" && formattedTime && (
                            <m.span
                              key="time-preview"
                              className="font-mono text-xs text-foreground-muted"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={bouncySpring}
                            >
                              — {formattedTime}
                            </m.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </m.div>
                  );
                })}
              </div>
            </nav>

            {/* Footer info */}
            <m.div
              className="mt-12 pt-8 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3 text-foreground-muted">
                <m.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-accent-orange"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </m.svg>
                <span className="font-mono text-xs">30 min • Video call</span>
              </div>
            </m.div>
          </div>
        </div>

        {/* Right Panel - Interactive form area */}
        <div className="flex-1 bg-background">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:p-12 xl:p-16 pb-12 sm:pb-16 lg:pb-24 max-w-2xl mx-auto lg:mx-0">
            {/* Error message with shake animation */}
            <AnimatePresence>
              {state.error && (
                <m.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    height: "auto",
                    x: [0, -8, 8, -8, 8, 0],
                  }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{
                    ...springTransition,
                    x: { duration: 0.4, delay: 0.1 },
                  }}
                  className="mb-8"
                >
                  <div
                    role="alert"
                    className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg"
                  >
                    <m.svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-destructive flex-shrink-0 mt-0.5"
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </m.svg>
                    <Text className="text-sm text-destructive">{state.error}</Text>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            {/* Step content - relative container with min-height prevents layout shift */}
            <div className="relative min-h-[500px] sm:min-h-[550px]">
              <AnimatePresence mode="popLayout" initial={false}>
                {/* Loading state */}
                {state.isLoadingSlots && state.step === "date" && (
                  <m.div
                    key="loading"
                    layout
                    className="w-full flex flex-col items-center justify-center py-24"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={gentleSpring}
                  >
                    <m.div
                      className="relative w-12 h-12 mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-accent-orange/20" />
                      <m.div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-orange"
                        style={{ willChange: "transform" }}
                      />
                    </m.div>
                    <m.span
                      className="font-mono text-sm text-foreground-muted"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Loading availability...
                    </m.span>
                    <m.div
                      className="flex gap-1 mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <m.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-accent-orange/40"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </m.div>
                  </m.div>
                )}

                {/* Date step */}
                {!state.isLoadingSlots && state.step === "date" && (
                  <m.div
                    key="date"
                    layout
                    className="w-full"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={gentleSpring}
                  >
                  <div className="mb-6 sm:mb-10">
                    <m.span
                      className="font-mono text-xs text-accent-orange tracking-wider uppercase block mb-2 sm:mb-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...bouncySpring, delay: 0.15 }}
                    >
                      Step 01
                    </m.span>
                    <m.h2
                      className="text-2xl sm:text-3xl lg:text-4xl text-foreground mb-2 sm:mb-3"
                      style={{ letterSpacing: '-0.02em' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...gentleSpring, delay: 0.2 }}
                    >
                      When works for you?
                    </m.h2>
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Text variant="muted" className="font-mono text-xs sm:text-sm">
                        Select an available date from the calendar.
                      </Text>
                    </m.div>
                  </div>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...gentleSpring, delay: 0.25 }}
                  >
                    <DatePicker
                      selectedDate={state.selectedDate}
                      onSelectDate={handleSelectDate}
                      availableDates={availableDates}
                    />
                  </m.div>
                </m.div>
              )}

              {state.step === "time" && (
                <m.div
                  key="time"
                  layout
                  className="w-full"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={gentleSpring}
                >
                  <div className="mb-6 sm:mb-10">
                    <m.span
                      className="font-mono text-xs text-accent-orange tracking-wider uppercase block mb-2 sm:mb-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...bouncySpring, delay: 0.15 }}
                    >
                      Step 02
                    </m.span>
                    <m.h2
                      className="text-2xl sm:text-3xl lg:text-4xl text-foreground mb-2 sm:mb-3"
                      style={{ letterSpacing: '-0.02em' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...gentleSpring, delay: 0.2 }}
                    >
                      Pick a time
                    </m.h2>
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Text variant="muted" className="font-mono text-xs sm:text-sm">
                        {formattedDate} — {slotsForDate.length} slots available
                      </Text>
                    </m.div>
                  </div>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...gentleSpring, delay: 0.25 }}
                  >
                    <TimeSlots
                      slots={slotsForDate}
                      selectedTime={state.selectedTime}
                      onSelectTime={handleSelectTime}
                      timeZone={timeZone}
                    />
                  </m.div>
                  <m.button
                    type="button"
                    onClick={handleBack}
                    className="mt-8 sm:mt-10 flex items-center gap-2 font-mono text-sm text-foreground-muted hover:text-foreground active:text-foreground group min-h-11 -ml-2 px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <m.svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      initial={false}
                      whileHover={{ x: -2 }}
                    >
                      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </m.svg>
                    Change date
                  </m.button>
                </m.div>
              )}

              {state.step === "details" && state.selectedDate && state.selectedTime && (
                <m.div
                  key="details"
                  layout
                  className="w-full"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={gentleSpring}
                >
                  <div className="mb-6 sm:mb-10">
                    <m.span
                      className="font-mono text-xs text-accent-orange tracking-wider uppercase block mb-2 sm:mb-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...bouncySpring, delay: 0.15 }}
                    >
                      Step 03
                    </m.span>
                    <m.h2
                      className="text-2xl sm:text-3xl lg:text-4xl text-foreground mb-2 sm:mb-3"
                      style={{ letterSpacing: '-0.02em' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...gentleSpring, delay: 0.2 }}
                    >
                      Almost there
                    </m.h2>
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Text variant="muted" className="font-mono text-xs sm:text-sm">
                        Tell us a bit about yourself so we can prepare.
                      </Text>
                    </m.div>
                  </div>
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...gentleSpring, delay: 0.25 }}
                  >
                    <BookingDetailsForm
                      onSubmit={handleSubmitDetails}
                      onBack={handleBack}
                      isSubmitting={state.isSubmitting}
                      selectedDateTime={{
                        date: state.selectedDate,
                        time: state.selectedTime,
                      }}
                      timeZone={timeZone}
                    />
                  </m.div>
                </m.div>
              )}

              {state.step === "confirmed" && state.booking && (
                <m.div
                  key="confirmed"
                  layout
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ ...bouncySpring, delay: 0.1 }}
                >
                  <BookingSummary booking={state.booking} timeZone={timeZone} />
                </m.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
