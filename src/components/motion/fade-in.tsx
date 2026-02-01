"use client";

import { m, type Variants } from "motion/react";
import { type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

const fadeInVariants: Variants = {
  hidden: (custom: { y: number }) => ({
    opacity: 0,
    y: custom.y,
  }),
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  y = 20,
  once = true,
}: FadeInProps) {
  return (
    <m.div
      className={className}
      style={{ willChange: "opacity, transform" }}
      custom={{ y }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={fadeInVariants}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </m.div>
  );
}
