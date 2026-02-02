"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Text } from "./text";
import { createPrefetchHandler } from "@/lib/preload";

// Container orchestrates the stagger
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

// Each pill has unique starting position for organic scatter
const getPillVariants = (index: number) => {
  // Pseudo-random offsets based on index for consistent scatter
  const xOffsets = [-20, 15, -10, 25, -15, 10];
  const rotations = [-8, 6, -4, 10, -6, 8];
  const scales = [0.3, 0.4, 0.35, 0.45, 0.3, 0.4];

  return {
    hidden: {
      opacity: 0,
      y: 60,
      x: xOffsets[index % 6],
      scale: scales[index % 6],
      rotate: rotations[index % 6],
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 18,
        mass: 1,
        opacity: { duration: 0.4, ease: "easeOut" },
      },
    },
  };
};

const INDUSTRIES = [
  { label: "Financial Services", slug: "financial-services" },
  { label: "Healthcare", slug: "healthcare" },
  { label: "Retail", slug: "retail" },
  { label: "Manufacturing", slug: "manufacturing" },
  { label: "Professional Services", slug: "professional-services" },
  { label: "Energy", slug: "energy" },
] as const;

type Industry = (typeof INDUSTRIES)[number];

const MotionLink = m.create(Link);

export function IndustryFinder() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  // Create prefetch handler with memoization
  const prefetch = useMemo(() => createPrefetchHandler(router), [router]);

  const handleMouseEnter = useCallback(
    (industry: Industry) => {
      // Prefetch on hover for faster navigation
      prefetch(`/industries/${industry.slug}`);
    },
    [prefetch]
  );

  return (
    <div className="w-full max-w-2xl">
      <Text variant="small" className="text-foreground-subtle mb-3 block">
        Explore by sector:
      </Text>
      <m.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {INDUSTRIES.map((industry, index) => (
          <MotionLink
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            onMouseEnter={() => handleMouseEnter(industry)}
            onFocus={() => handleMouseEnter(industry)}
            variants={getPillVariants(index)}
            whileHover={
              prefersReducedMotion
                ? {}
                : {
                    scale: 1.06,
                    y: -6,
                    rotate: index % 2 === 0 ? 2 : -2,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                    },
                  }
            }
            whileTap={{ scale: 0.92, rotate: 0 }}
            style={{
              willChange: "transform, opacity",
              // Staggered float animation for gentle bobbing
              animationDelay: `${index * 0.4}s`,
            }}
            className={cn(
              "px-4 py-2.5 min-h-[44px] rounded-full inline-flex items-center cursor-pointer",
              "bg-background-card border border-border",
              "text-sm text-foreground",
              "hover:border-foreground-secondary hover:bg-surface-subtle",
              "hover:shadow-lg hover:shadow-foreground/5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2",
              "transition-colors duration-200",
              // Subtle idle floating animation
              !prefersReducedMotion && "animate-float"
            )}
          >
            {industry.label}
          </MotionLink>
        ))}
      </m.div>
    </div>
  );
}
