"use client";

import { m } from "motion/react";

// Animated contact info card with hover effects
export function ContactInfoCardAnimated({
  label,
  value,
  href,
  external = false,
  index = 0,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  index?: number;
}) {
  return (
    <m.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between min-h-14 p-4 mx-0 sm:-mx-4 rounded-lg hover:bg-surface-subtle/50 transition-colors cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.1,
      }}
      whileHover={{ x: 4 }}
    >
      <div>
        <span className="font-mono text-xs text-foreground-subtle uppercase tracking-wider block mb-1">
          {label}
        </span>
        <span className="text-lg text-foreground group-hover:text-accent-orange transition-colors">
          {value}
        </span>
      </div>
      <m.svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="text-foreground-subtle group-hover:text-accent-orange transition-colors"
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <path
          d="M4.167 10h11.666M10.833 5l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </m.svg>
    </m.a>
  );
}

// Decorative corner accents with entrance animation
export function DecorativeCorners() {
  return (
    <>
      {/* Top-right corner */}
      <m.div
        className="absolute -top-3 -right-3 w-24 h-24 pointer-events-none hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.3,
        }}
      >
        <m.div
          className="w-full h-full border-t-2 border-r-2 border-accent-orange/30 rounded-tr-2xl"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
        />
      </m.div>

      {/* Bottom-left corner */}
      <m.div
        className="absolute -bottom-3 -left-3 w-16 h-16 pointer-events-none hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.4,
        }}
      >
        <div className="w-full h-full border-b-2 border-l-2 border-border rounded-bl-2xl" />
      </m.div>
    </>
  );
}

// Pulsing availability dot
export function PulsingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <m.span
        className="absolute inline-flex h-full w-full rounded-full bg-accent-orange"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.75, 0, 0.75],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <m.span
        className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-orange"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}
