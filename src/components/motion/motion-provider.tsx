"use client";

import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import { type ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with Motion optimizations:
 * - LazyMotion: Reduces bundle from 34KB to ~4.6KB
 * - MotionConfig: Respects prefers-reduced-motion for accessibility
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
