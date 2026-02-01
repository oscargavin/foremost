"use client";

import { m, type Variants, AnimatePresence } from "motion/react";
import { type ReactNode } from "react";

interface FormFieldRevealProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

const fieldVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: custom * 0.08,
    },
  }),
};

export function FormFieldReveal({
  children,
  className,
  index = 0,
}: FormFieldRevealProps) {
  return (
    <m.div
      className={className}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      variants={fieldVariants}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </m.div>
  );
}

// Animated success state with spring bounce
interface FormSuccessProps {
  children: ReactNode;
  className?: string;
}

const successContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const successIconVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

const successTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export function FormSuccess({ children, className }: FormSuccessProps) {
  return (
    <m.div
      className={className}
      variants={successContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </m.div>
  );
}

export function FormSuccessIcon({ children, className }: FormSuccessProps) {
  return (
    <m.div className={className} variants={successIconVariants}>
      {children}
    </m.div>
  );
}

export function FormSuccessText({ children, className }: FormSuccessProps) {
  return (
    <m.div className={className} variants={successTextVariants}>
      {children}
    </m.div>
  );
}

// Animated error alert with shake
interface FormErrorProps {
  children: ReactNode;
  className?: string;
  isVisible: boolean;
}

const errorVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginBottom: 20,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export function FormError({ children, className, isVisible }: FormErrorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          className={className}
          variants={errorVariants}
          initial="hidden"
          animate={["visible", "shake"]}
          exit="exit"
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}
