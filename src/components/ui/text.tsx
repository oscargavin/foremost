import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type TextVariant = "body" | "bodyLarge" | "muted" | "small";

interface TextProps {
  variant?: TextVariant;
  mono?: boolean;
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
  id?: string;
}

const variantStyles: Record<TextVariant, string> = {
  body: "text-base leading-[1.5] text-foreground",
  bodyLarge: "text-lg leading-[1.2] tracking-[-0.36px] text-foreground-muted",
  muted: "text-base leading-[1.5] text-foreground-muted",
  small: "text-sm text-foreground-muted",
};

export function Text({
  variant = "body",
  mono = false,
  children,
  className,
  as: Component = "p",
  id,
}: TextProps) {
  return (
    <Component
      id={id}
      className={cn(
        mono ? "font-mono" : "font-sans",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}
