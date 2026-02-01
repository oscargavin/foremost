"use client";

import { cn } from "@/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        "focus:bg-background focus:text-foreground",
        "focus:px-4 focus:py-2 focus:rounded-md",
        "focus:ring-2 focus:ring-accent-orange focus:ring-offset-2",
        "focus:outline-none",
        "font-sans text-sm"
      )}
    >
      Skip to main content
    </a>
  );
}
