"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import dynamic from "next/dynamic";

const ConstellationCanvas = dynamic(
  () => import("./ConstellationCanvas").then((mod) => mod.ConstellationCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);

export function HowWeThinkAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isMobile === null) return null;

  return (
    <m.div
      ref={containerRef}
      className="w-full h-80 md:h-96 lg:h-[28rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      aria-hidden="true"
    >
      <ConstellationCanvas isMobile={isMobile} isVisible={isVisible} />
    </m.div>
  );
}

export default HowWeThinkAnimation;
