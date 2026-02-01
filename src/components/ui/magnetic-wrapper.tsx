"use client";

import { m } from "motion/react";
import { useMagnetic } from "@/hooks";
import { type ReactNode } from "react";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

export function MagneticWrapper({
  children,
  strength = 0.3,
  radius = 100,
  className,
}: MagneticWrapperProps) {
  const { ref, position, handlers } = useMagnetic({ strength, radius });

  return (
    <m.div
      ref={ref}
      className={className}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 20,
        mass: 0.5,
      }}
      {...handlers}
    >
      {children}
    </m.div>
  );
}
