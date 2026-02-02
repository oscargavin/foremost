import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  className?: string;
  /** Use 'subtle' for body text, 'emphasis' for key statements */
  variant?: "subtle" | "emphasis";
}

/**
 * Text highlight component with marker pen effect.
 * Creates a hand-drawn highlighter appearance using CSS gradients.
 *
 * Technique from: https://max.hn/blog/how-to-create-a-highlighter-marker-effect-in-css
 * - Gradient starts dim, quickly jumps to peak at 4%, then fades
 * - Asymmetric border-radius mimics hand-drawn strokes
 * - Negative horizontal margins let highlight extend beyond words
 * - box-decoration-break: clone fixes multi-line rendering
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
  // Using brand orange (238, 96, 24) instead of yellow
  // Opacity scaled down from original (0.1, 0.7, 0.3) for subtlety
  const opacity = variant === "emphasis"
    ? { start: 0.08, peak: 0.28, end: 0.15 }
    : { start: 0.05, peak: 0.18, end: 0.10 };

  return (
    <mark
      className={cn(
        "text-inherit",
        // Critical for multi-line highlights
        "[box-decoration-break:clone]",
        className
      )}
      style={{
        // Horizontal negative margin extends highlight beyond text
        // Matching padding maintains visual balance
        margin: "0 -0.4em",
        padding: "0.1em 0.4em",
        // Two-value border-radius: first applies to top-left/bottom-right,
        // second to top-right/bottom-left - creates diagonal asymmetry
        borderRadius: "0.8em 0.3em",
        // Gradient: dim start -> peak at 4% -> fade out
        // Simulates marker ink application
        background: `linear-gradient(
          to right,
          rgba(238, 96, 24, ${opacity.start}),
          rgba(238, 96, 24, ${opacity.peak}) 4%,
          rgba(238, 96, 24, ${opacity.end})
        )`,
      }}
    >
      {children}
    </mark>
  );
}
