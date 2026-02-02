"use client";

import { ReactNode } from "react";
import { Section, Container } from "@/components/layout";
import { HeroAnimation } from "./hero-animation";
import type { VariantName } from "./hero-animation/variants";

interface HeroSectionProps {
  children: ReactNode;
  className?: string;
  /** Animation variant for subtle per-page differences */
  variant?: VariantName;
}

/**
 * Reusable hero section with topology animation background and gradient scrim.
 * Used across home, who-we-are, and other main pages.
 */
export function HeroSection({ children, className = "", variant }: HeroSectionProps) {
  return (
    <Section className={`pt-32 pb-20 relative overflow-hidden ${className}`}>
      <HeroAnimation variant={variant} />
      {/* Gradient scrim for text readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-r from-background via-background/50 to-transparent"
      />
      <Container className="relative z-10">
        <div className="max-w-4xl">
          {children}
        </div>
      </Container>
    </Section>
  );
}
