"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import dynamic from "next/dynamic";
import { getVariant, type VariantName } from "./variants";

// Dynamically import Three.js canvas to avoid SSR issues
const TopologyCanvas = dynamic(
  () => import("./TopologyCanvas").then((mod) => mod.TopologyCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);

interface HeroAnimationProps {
  variant?: VariantName;
}

/**
 * Three.js Flowing Topology Surface
 *
 * An undulating 3D wireframe terrain with elevated peaks representing key nodes.
 * Mouse creates ripple effects. Flow lines trace pathways like rivers of intelligence.
 *
 * Desktop: Interactive ripples responding to mouse presence
 * Mobile: Ambient waves with periodic pulses from peaks
 *
 * Design system:
 * - Colors: Orange #ee6018, warm grays #b8b3b0, dark #1f1d1c
 * - Motion: cubic-bezier(0.4, 0, 0.2, 1), 0.4-0.8s durations
 * - DPR: Capped at 2x
 * - Opacity: 0.7-0.85 final, 0.8-1s fade-in
 */
export function HeroAnimation({ variant }: HeroAnimationProps) {
  const variantConfig = getVariant(variant);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  // Track if component has mounted to handle navigation remounts
  const [isMounted, setIsMounted] = useState(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // IntersectionObserver to pause rendering when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Delayed ready state for fade-in
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => {
      clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

  // Don't render until we know which version to show and component is mounted
  if (isMobile === null || !isMounted) return null;

  return (
    <m.div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? (isMobile ? 0.85 : 1) : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      aria-hidden="true"
    >
      <TopologyCanvas
        isMobile={isMobile}
        isVisible={isVisible}
        variant={variantConfig}
      />
    </m.div>
  );
}

export default HeroAnimation;
