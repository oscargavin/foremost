import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingSize = "hero" | "page" | "section" | "card";

interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingSize;
  children: ReactNode;
  className?: string;
}

const sizeStyles: Record<HeadingSize, string> = {
  hero: "text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] leading-[1.1] tracking-[-1px] sm:tracking-[-1.5px] md:tracking-[-2px] lg:tracking-[-2.88px]",
  page: "text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1] tracking-[-0.5px] sm:tracking-[-1px] md:tracking-[-1.44px]",
  section: "text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1] tracking-[-0.5px] sm:tracking-[-1px] md:tracking-[-1.44px]",
  card: "text-[20px] sm:text-[22px] md:text-[24px] leading-[1.2]",
};

export function Heading({
  as: Component = "h2",
  size = "section",
  children,
  className,
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "font-sans font-normal text-foreground",
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Component>
  );
}
