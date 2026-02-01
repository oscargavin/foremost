import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type PatternType = "none" | "grid" | "grid-subtle" | "dots" | "dots-sparse" | "diagonal" | "cross";
type BlendType = "none" | "border" | "shadow" | "elevated" | "gradient-top" | "gradient-bottom";

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "card";
  pattern?: PatternType;
  patternFade?: boolean;
  blend?: BlendType | BlendType[];
  id?: string;
}

const patternClasses: Record<PatternType, string> = {
  none: "",
  grid: "bg-pattern-grid",
  "grid-subtle": "bg-pattern-grid-subtle",
  dots: "bg-pattern-dots",
  "dots-sparse": "bg-pattern-dots-sparse",
  diagonal: "bg-pattern-diagonal",
  cross: "bg-pattern-cross",
};

const blendClasses: Record<BlendType, string> = {
  none: "",
  border: "section-border-top",
  shadow: "section-shadow-inset",
  elevated: "section-elevated",
  "gradient-top": "section-gradient-top",
  "gradient-bottom": "section-gradient-bottom",
};

function getBlendClasses(blend: BlendType | BlendType[] | undefined, variant: string): string {
  if (!blend || blend === "none") return "";

  const blends = Array.isArray(blend) ? blend : [blend];
  return blends.map(b => {
    // Use card-specific gradients for card variant
    if (variant === "card" && b === "gradient-top") return "section-gradient-top section-card-gradient-top";
    if (variant === "card" && b === "gradient-bottom") return "section-gradient-bottom section-card-gradient-bottom";
    return blendClasses[b];
  }).join(" ");
}

export function Section({
  children,
  className,
  variant = "default",
  pattern = "none",
  patternFade = false,
  blend,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-10 sm:py-12 md:py-16 relative",
        {
          "bg-background": variant === "default",
          "bg-background-card": variant === "card",
          "bg-background-dark text-foreground-light rounded-xl sm:rounded-2xl mx-4 sm:mx-6 md:mx-9 my-10 sm:my-12 md:my-16 section-dark-blend":
            variant === "dark",
        },
        patternClasses[pattern],
        patternFade && "bg-pattern-fade",
        getBlendClasses(blend, variant),
        className
      )}
    >
      {children}
    </section>
  );
}
