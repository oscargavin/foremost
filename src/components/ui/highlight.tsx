import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  className?: string;
  /** Use 'subtle' for body text, 'emphasis' for key statements */
  variant?: "subtle" | "emphasis";
}

/**
 * Text highlight component for drawing attention to key phrases.
 * Use sparingly - max 1-2 per section for scannability.
 *
 * @example
 * <Text>
 *   We focus on <Highlight>business outcomes</Highlight>, not technology features.
 * </Text>
 */
export function Highlight({
  children,
  className,
  variant = "subtle"
}: HighlightProps) {
  return (
    <mark
      className={cn(
        "text-inherit rounded px-1.5 py-0.5 -mx-0.5",
        "decoration-clone box-decoration-clone",
        variant === "subtle" && "bg-accent-orange/[0.12]",
        variant === "emphasis" && "bg-accent-orange/[0.18]",
        className
      )}
    >
      {children}
    </mark>
  );
}
