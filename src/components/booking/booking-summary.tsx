"use client";

import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { Button, Text } from "@/components/ui";
import { generateCalendarLinks, type BookingResponse } from "@/lib/calcom";

interface BookingSummaryProps {
  booking: BookingResponse;
  timeZone: string;
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

const celebrationSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 15,
};

// Generate confetti-like particles for celebration
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * -150 - 50,
    rotation: Math.random() * 360,
    scale: 0.3 + Math.random() * 0.7,
    delay: Math.random() * 0.3,
  }));
}

function formatDateTime(isoString: string, timeZone: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }) + " at " + date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
}

export function BookingSummary({ booking, timeZone }: BookingSummaryProps) {
  const calendarLinks = generateCalendarLinks(booking);
  const shouldReduceMotion = useReducedMotion();
  const particles = useMemo(() => generateParticles(12), []);

  return (
    <div className="py-4 sm:py-8">
      {/* Success animation - large, celebratory with particles */}
      <m.div
        className="mb-8 sm:mb-12 text-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Celebration particles */}
        {!shouldReduceMotion && (
          <div className="absolute left-1/2 top-12 -translate-x-1/2 pointer-events-none">
            {particles.map((particle) => (
              <m.div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: particle.id % 3 === 0 ? "#ee6018" : particle.id % 3 === 1 ? "#f59e0b" : "#fbbf24",
                }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: particle.x,
                  y: particle.y,
                  scale: particle.scale,
                  rotate: particle.rotation,
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.3 + particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Success icon with ring animation */}
        <div className="relative inline-block">
          {/* Expanding ring */}
          <m.div
            className="absolute inset-0 rounded-full bg-accent-orange/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <m.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...celebrationSpring, delay: 0.1 }}
            className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-orange/10 mb-6 sm:mb-8"
          >
            {/* Pulsing glow */}
            <m.div
              className="absolute inset-0 rounded-full bg-accent-orange/10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <m.svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              className="text-accent-orange sm:w-12 sm:h-12 relative z-10"
            >
              <m.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <m.path
                d="M12 24l10 10 14-18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
            </m.svg>
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...gentleSpring, delay: 0.4 }}
        >
          <m.span
            className="font-mono text-xs text-accent-orange tracking-wider uppercase block mb-2 sm:mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...bouncySpring, delay: 0.5 }}
          >
            Confirmed
          </m.span>
          <m.h2
            className="text-2xl sm:text-3xl lg:text-4xl text-foreground mb-3 sm:mb-4"
            style={{ letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...gentleSpring, delay: 0.55 }}
          >
            You&apos;re all set
          </m.h2>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <Text variant="muted" className="font-mono text-xs sm:text-sm max-w-md mx-auto px-2">
              We&apos;ve sent a confirmation to your email with the meeting details and calendar invite.
            </Text>
          </m.div>
        </m.div>
      </m.div>

      {/* Booking details - card style with staggered reveals */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...gentleSpring, delay: 0.5 }}
        className="border border-border rounded-xl overflow-hidden bg-background-card mb-8"
        whileHover={{ borderColor: "rgba(238, 96, 24, 0.3)" }}
      >
        {/* Header */}
        <m.div
          className="px-6 py-4 border-b border-border bg-surface-subtle/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <m.div
              className="w-10 h-10 rounded-full bg-accent-orange/10 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...bouncySpring, delay: 0.65 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-accent-orange">
                <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 7h14M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </m.div>
            <m.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...gentleSpring, delay: 0.7 }}
            >
              <p className="text-sm font-medium text-foreground">{booking.title}</p>
              <p className="font-mono text-xs text-foreground-muted">30 min video call</p>
            </m.div>
          </div>
        </m.div>

        {/* Details with stagger */}
        <div className="px-6 py-5 space-y-4">
          <m.div
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...gentleSpring, delay: 0.75 }}
          >
            <m.svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="text-foreground-muted mt-0.5"
              animate={!shouldReduceMotion ? { rotate: [0, 5, -5, 0] } : undefined}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
            >
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </m.svg>
            <div>
              <p className="font-mono text-xs text-foreground-muted uppercase tracking-wider mb-1">When</p>
              <p className="text-foreground">{formatDateTime(booking.startTime, timeZone)}</p>
            </div>
          </m.div>

          <m.div
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...gentleSpring, delay: 0.85 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-foreground-muted mt-0.5">
              <path d="M3 5l6 4 6-4M3 5v8a2 2 0 002 2h8a2 2 0 002-2V5M3 5a2 2 0 012-2h8a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="font-mono text-xs text-foreground-muted uppercase tracking-wider mb-1">Confirmation ID</p>
              <m.p
                className="text-foreground font-mono text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {booking.uid}
              </m.p>
            </div>
          </m.div>
        </div>
      </m.div>

      {/* Add to calendar with enhanced interactions */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...gentleSpring, delay: 0.7 }}
        className="mb-8 sm:mb-10"
      >
        <m.p
          className="font-mono text-xs text-foreground-muted uppercase tracking-wider mb-3 sm:mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...bouncySpring, delay: 0.75 }}
        >
          Add to calendar
        </m.p>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-3">
          {[
            { href: calendarLinks.google, label: "Google", icon: "M12 4a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm0 1v5l3.5 2" },
            { href: calendarLinks.outlook, label: "Outlook", icon: "M4 6l8 5 8-5M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6a2 2 0 012-2h12a2 2 0 012 2" },
            { href: calendarLinks.ics, label: "Download .ics", icon: "M12 14l-4-4h3V4h2v6h3l-4 4zM20 16v4H4v-4H2v5a1 1 0 001 1h18a1 1 0 001-1v-5h-2z", download: `foremost-booking-${booking.uid}.ics` },
          ].map((cal, index) => (
            <m.a
              key={cal.label}
              href={cal.href}
              target={cal.download ? undefined : "_blank"}
              rel={cal.download ? undefined : "noopener noreferrer"}
              download={cal.download}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...bouncySpring, delay: 0.8 + index * 0.08 }}
              className="inline-flex items-center justify-center gap-2 min-h-12 px-4 py-3 rounded-lg border border-border bg-background-card font-mono text-sm"
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(238, 96, 24, 0.5)",
                transition: { duration: 0.15 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <m.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-foreground-muted"
                whileHover={{ rotate: cal.download ? 180 : 10 }}
                transition={bouncySpring}
              >
                <path d={cal.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </m.svg>
              {cal.label}
            </m.a>
          ))}
        </div>
      </m.div>

      {/* Return home with enhanced button */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center pt-6 border-t border-border"
      >
        <m.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={bouncySpring}
        >
          <Button variant="secondary" href="/" className="inline-flex items-center gap-2 group">
            <m.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              initial={{ x: 0 }}
              whileHover={{ x: -3 }}
              transition={bouncySpring}
            >
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </m.svg>
            Return to Home
          </Button>
        </m.div>
      </m.div>
    </div>
  );
}
