"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { Button, Input, Label, Textarea, Text } from "@/components/ui";
import { bookingDetailsSchema, type BookingDetails } from "@/lib/schemas/booking";

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

interface BookingDetailsFormProps {
  onSubmit: (data: BookingDetails) => void;
  onBack: () => void;
  isSubmitting: boolean;
  selectedDateTime: {
    date: string;
    time: string;
  };
  timeZone: string;
}

function formatDateTime(date: string, time: string, timeZone: string): string {
  const dateObj = new Date(time);
  return dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }) + " at " + dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
}

export function BookingDetailsForm({
  onSubmit,
  onBack,
  isSubmitting,
  selectedDateTime,
  timeZone,
}: BookingDetailsFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingDetails>({
    resolver: zodResolver(bookingDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Selected time summary - subtle, inline with enhanced animations */}
      <m.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={gentleSpring}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 px-4 sm:px-5 border border-border rounded-xl bg-background-card overflow-hidden"
        whileHover={{ borderColor: "rgba(238, 96, 24, 0.3)" }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <m.div
            className="w-10 h-10 rounded-full bg-accent-orange/10 flex items-center justify-center flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...bouncySpring, delay: 0.1 }}
          >
            <m.svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="text-accent-orange"
              animate={!shouldReduceMotion ? { rotate: [0, 5, -5, 0] } : undefined}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            >
              <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 7h14M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </m.svg>
          </m.div>
          <m.div
            className="min-w-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...gentleSpring, delay: 0.15 }}
          >
            <p className="text-sm text-foreground truncate sm:whitespace-normal">
              {formatDateTime(selectedDateTime.date, selectedDateTime.time, timeZone)}
            </p>
            <p className="font-mono text-xs text-foreground-muted mt-0.5">
              30 min consultation
            </p>
          </m.div>
        </div>
        <m.button
          type="button"
          onClick={onBack}
          className="font-mono text-xs text-accent-orange min-h-11 sm:min-h-0 flex items-center justify-center sm:justify-start"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Change
        </m.button>
      </m.div>

      {/* Form fields - stacked, clean with enhanced animations */}
      <div className="space-y-5">
        {/* Name field */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...gentleSpring, delay: 0.08 }}
          className="space-y-2"
        >
          <m.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...bouncySpring, delay: 0.1 }}
          >
            <Label htmlFor="booking-name" className="text-sm font-medium text-foreground flex items-center gap-2">
              Name
              <m.span
                className="text-accent-orange text-xs"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                required
              </m.span>
            </Label>
          </m.div>
          <m.div whileFocus={{ scale: 1.01 }} transition={bouncySpring}>
            <Input
              id="booking-name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              spellCheck={false}
              aria-required="true"
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`h-12 px-4 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("name")}
            />
          </m.div>
          <AnimatePresence>
            {errors.name && (
              <m.div
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={gentleSpring}
              >
                <Text id="name-error" variant="small" className="text-destructive flex items-center gap-1.5 mt-1">
                  <m.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </m.svg>
                  {errors.name.message}
                </Text>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>

        {/* Email field */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...gentleSpring, delay: 0.14 }}
          className="space-y-2"
        >
          <m.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...bouncySpring, delay: 0.16 }}
          >
            <Label htmlFor="booking-email" className="text-sm font-medium text-foreground flex items-center gap-2">
              Email
              <m.span
                className="text-accent-orange text-xs"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                required
              </m.span>
            </Label>
          </m.div>
          <Input
            id="booking-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            spellCheck={false}
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`h-12 px-4 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            {...register("email")}
          />
          <AnimatePresence>
            {errors.email && (
              <m.div
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={gentleSpring}
              >
                <Text id="email-error" variant="small" className="text-destructive flex items-center gap-1.5 mt-1">
                  <m.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </m.svg>
                  {errors.email.message}
                </Text>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>

        {/* Company field */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...gentleSpring, delay: 0.2 }}
          className="space-y-2"
        >
          <m.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...bouncySpring, delay: 0.22 }}
          >
            <Label htmlFor="booking-company" className="text-sm font-medium text-foreground flex items-center gap-2">
              Company
              <span className="text-foreground-subtle text-xs">optional</span>
            </Label>
          </m.div>
          <Input
            id="booking-company"
            type="text"
            placeholder="Your company name"
            autoComplete="organization"
            className="h-12 px-4"
            {...register("company")}
          />
        </m.div>

        {/* Notes field */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...gentleSpring, delay: 0.26 }}
          className="space-y-2"
        >
          <m.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...bouncySpring, delay: 0.28 }}
          >
            <Label htmlFor="booking-notes" className="text-sm font-medium text-foreground flex items-center gap-2">
              What would you like to discuss?
              <span className="text-foreground-subtle text-xs">optional</span>
            </Label>
          </m.div>
          <Textarea
            id="booking-notes"
            placeholder="Tell us about your project, challenges, or goals..."
            className="min-h-[120px] resize-none px-4 py-3"
            {...register("notes")}
          />
        </m.div>
      </div>

      {/* Actions with enhanced button animations */}
      <m.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...gentleSpring, delay: 0.32 }}
        className="flex flex-col-reverse sm:flex-row sm:items-stretch gap-3 pt-4"
      >
        <m.button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-[4px] font-mono text-sm text-foreground-muted hover:text-foreground bg-background border border-border-secondary hover:bg-background-card hover:border-foreground-subtle transition-colors"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <m.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            whileHover={{ x: -2 }}
            transition={bouncySpring}
          >
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </m.svg>
          Back
        </m.button>
        <m.div
          className="flex-1"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={bouncySpring}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full !h-12 text-base relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <m.span
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={bouncySpring}
                  className="flex items-center gap-3"
                >
                  <m.div
                    className="relative w-5 h-5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </m.div>
                  <span>Confirming...</span>
                  <m.span
                    className="flex gap-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <m.span
                        key={i}
                        className="w-1 h-1 rounded-full bg-current"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </m.span>
                </m.span>
              ) : (
                <m.span
                  key="default"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={bouncySpring}
                  className="flex items-center gap-2"
                >
                  Confirm Booking
                  <m.svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    initial={{ x: 0 }}
                    whileHover={{ x: 2 }}
                    transition={bouncySpring}
                  >
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </m.svg>
                </m.span>
              )}
            </AnimatePresence>

            {/* Submitting shimmer effect */}
            {isSubmitting && (
              <m.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </Button>
        </m.div>
      </m.div>
    </form>
  );
}
