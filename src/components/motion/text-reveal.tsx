"use client";

import { m, type Variants } from "motion/react";
import { useMemo } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  once?: boolean;
  delay?: number;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function TextReveal({
  children,
  className,
  once = true,
  delay = 0,
}: TextRevealProps) {
  const words = useMemo(() => children.split(" "), [children]);

  return (
    <m.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      style={{ display: "inline" }}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, index) => (
        <m.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block"
          style={{ marginRight: "0.25em" }}
        >
          {word}
        </m.span>
      ))}
    </m.span>
  );
}
