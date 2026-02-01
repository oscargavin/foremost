"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { m } from "motion/react";
import { cn } from "@/lib/utils";
import { Text } from "./text";
import { createPrefetchHandler } from "@/lib/preload";

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
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((industry) => (
          <MotionLink
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            onMouseEnter={() => handleMouseEnter(industry)}
            onFocus={() => handleMouseEnter(industry)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-4 py-2.5 min-h-[44px] rounded-full inline-flex items-center",
              "bg-background-card border border-border",
              "text-sm text-foreground",
              "hover:border-foreground-secondary hover:bg-surface-subtle",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2",
              "transition-colors duration-200"
            )}
          >
            {industry.label}
          </MotionLink>
        ))}
      </div>
    </div>
  );
}
