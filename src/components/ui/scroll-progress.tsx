"use client";

import { m, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      className="fixed bottom-0 left-0 right-0 h-[2px] bg-accent-orange origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
