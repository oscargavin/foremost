"use client";

import { m } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ReactNode, Children, isValidElement } from "react";
import { MagneticWrapper } from "./magnetic-wrapper";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  href?: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  magnetic?: boolean;
}

// Check if element is an SVG (arrow icon)
function isSvgElement(element: React.ReactElement): boolean {
  return element.type === "svg" || (typeof element.type === "string" && element.type === "svg");
}

// Wrap SVG children with motion for arrow animation
function wrapArrowIcons(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (isValidElement(child) && isSvgElement(child)) {
      return (
        <m.span
          className="inline-flex"
          variants={{
            hover: { x: 3 },
          }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {child}
        </m.span>
      );
    }
    return child;
  });
}

export function Button({
  className,
  variant = "primary",
  size = "default",
  href,
  children,
  type = "button",
  disabled,
  onClick,
  magnetic = false,
}: ButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 font-sans text-base font-normal cursor-pointer transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-[0_0_0_4px_rgba(238,96,24,0.15)]",
    "disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-background-button text-foreground-light border border-transparent rounded-[4px] hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-black/10":
        variant === "primary",
      "bg-background text-foreground border border-border-secondary rounded-[4px] hover:bg-background-card hover:border-foreground-subtle":
        variant === "secondary",
      "px-3 py-2.5 min-h-[44px] sm:min-h-9 sm:py-0 sm:h-9": size === "default",
      "px-4 h-11": size === "lg",
    },
    className
  );

  const wrappedChildren = wrapArrowIcons(children);

  const buttonContent = href ? (
    <m.div
      whileTap={{ scale: 0.98 }}
      whileHover="hover"
      className="inline-block"
    >
      <Link href={href} className={baseStyles}>
        {wrappedChildren}
      </Link>
    </m.div>
  ) : (
    <m.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={baseStyles}
      whileTap={{ scale: 0.98 }}
      whileHover="hover"
    >
      {wrappedChildren}
    </m.button>
  );

  if (magnetic) {
    return (
      <MagneticWrapper strength={0.2} radius={80} className="inline-block">
        {buttonContent}
      </MagneticWrapper>
    );
  }

  return buttonContent;
}
