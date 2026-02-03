"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { FadeIn } from "@/components/motion";

interface CTACardProps {
  label?: string;
  topRightLink?: {
    text: string;
    href: string;
  };
  heading: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}

export function CTACard({
  label,
  topRightLink,
  heading,
  description,
  buttonText,
  buttonHref,
  className,
}: CTACardProps) {
  return (
    <div className={cn("py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-9", className)}>
      <FadeIn>
        <div className="max-w-3xl mx-auto">
          <div
            className={cn(
              "bg-background-dark rounded-xl",
              "p-8 sm:p-10 md:p-14",
              "border border-border"
            )}
          >
            {/* Top accent */}
            <div className="flex items-center gap-3 mb-10 sm:mb-12">
              <span className="w-2 h-2 rounded-full bg-accent-orange" />
              {topRightLink && (
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
                  {topRightLink.text}
                </span>
              )}
            </div>

            {/* Main content */}
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-[38px] leading-[1.2] tracking-[-0.02em] text-white mb-4 sm:mb-5">
                {heading}
              </h2>

              {description && (
                <p className="text-base sm:text-lg text-white/50 font-mono leading-relaxed mb-8 sm:mb-10">
                  {description}
                </p>
              )}

              <Button href={buttonHref} size="lg" variant="secondary" magnetic>
                {buttonText}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="ml-2"
                >
                  <path
                    d="M3.333 8h9.334M8.667 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>

            {/* Bottom label - only show if provided */}
            {label && (
              <div className="mt-12 sm:mt-14 pt-6 border-t border-white/[0.06]">
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/25">
                  {label}
                </span>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
