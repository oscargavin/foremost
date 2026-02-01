import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark";
}

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[6px] border transition-[border-color,box-shadow,transform] duration-200",
        {
          "bg-background-card border-border hover:border-foreground-secondary hover:shadow-md hover:-translate-y-0.5 cursor-pointer":
            variant === "default",
          "bg-background-dark border-transparent": variant === "dark",
        },
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}
